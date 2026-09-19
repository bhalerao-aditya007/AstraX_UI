// src/components/dashboard/analytics/LeadBoard.tsx
// Normalisation logic and props unchanged. Cards are now tilt-responsive
// evidence slips; resolving a lead plays the "link confirmed" snap.

import { useState, useEffect } from "react";
import Icon from "../../ui/Icon";
import ConfidenceBadge from "../../ui/ConfidenceBadge";
import Chip, { Kicker } from "../../ui/Chip";
import { RevealGroup, RevealItem, TiltCard } from "../../motion";
import { mockPhantomLeads, type PhantomLead } from "../../../data/mockCaseData";
import { USE_MOCK_API } from "../../../config";

const COLUMNS: Array<{ id: PhantomLead["status"]; label: string; tone: "hypothesis" | "alert" | "confirmed" | "neutral" }> = [
    { id: "open", label: "Open leads", tone: "hypothesis" },
    { id: "requested", label: "Data requested", tone: "alert" },
    { id: "resolved", label: "Resolved / merged", tone: "confirmed" },
    { id: "dismissed", label: "Dismissed", tone: "neutral" },
];

interface LeadBoardProps {
    onSelectLead?: (lead: PhantomLead) => void;
    data?: PhantomLead[];
}

export default function LeadBoard({ onSelectLead, data }: LeadBoardProps) {
    const normalizeLeads = (rawLeads: any[]): PhantomLead[] =>
        (rawLeads || []).map((l, idx) => {
            const rawStatus = (l.status || "").toLowerCase();
            const status: PhantomLead["status"] = rawStatus.includes("resolv")
                ? "resolved"
                : rawStatus.includes("dismiss")
                  ? "dismissed"
                  : rawStatus.includes("pend") || rawStatus.includes("request")
                    ? "requested"
                    : "open";

            const partialAttrs = l.partialAttributes || {
                "Lead priority": l.priority || "HIGH",
                "Assigned investigator": l.assignedTo || "Field officer",
                "Target entity": l.targetEntity || "Subject of interest",
            };

            return {
                id: l.id || `lead-${idx + 1}`,
                title: l.title || "Evidentiary investigation lead",
                phantomType: l.phantomType || "person",
                confidenceScore: l.confidenceScore ?? l.confidence ?? 0.92,
                status,
                partialAttributes: partialAttrs,
                recommendedAction:
                    l.recommendedAction || l.summary || "Verify corroborating evidence and interrogate leads.",
                sourceDocument: l.sourceDocument || "Primary incident record",
                dateIdentified: l.dateIdentified || "2026-09-04",
                originEvidence: l.originEvidence || "Primary incident record",
            };
        });

    const [leads, setLeads] = useState<PhantomLead[]>(
        normalizeLeads(data !== undefined ? data : USE_MOCK_API ? mockPhantomLeads : [])
    );
    const [snapped, setSnapped] = useState<string | null>(null);

    useEffect(() => {
        if (data !== undefined) setLeads(normalizeLeads(data));
    }, [data]);

    const advanceStatus = (leadId: string, nextStatus: PhantomLead["status"]) => {
        setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: nextStatus } : l)));
        if (nextStatus === "resolved") {
            setSnapped(leadId);
            window.setTimeout(() => setSnapped(null), 700);
        }
    };

    const openCount = leads.filter((l) => l.status === "open").length;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col items-start justify-between gap-2 border-b border-surface-300 pb-3 sm:flex-row sm:items-center">
                <div>
                    <Kicker tone="ember">Phantom entity lifecycle</Kicker>
                    <p className="mt-1.5 text-xs text-surface-500">
                        Unconfirmed node slots, partial identifier attributes and operational
                        subpoena requests.
                    </p>
                </div>
                <Chip tone="hypothesis" size="sm" dot>
                    {openCount} open unresolved
                </Chip>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {COLUMNS.map((col) => {
                    const columnLeads = leads.filter((l) => l.status === col.id);
                    return (
                        <div
                            key={col.id}
                            className="flex min-h-[320px] flex-col rounded-xl border border-surface-300 bg-surface-100/50 p-3"
                        >
                            <div className="mb-3 flex items-center justify-between border-b border-surface-300/70 pb-2.5">
                                <Chip tone={col.tone} size="xs" dot>
                                    {col.label}
                                </Chip>
                                <span className="rounded bg-surface-200 px-1.5 py-0.5 font-mono text-[10px] text-surface-500">
                                    {columnLeads.length}
                                </span>
                            </div>

                            <RevealGroup className="flex-1 space-y-3 overflow-y-auto pr-0.5">
                                {columnLeads.length === 0 ? (
                                    <div className="flex h-28 items-center justify-center rounded-lg border border-dashed border-surface-300/80 text-center font-mono text-[10px] text-surface-500">
                                        nothing at this stage
                                    </div>
                                ) : (
                                    columnLeads.map((lead) => (
                                        <RevealItem key={lead.id}>
                                            <TiltCard max={5}>
                                                <div
                                                    id={lead.id}
                                                    onClick={() => onSelectLead?.(lead)}
                                                    className={`hypothesis-surface shine-sweep group flex cursor-pointer flex-col gap-2.5 rounded-lg border border-purple-500/40 bg-surface-0/70 p-3.5 transition-all hover:border-purple-400 ${
                                                        snapped === lead.id ? "link-snap" : ""
                                                    }`}
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <Chip tone="hypothesis" size="xs">
                                                            {lead.phantomType}
                                                        </Chip>
                                                        <ConfidenceBadge
                                                            score={lead.confidenceScore ?? 0.85}
                                                            size="sm"
                                                            showPercentage={false}
                                                        />
                                                    </div>

                                                    <h4 className="text-xs font-bold leading-snug text-surface-900 transition-colors group-hover:text-purple-200">
                                                        {lead.title}
                                                    </h4>

                                                    <div className="space-y-1 rounded border border-surface-300/70 bg-surface-100/60 p-2 font-mono text-[10px]">
                                                        {Object.entries(lead.partialAttributes || {}).map(
                                                            ([k, v]) => (
                                                                <div
                                                                    key={k}
                                                                    className="flex justify-between gap-2"
                                                                >
                                                                    <span className="capitalize text-surface-500">
                                                                        {k}
                                                                    </span>
                                                                    <span className="truncate font-semibold text-surface-700">
                                                                        {String(v)}
                                                                    </span>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>

                                                    <p className="text-[11px] leading-snug text-surface-500">
                                                        <strong className="text-surface-600">Action:</strong>{" "}
                                                        {lead.recommendedAction}
                                                    </p>

                                                    <div className="flex items-center justify-between border-t border-surface-300/70 pt-2 font-mono text-[10px]">
                                                        <span className="text-surface-500">advance</span>
                                                        <div className="flex items-center gap-1">
                                                            {lead.status === "open" && (
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        advanceStatus(lead.id, "requested");
                                                                    }}
                                                                    className="cursor-pointer rounded border border-amber-500/30 bg-amber-500/12 px-2 py-0.5 text-amber-300 transition-colors hover:bg-amber-500/25"
                                                                >
                                                                    request data →
                                                                </button>
                                                            )}
                                                            {lead.status === "requested" && (
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        advanceStatus(lead.id, "resolved");
                                                                    }}
                                                                    className="cursor-pointer rounded border border-emerald-500/30 bg-emerald-500/12 px-2 py-0.5 text-emerald-300 transition-colors hover:bg-emerald-500/25"
                                                                >
                                                                    confirm link ✓
                                                                </button>
                                                            )}
                                                            {lead.status !== "dismissed" ? (
                                                                <button
                                                                    type="button"
                                                                    title="Dismiss lead"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        advanceStatus(lead.id, "dismissed");
                                                                    }}
                                                                    className="cursor-pointer rounded bg-surface-200 px-1.5 py-0.5 text-surface-500 transition-colors hover:text-red-400"
                                                                >
                                                                    <Icon name="cross" size={9} />
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        advanceStatus(lead.id, "open");
                                                                    }}
                                                                    className="cursor-pointer rounded bg-surface-200 px-2 py-0.5 text-surface-600 transition-colors hover:text-surface-900"
                                                                >
                                                                    reopen
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TiltCard>
                                        </RevealItem>
                                    ))
                                )}
                            </RevealGroup>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
