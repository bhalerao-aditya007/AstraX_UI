// src/components/dashboard/analytics/IdentityResolutionView.tsx
// Props and data resolution unchanged. The comparison pane now reads as a
// side-by-side disambiguation sheet: target on the left, candidate on the
// right, matching vs conflicting attributes stated explicitly.

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { mockIdentityResolution } from "../../../data/mockCaseData";
import ConfidenceBadge from "../../ui/ConfidenceBadge";
import Icon from "../../ui/Icon";
import Chip, { Kicker } from "../../ui/Chip";
import EmptyState from "../../ui/EmptyState";
import { RevealGroup, RevealItem } from "../../motion";
import { USE_MOCK_API } from "../../../config";

interface IdentityResolutionViewProps {
    onSelectCandidate?: (candidate: any) => void;
    data?: typeof mockIdentityResolution;
}

export default function IdentityResolutionView({
    onSelectCandidate,
    data,
}: IdentityResolutionViewProps) {
    const rawData =
        data !== undefined
            ? data
            : USE_MOCK_API
              ? mockIdentityResolution
              : { target: "Active subject", candidates: [] };

    const activeData = {
        target: (rawData as any)?.target || "Active subject",
        candidates: Array.isArray((rawData as any)?.candidates) ? (rawData as any).candidates : [],
    };

    const [selectedCand, setSelectedCand] = useState(activeData.candidates[0]?.id || "cand-1");

    useEffect(() => {
        if (activeData.candidates.length > 0) setSelectedCand(activeData.candidates[0].id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const activeCand =
        activeData.candidates.find((c: any) => c.id === selectedCand) || activeData.candidates[0];

    const handleSelect = (cand: any) => {
        setSelectedCand(cand.id);
        onSelectCandidate?.({
            id: cand.id,
            label: cand.name,
            type: "candidate_merge",
            confidence: (cand.confidence || 90) / 100,
            details: {
                target: activeData.target,
                source: cand.source,
                matchingAttributes: Array.isArray(cand.matchingAttributes)
                    ? cand.matchingAttributes.join(", ")
                    : "",
                conflictingAttributes: Array.isArray(cand.conflictingAttributes)
                    ? cand.conflictingAttributes.join(", ")
                    : "",
            },
            merge_reason: cand.reasoning || "Matched on primary KYC attributes.",
        });
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col items-start justify-between gap-3 border-b border-surface-300 pb-3 sm:flex-row sm:items-center">
                <div>
                    <Kicker tone="ember">Entity de-duplication</Kicker>
                    <p className="mt-1.5 text-xs text-surface-500">
                        Target entity{" "}
                        <span className="font-mono font-semibold text-ember-300">
                            {activeData.target}
                        </span>{" "}
                        — cross-system disambiguation.
                    </p>
                </div>
                <Chip tone="steel" size="sm">
                    Levenshtein + C-DOT phonetic
                </Chip>
            </div>

            {activeData.candidates.length === 0 ? (
                <EmptyState
                    icon="fingerprint"
                    title="No disambiguation conflicts"
                    body="Every extracted entity carries unambiguous identifiers. No unresolved phonetic or KYC aliases are pending review."
                    stamp="0 conflicts"
                />
            ) : (
                <div className="flex flex-col gap-5 lg:flex-row">
                    {/* Candidate list */}
                    <RevealGroup className="flex w-full flex-col gap-2.5 lg:w-1/3">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-surface-500">
                            Candidate profiles ({activeData.candidates.length})
                        </span>
                        {activeData.candidates.map((cand: any) => {
                            const active = selectedCand === cand.id;
                            return (
                                <RevealItem
                                    key={cand.id}
                                    onClick={() => handleSelect(cand)}
                                    className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
                                        active
                                            ? "tag-spine border-ember-500/45 bg-ember-500/10"
                                            : "border-surface-300 bg-surface-100/60 hover:border-surface-400"
                                    }`}
                                >
                                    <div className="mb-2 flex items-start justify-between gap-2">
                                        <div className="text-sm font-semibold text-surface-900">
                                            {cand.name}
                                        </div>
                                        <ConfidenceBadge
                                            score={cand.confidence}
                                            size="sm"
                                            showPercentage={false}
                                        />
                                    </div>
                                    <div className="font-mono text-[11px] text-surface-500">
                                        {cand.source}
                                    </div>
                                </RevealItem>
                            );
                        })}
                    </RevealGroup>

                    {/* Comparison pane */}
                    {activeCand && (
                        <div className="flex-1 overflow-hidden rounded-xl border border-surface-300 bg-surface-100/60">
                            <div className="flex items-center justify-between border-b border-surface-300/80 bg-surface-200/30 p-4">
                                <div className="flex items-center gap-2">
                                    <Icon name="scale-justice" size={14} className="text-ember-300" />
                                    <h4 className="font-display text-xs font-bold uppercase tracking-wider text-surface-900">
                                        Attribute comparison
                                    </h4>
                                </div>
                                <ConfidenceBadge score={activeCand.confidence} size="sm" />
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeCand.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                                    className="space-y-5 p-6"
                                >
                                    <div className="flex items-center justify-center gap-6">
                                        <div className="text-center">
                                            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full border-2 border-surface-300 bg-surface-200 text-lg font-bold text-surface-500">
                                                {activeData.target.charAt(0)}
                                            </div>
                                            <div className="text-sm font-semibold text-surface-900">
                                                {activeData.target}
                                            </div>
                                            <div className="font-mono text-[10px] uppercase text-surface-500">
                                                target FIR node
                                            </div>
                                        </div>

                                        <div className="relative h-px max-w-[110px] flex-1 bg-surface-300">
                                            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-surface-100 px-2 font-mono text-[10px] font-bold text-ember-300">
                                                VS
                                            </span>
                                        </div>

                                        <div className="text-center">
                                            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full border-2 border-ember-500/40 bg-ember-500/12 text-lg font-bold text-ember-300">
                                                {activeCand.name.charAt(0)}
                                            </div>
                                            <div className="text-sm font-semibold text-surface-900">
                                                {activeCand.name}
                                            </div>
                                            <div className="font-mono text-[10px] uppercase text-surface-500">
                                                {activeCand.source}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/6 p-3">
                                            <Kicker tone="neutral">Matching attributes</Kicker>
                                            <ul className="mt-2 space-y-1 font-mono text-[11px] text-surface-600">
                                                {(activeCand.matchingAttributes || []).map(
                                                    (a: string, i: number) => (
                                                        <li key={i} className="flex items-start gap-1.5">
                                                            <Icon
                                                                name="check-circle"
                                                                size={10}
                                                                className="mt-0.5 shrink-0 text-emerald-400"
                                                            />
                                                            <span>{a}</span>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>

                                        <div className="rounded-lg border border-amber-500/30 bg-amber-500/6 p-3">
                                            <Kicker tone="neutral">Conflicting attributes</Kicker>
                                            <ul className="mt-2 space-y-1 font-mono text-[11px] text-surface-600">
                                                {(activeCand.conflictingAttributes || []).length === 0 ? (
                                                    <li className="text-surface-500">none recorded</li>
                                                ) : (
                                                    (activeCand.conflictingAttributes || []).map(
                                                        (a: string, i: number) => (
                                                            <li
                                                                key={i}
                                                                className="flex items-start gap-1.5"
                                                            >
                                                                <Icon
                                                                    name="alert-triangle"
                                                                    size={10}
                                                                    className="mt-0.5 shrink-0 text-amber-400"
                                                                />
                                                                <span>{a}</span>
                                                            </li>
                                                        )
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    </div>

                                    {activeCand.reasoning && (
                                        <div className="rounded-lg border border-surface-300 bg-surface-0/50 p-3 text-xs leading-relaxed text-surface-600">
                                            <strong className="mb-1 block text-surface-800">
                                                Disambiguation rationale
                                            </strong>
                                            {activeCand.reasoning}
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
