// src/components/dashboard/analytics/MOMatchList.tsx
import { useState, useEffect } from "react";
import Icon from "../../ui/Icon";
import ConfidenceBadge from "../../ui/ConfidenceBadge";
import { mockMOMatches, type MOMatch } from "../../../data/mockCaseData";

interface MOMatchListProps {
    onSelectMatch?: (match: MOMatch) => void;
    data?: MOMatch[];
}

import { USE_MOCK_API } from "../../../config";

export default function MOMatchList({ onSelectMatch, data }: MOMatchListProps) {
    const [matches, setMatches] = useState<MOMatch[]>(data !== undefined ? data : (USE_MOCK_API ? mockMOMatches : []));
    const [expandedId, setExpandedId] = useState<string | null>(data && data[0] ? data[0].id : null);

    useEffect(() => {
        if (data !== undefined) {
            setMatches(data);
            if (data[0]) setExpandedId(data[0].id);
        }
    }, [data]);

    return (
        <div className="flex flex-col gap-4 font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-300 pb-3">
                <div>
                    <h3 className="text-base font-bold text-surface-900 tracking-tight flex items-center gap-2">
                        <Icon name="radar" size={16} className="text-insignia-400" />
                        <span>Modus Operandi (MO) Similarity & Serial Crime Linkages</span>
                    </h3>
                    <p className="text-xs text-surface-500 mt-0.5">
                        Cross-jurisdictional case vector matching across geospatial, temporal, and narrative pattern dimensions.
                    </p>
                </div>
                <div className="text-xs font-mono text-surface-400 bg-surface-100 border border-surface-200 px-2.5 py-1 rounded">
                    <span>Ranked against 14,280 state records</span>
                </div>
            </div>

            <div className="space-y-3">
                {matches.length === 0 ? (
                    <div className="rounded-xl border border-surface-300 bg-surface-100 p-8 text-center flex flex-col items-center justify-center">
                        <div className="h-10 w-10 rounded-full bg-surface-200 flex items-center justify-center text-surface-400 mb-2">
                            <Icon name="radar" size={20} />
                        </div>
                        <h4 className="text-sm font-bold text-surface-800">No Historical MO Matches Found</h4>
                        <p className="mt-1 text-xs text-surface-500 max-w-sm">
                            No cross-jurisdiction serial matches detected above the similarity threshold for this case.
                        </p>
                    </div>
                ) : (
                    matches.map((rawItem) => {
                    const item = {
                        ...rawItem,
                        title: rawItem.title || (rawItem as any).modusOperandi || "Pattern Match",
                        matchedCaseId: rawItem.matchedCaseId || ((rawItem as any).matchedCases?.[0]) || "Case Linkage",
                        overallSimilarity: rawItem.overallSimilarity ?? (rawItem as any).similarityScore ?? 0.88,
                        geospatialSimilarity: rawItem.geospatialSimilarity ?? 0.85,
                        temporalSimilarity: rawItem.temporalSimilarity ?? 0.82,
                        textSimilarity: rawItem.textSimilarity ?? (rawItem as any).similarityScore ?? 0.90,
                        commonFactors: rawItem.commonFactors || (rawItem as any).commonIndicators || [],
                        dateReported: rawItem.dateReported || "Recent",
                        jurisdiction: rawItem.jurisdiction || "Incident Precinct",
                        status: rawItem.status || "Active Linkage",
                    };
                    const isExpanded = expandedId === item.id;

                    return (
                        <div
                            key={item.id}
                            className={`rounded-xl border transition-all ${
                                isExpanded
                                    ? "border-insignia-500/50 bg-surface-100/95 shadow-md"
                                    : "border-surface-300 bg-surface-100/60 hover:border-surface-400 hover:bg-surface-100"
                            }`}
                        >
                            {/* Row Header */}
                            <div
                                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                                className="flex cursor-pointer items-center justify-between p-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-insignia-500/15 border border-insignia-500/30 text-insignia-400 font-mono text-xs font-bold">
                                        {(item.overallSimilarity * 100).toFixed(0)}%
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs font-bold text-insignia-400">
                                                {item.matchedCaseId}
                                            </span>
                                            <span
                                                className={`rounded px-1.5 py-0.2 text-[10px] font-mono font-bold uppercase ${
                                                    item.status === "Active Linkage"
                                                        ? "bg-emerald-950/70 text-emerald-300 border border-emerald-500/30"
                                                        : "bg-surface-200 text-surface-400"
                                                }`}
                                            >
                                                {item.status}
                                            </span>
                                        </div>
                                        <h4 className="text-sm font-bold text-surface-900 mt-0.5">
                                            {item.title}
                                        </h4>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="hidden md:flex flex-col text-right font-mono text-[11px] text-surface-500">
                                        <span>{item.jurisdiction}</span>
                                        <span>Reported: {item.dateReported}</span>
                                    </div>
                                    <Icon
                                        name="chevron-down"
                                        size={16}
                                        className={`text-surface-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                                    />
                                </div>
                            </div>

                            {/* Expanded Feature Comparison */}
                            {isExpanded && (
                                <div className="border-t border-surface-200/80 p-4 space-y-4 bg-surface-0/60">
                                    {/* 3-Dimensional Similarity Scores */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div className="rounded-lg border border-surface-300 bg-surface-100 p-3 flex flex-col justify-between">
                                            <span className="text-[10px] font-mono text-surface-500 uppercase tracking-wider">
                                                Geospatial Proximity
                                            </span>
                                            <div className="flex items-baseline justify-between mt-1">
                                                <span className="font-mono text-lg font-bold text-surface-900">
                                                    {(item.geospatialSimilarity * 100).toFixed(1)}%
                                                </span>
                                                <span className="text-xs text-surface-400">Radius &lt; 15km</span>
                                            </div>
                                            <div className="w-full bg-surface-300 h-1.5 rounded-full mt-2 overflow-hidden">
                                                <div
                                                    className="bg-insignia-500 h-full rounded-full"
                                                    style={{ width: `${item.geospatialSimilarity * 100}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="rounded-lg border border-surface-300 bg-surface-100 p-3 flex flex-col justify-between">
                                            <span className="text-[10px] font-mono text-surface-500 uppercase tracking-wider">
                                                Temporal Cadence
                                            </span>
                                            <div className="flex items-baseline justify-between mt-1">
                                                <span className="font-mono text-lg font-bold text-surface-900">
                                                    {(item.temporalSimilarity * 100).toFixed(1)}%
                                                </span>
                                                <span className="text-xs text-surface-400">Night window correlation</span>
                                            </div>
                                            <div className="w-full bg-surface-300 h-1.5 rounded-full mt-2 overflow-hidden">
                                                <div
                                                    className="bg-blue-500 h-full rounded-full"
                                                    style={{ width: `${item.temporalSimilarity * 100}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="rounded-lg border border-surface-300 bg-surface-100 p-3 flex flex-col justify-between">
                                            <span className="text-[10px] font-mono text-surface-500 uppercase tracking-wider">
                                                MO Text / Narrative NLP
                                            </span>
                                            <div className="flex items-baseline justify-between mt-1">
                                                <span className="font-mono text-lg font-bold text-surface-900">
                                                    {(item.textSimilarity * 100).toFixed(1)}%
                                                </span>
                                                <span className="text-xs text-surface-400">Embedding vector match</span>
                                            </div>
                                            <div className="w-full bg-surface-300 h-1.5 rounded-full mt-2 overflow-hidden">
                                                <div
                                                    className="bg-purple-500 h-full rounded-full"
                                                    style={{ width: `${item.textSimilarity * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Common Factors Checklist */}
                                    <div>
                                        <h5 className="text-xs font-bold uppercase tracking-wider text-surface-400 mb-2 flex items-center gap-2">
                                            <Icon name="check-circle" size={13} className="text-emerald-400" />
                                            <span>Corroborating Modus Operandi Traits</span>
                                        </h5>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                            {(item.commonFactors || (item as any).commonIndicators || []).map((factor: string, i: number) => (
                                                <div
                                                    key={i}
                                                    className="flex items-start gap-2 rounded bg-surface-100 p-2 text-surface-700 border border-surface-200 font-mono text-[11px]"
                                                >
                                                    <span className="text-insignia-400 font-bold">•</span>
                                                    <span>{factor}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                }))}
            </div>
        </div>
    );
}
