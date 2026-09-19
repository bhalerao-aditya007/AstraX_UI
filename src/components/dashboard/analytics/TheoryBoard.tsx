// src/components/dashboard/analytics/TheoryBoard.tsx
// Normalisation logic and props unchanged.
// The active theory is the ONE element in the app allowed the rotating conic
// border — it is the single most consequential claim on the screen, and it
// carries the permanent, non-dismissible hypothesis label.

import { useState, useEffect } from "react";
import Icon from "../../ui/Icon";
import ConfidenceBadge from "../../ui/ConfidenceBadge";
import SourceCitationPopover from "../../ui/SourceCitationPopover";
import Chip, { Kicker } from "../../ui/Chip";
import EmptyState from "../../ui/EmptyState";
import { RevealGroup, RevealItem, SegmentedControl } from "../../motion";
import { mockTheories, type CrimeTheory } from "../../../data/mockCaseData";
import { USE_MOCK_API } from "../../../config";

interface TheoryBoardProps {
    onJumpToLead?: (leadId: string) => void;
    data?: CrimeTheory[];
}

export default function TheoryBoard({ onJumpToLead, data }: TheoryBoardProps) {
    const normalizeTheories = (rawList: CrimeTheory[]): any[] =>
        (rawList || []).map((raw: any, idx) => ({
            ...raw,
            id: raw.id || `th-${idx + 1}`,
            version: raw.version || `v${idx + 1}`,
            title: raw.title || raw.hypothesisName || "Reconstructed investigation theory",
            rationale:
                raw.rationale ||
                raw.summary ||
                "Synthesised from corroborated cross-modal case evidence.",
            confidence: raw.confidence || 0.94,
            isSuperseded: raw.isSuperseded ?? false,
            sequence:
                Array.isArray(raw.sequence) && raw.sequence.length > 0
                    ? raw.sequence
                    : Array.isArray(raw.verificationSteps) && raw.verificationSteps.length > 0
                      ? raw.verificationSteps.map((step: string, sIdx: number) => ({
                            stepNumber: sIdx + 1,
                            description: step,
                            confidence: raw.confidence || 0.94,
                            citation: {
                                documentTitle: raw.supportingEvidence?.[0] || "Primary case file",
                                confidenceScore: 0.95,
                            },
                        }))
                      : [
                            {
                                stepNumber: 1,
                                description:
                                    raw.summary ||
                                    "Initial incident reconstruction synthesised from primary evidence.",
                                confidence: raw.confidence || 0.94,
                                citation: {
                                    documentTitle: "Evidentiary synthesis",
                                    confidenceScore: 0.95,
                                },
                            },
                        ],
            unresolvedGaps:
                Array.isArray(raw.unresolvedGaps) && raw.unresolvedGaps.length > 0
                    ? raw.unresolvedGaps
                    : Array.isArray(raw.counterEvidence) && raw.counterEvidence.length > 0
                      ? raw.counterEvidence.map((ce: string, gIdx: number) => ({
                            gapTitle: ce,
                            linkedLeadId: `lead-${gIdx + 1}`,
                        }))
                      : [],
        }));

    const initialTheories = normalizeTheories(
        data !== undefined ? data : USE_MOCK_API ? mockTheories : []
    );
    const [theories, setTheories] = useState<any[]>(initialTheories);
    const [activeVersion, setActiveVersion] = useState<string>(
        initialTheories[0]?.version || "v1"
    );

    useEffect(() => {
        if (data !== undefined) {
            const normalized = normalizeTheories(data);
            setTheories(normalized);
            if (normalized[0]) setActiveVersion(normalized[0].version);
        }
    }, [data]);

    const currentTheory = theories.find((t) => t.version === activeVersion) || theories[0];

    const header = (
        <div className="flex flex-col items-start justify-between gap-3 border-b border-surface-300 pb-3 sm:flex-row sm:items-center">
            <div>
                <Kicker tone="hypothesis">Crime reconstruction</Kicker>
                <p className="mt-1.5 text-xs text-surface-500">
                    Multi-hypothesis event sequences synthesised by link-analysis models.
                </p>
            </div>
            {theories.length > 0 && (
                <SegmentedControl
                    size="sm"
                    layoutId="theory-version-pill"
                    items={theories.map((t) => ({
                        id: t.version,
                        label: `${t.version}${t.isSuperseded ? " · superseded" : ""}`,
                    }))}
                    value={activeVersion}
                    onChange={setActiveVersion}
                />
            )}
        </div>
    );

    if (theories.length === 0 || !currentTheory) {
        return (
            <div className="flex flex-col gap-4">
                {header}
                <EmptyState
                    icon="scale-justice"
                    title="No crime theories synthesised yet"
                    body="Theories compile once multiple corroborated exhibits have been evaluated by the link-prediction engine."
                    stamp="0 hypotheses"
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {header}

            <div
                className={`space-y-5 rounded-xl border border-surface-300 bg-surface-100/70 p-5 ${
                    currentTheory.isSuperseded ? "opacity-80" : "conic-ring"
                }`}
            >
                {/* Non-dismissible hypothesis label — DESIGN.md §8 */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-300/80 pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <Chip tone="hypothesis" size="md" dot>
                            Investigative hypothesis — not a finding
                        </Chip>
                        {currentTheory?.supersedesVersion && (
                            <span className="font-mono text-[11px] text-surface-500">
                                supersedes {currentTheory.supersedesVersion}
                            </span>
                        )}
                    </div>
                    <ConfidenceBadge
                        score={currentTheory.overallConfidenceScore ?? currentTheory.confidence}
                        size="md"
                    />
                </div>

                <div>
                    <h4 className="font-display text-lg font-bold leading-snug tracking-tight text-surface-900">
                        {currentTheory.title}
                    </h4>
                    <p className="mt-2 rounded-lg border border-surface-300/70 bg-surface-0/50 p-3 font-mono text-[11px] leading-relaxed text-surface-600">
                        <strong className="text-surface-500">Synthesis basis: </strong>
                        {currentTheory.rationale}
                    </p>
                </div>

                <div>
                    <Kicker tone="ember">Reconstructed sub-event sequence</Kicker>
                    <RevealGroup className="relative ml-2 mt-3 space-y-3 border-l border-surface-300 pl-6">
                        {(currentTheory.sequence || []).map((step: any) => (
                            <RevealItem key={step.stepNumber} className="relative">
                                <span className="absolute -left-[31px] top-2 flex h-5 w-5 items-center justify-center rounded-full border border-ember-500/60 bg-surface-0 font-mono text-[10px] font-bold text-ember-300">
                                    {step.stepNumber}
                                </span>
                                <div className="rounded-lg border border-surface-300 bg-surface-0/50 p-3 text-xs">
                                    <div className="flex items-start justify-between gap-3">
                                        <p className="font-medium leading-relaxed text-surface-700">
                                            {step.description}
                                        </p>
                                        <div className="flex shrink-0 items-center gap-2">
                                            <ConfidenceBadge
                                                score={step.confidence}
                                                size="sm"
                                                showPercentage={false}
                                            />
                                            <SourceCitationPopover source={step.citation} />
                                        </div>
                                    </div>
                                </div>
                            </RevealItem>
                        ))}
                    </RevealGroup>
                </div>

                {(currentTheory.unresolvedGaps || []).length > 0 && (
                    <div className="border-t border-surface-300/80 pt-4">
                        <Kicker tone="neutral">
                            Unresolved gaps — cross-linked to the lead board
                        </Kicker>
                        <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                            {(currentTheory.unresolvedGaps || []).map((gap: any, i: number) => (
                                <div
                                    key={i}
                                    className="hypothesis-surface flex flex-col justify-between gap-2 rounded-lg border border-purple-500/40 bg-purple-500/6 p-3 text-xs"
                                >
                                    <span className="font-semibold leading-tight text-surface-700">
                                        {gap.gapTitle}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (!onJumpToLead) return;
                                            onJumpToLead("lead-board");
                                            setTimeout(() => {
                                                const el = document.getElementById(gap.linkedLeadId);
                                                if (el) {
                                                    el.scrollIntoView({
                                                        behavior: "smooth",
                                                        block: "center",
                                                    });
                                                    el.classList.add("ring-2", "ring-purple-500");
                                                    setTimeout(
                                                        () =>
                                                            el.classList.remove(
                                                                "ring-2",
                                                                "ring-purple-500"
                                                            ),
                                                        3000
                                                    );
                                                }
                                            }, 500);
                                        }}
                                        className="inline-flex cursor-pointer items-center justify-between rounded border border-purple-500/40 bg-purple-500/15 px-2 py-1 font-mono text-[10px] text-purple-200 transition-colors hover:bg-purple-500/25"
                                    >
                                        <span>Inspect lead</span>
                                        <Icon name="arrow-right" size={9} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
