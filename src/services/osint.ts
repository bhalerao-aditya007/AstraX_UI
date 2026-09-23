// src/services/osint.ts
//
// OSINT API service — talks to the Rust backend's /api/cases/:id/osint endpoints.
// Also provides a graph adapter that converts OSINT findings to knowledge-graph
// nodes/edges styled in tech-blue with dashed edges so they never read as GNN hypotheses.

import { apiRequest } from "./api";

// ── Types ───────────────────────────────────────────────────────────────

export interface OsintFinding {
    finding_type:
        | "geolocation"
        | "device"
        | "timestamp"
        | "phone_profile"
        | "phone_invalid"
        | "typosquat"
        | "social_account"
        | string;
    label: string;
    attributes: Record<string, unknown>;
    confidence: number;
    source_url?: string | null;
    tool: string;
    tool_args?: unknown;
    raw_sha256: string;
    collected_at: string;
    egress_used?: boolean;
    source_document?: string;
    document_id?: string;
}

export interface CaseOsintResponse {
    case_id: string;
    total: number;
    findings: OsintFinding[];
}

export interface EnrichResponse {
    case_id: string;
    documents_scanned: number;
    total_findings: number;
}

// ── API calls ───────────────────────────────────────────────────────────

export async function getCaseOsint(caseId: string): Promise<CaseOsintResponse> {
    return apiRequest<CaseOsintResponse>(`/api/cases/${caseId}/osint`);
}

export async function enrichCaseOsint(caseId: string): Promise<EnrichResponse> {
    return apiRequest<EnrichResponse>(`/api/cases/${caseId}/osint/enrich`, {
        method: "POST",
    });
}

// ── Graph adapter ───────────────────────────────────────────────────────

import type { GraphNode, GraphEdge } from "./analytics";

/**
 * Convert OSINT findings to graph nodes/edges.
 * Styled in tech-blue with dotted edges so they never read as GNN hypotheses.
 */
export function osintFindingsToGraph(
    findings: OsintFinding[],
    anchorLabel = "Case Subject",
): { nodes: GraphNode[]; edges: GraphEdge[] } {
    const nodes: GraphNode[] = [
        {
            id: "osint-anchor",
            label: anchorLabel,
            type: "person",
            badge: "OSINT Anchor",
            risk_score: 0.5,
        },
    ];
    const edges: GraphEdge[] = [];

    findings.forEach((f, i) => {
        const id = `osint-${i}`;

        const type =
            f.finding_type === "geolocation"
                ? "location"
                : f.finding_type === "device"
                  ? "device"
                  : f.finding_type === "typosquat"
                    ? "company"
                    : f.finding_type === "social_account"
                      ? "phantom"
                      : f.finding_type.startsWith("phone")
                        ? "phone"
                        : "evidence";

        nodes.push({
            id,
            label: f.label,
            type,
            badge: `${f.tool.toUpperCase()} · ${(f.confidence * 100).toFixed(0)}%`,
            risk_score: f.confidence,
            is_phantom: f.finding_type === "social_account" && f.confidence < 0.6,
            merge_reason: `Collected by ${f.tool} at ${f.collected_at} · SHA-256 ${f.raw_sha256.slice(0, 16)}…`,
        });

        edges.push({
            id: `osint-edge-${i}`,
            source: "osint-anchor",
            target: id,
            label: f.finding_type.replace(/_/g, " "),
            color: "#3b82f6",
            weight: Math.max(1, Math.round(f.confidence * 3)),
            is_hypothesis: f.confidence < 0.6,
        });
    });

    return { nodes, edges };
}
