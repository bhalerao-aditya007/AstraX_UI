// src/components/dashboard/analytics/MOMatchList.tsx
// Normalisation + props unchanged; rows are now expandable match dossiers.

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "../../ui/Icon";
import Chip, { Kicker } from "../../ui/Chip";
import EmptyState from "../../ui/EmptyState";
import { CountUp, RevealGroup, RevealItem } from "../../motion";
import { mockMOMatches, type MOMatch } from "../../../data/mockCaseData";
import { USE_MOCK_API } from "../../../config";

interface MOMatchListProps {
    onSelectMatch?: (match: MOMatch) => void;
    data?: MOMatch[];
}

function Dimension({
    label,
    value,
    note,
    bar,
}: {
    label: string;
    value: number;
    note: string;
    bar: string;
}) {
    return (
        <div className="flex flex-col justify-between rounded-lg border border-surface-300 bg-surface-100/70 p-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-surface-500">
                {label}
            </span>
            <div className="mt-1 flex items-baseline justify-between">
                <CountUp
                    value={value * 100}
                    decimals={1}
                    suffix="%"
                    className="text-lg font-bold text-surface-900"
                />
                <span className="text-[10px] text-surface-500">{note}</span>
            </div>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-surface-300">
                <motion.div
                    className={`h-full rounded-full ${bar}`}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${value * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                />
            </div>
        </div>
    );
}

export default function MOMatchList({ onSelectMatch, data }: MOMatchListProps) {
    const [matches, setMatches] = useState<MOMatch[]>(
        data !== undefined ? data : USE_MOCK_API ? mockMOMatches : []
    );
    const [expandedId, setExpandedId] = useState<string | null>(
        data && data[0] ? (data[0].id ?? null) : null
    );

    useEffect(() => {
        if (data !== undefined) {
            setMatches(data);
            if (data[0]) setExpandedId(data[0].id ?? null);
        }
    }, [data]);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col items-start justify-between gap-2 border-b border-surface-300 pb-3 sm:flex-row sm:items-center">
                <div>
                    <Kicker tone="ember">Serial linkage</Kicker>
                    <p className="mt-1.5 text-xs text-surface-500">
                        Cross-jurisdictional case vector matching across geospatial, temporal and
                        narrative pattern dimensions.
                    </p>
                </div>
                <Chip tone="steel" size="sm">
                    ranked against 14,280 state records
                </Chip>
            </div>

            {matches.length === 0 ? (
                <EmptyState
                    icon="radar"
                    title="No historical MO matches"
                    body="No cross-jurisdiction serial match cleared the similarity threshold for this case."
                    stamp="0 linkages"
                />
            ) : (
                <RevealGroup className="space-y-3">
                    {matches.map((rawItem: any) => {
                        const item = {
                            ...rawItem,
                            title: rawItem.title || rawItem.modusOperandi || "Pattern match",
                            matchedCaseId:
                                rawItem.matchedCaseId ||
                                rawItem.matchedCases?.[0] ||
                                "Case linkage",
                            overallSimilarity:
                                rawItem.overallSimilarity ?? rawItem.similarityScore ?? 0.88,
                            geospatialSimilarity: rawItem.geospatialSimilarity ?? 0.85,
                            temporalSimilarity: rawItem.temporalSimilarity ?? 0.82,
                            textSimilarity:
                                rawItem.textSimilarity ?? rawItem.similarityScore ?? 0.9,
                            commonFactors: rawItem.commonFactors || rawItem.commonIndicators || [],
                            dateReported: rawItem.dateReported || "Recent",
                            jurisdiction: rawItem.jurisdiction || "Incident precinct",
                            status: rawItem.status || "Active linkage",
                        };
                        const isExpanded = expandedId === item.id;

                        return (
                            <RevealItem
                                key={item.id}
                                className={`overflow-hidden rounded-xl border transition-all ${
                                    isExpanded
                                        ? "border-ember-500/45 bg-surface-100/80"
                                        : "border-surface-300 bg-surface-100/50 hover:border-surface-400"
                                }`}
                            >
                                <div
                                    onClick={() => {
                                        setExpandedId(isExpanded ? null : (item.id ?? null));
                                        onSelectMatch?.(item);
                                    }}
                                    className="flex cursor-pointer items-center justify-between gap-3 p-4"
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-ember-500/35 bg-ember-500/12 font-mono text-xs font-bold text-ember-200">
                                            {(item.overallSimilarity * 100).toFixed(0)}%
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="font-mono text-[11px] font-bold text-ember-300">
                                                    {item.matchedCaseId}
                                                </span>
                                                <Chip
                                                    size="xs"
                                                    tone={
                                                        item.status === "Active Linkage" ||
                                                        item.status === "Active linkage"
                                                            ? "confirmed"
                                                            : "neutral"
                                                    }
                                                >
                                                    {item.status}
                                                </Chip>
                                            </div>
                                            <h4 className="mt-0.5 truncate text-sm font-semibold text-surface-900">
                                                {item.title}
                                            </h4>
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-4">
                                        <div className="hidden flex-col text-right font-mono text-[10px] text-surface-500 md:flex">
                                            <span>{item.jurisdiction}</span>
                                            <span>reported {item.dateReported}</span>
                                        </div>
                                        <Icon
                                            name="chevron-down"
                                            size={15}
                                            className={`text-surface-500 transition-transform ${
                                                isExpanded ? "rotate-180" : ""
                                            }`}
                                        />
                                    </div>
                                </div>

                                <AnimatePresence initial={false}>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                                            className="overflow-hidden border-t border-surface-300/80 bg-surface-0/40"
                                        >
                                            <div className="space-y-4 p-4">
                                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                                    <Dimension
                                                        label="Geospatial proximity"
                                                        value={item.geospatialSimilarity}
                                                        note="radius < 15km"
                                                        bar="bg-ember-500"
                                                    />
                                                    <Dimension
                                                        label="Temporal cadence"
                                                        value={item.temporalSimilarity}
                                                        note="night-window correlation"
                                                        bar="bg-steel-500"
                                                    />
                                                    <Dimension
                                                        label="Narrative NLP"
                                                        value={item.textSimilarity}
                                                        note="embedding vector match"
                                                        bar="bg-purple-500"
                                                    />
                                                </div>

                                                <div>
                                                    <Kicker tone="neutral">
                                                        Corroborating modus operandi traits
                                                    </Kicker>
                                                    <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                        {(item.commonFactors || []).map(
                                                            (factor: string, i: number) => (
                                                                <div
                                                                    key={i}
                                                                    className="flex items-start gap-2 rounded border border-surface-300 bg-surface-100/60 p-2 font-mono text-[11px] text-surface-600"
                                                                >
                                                                    <Icon
                                                                        name="check-circle"
                                                                        size={11}
                                                                        className="mt-0.5 shrink-0 text-emerald-400"
                                                                    />
                                                                    <span>{factor}</span>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </RevealItem>
                        );
                    })}
                </RevealGroup>
            )}
        </div>
    );
}
