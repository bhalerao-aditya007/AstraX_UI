// src/components/dashboard/analytics/IdentityResolutionView.tsx
import { useState, useEffect } from "react";
import { mockIdentityResolution } from "../../../data/mockCaseData";
import ConfidenceBadge from "../../ui/ConfidenceBadge";
import Icon from "../../ui/Icon";
import { USE_MOCK_API } from "../../../config";

interface IdentityResolutionViewProps {
    onSelectCandidate?: (candidate: any) => void;
    data?: typeof mockIdentityResolution;
}

export default function IdentityResolutionView({ onSelectCandidate, data }: IdentityResolutionViewProps) {
    const rawData = data !== undefined ? data : (USE_MOCK_API ? mockIdentityResolution : { target: "Active Subject", candidates: [] });
    const activeData = {
        target: rawData?.target || "Active Subject",
        candidates: Array.isArray(rawData?.candidates) ? rawData.candidates : [],
    };

    const [selectedCand, setSelectedCand] = useState(activeData.candidates[0]?.id || "cand-1");

    useEffect(() => {
        if (activeData.candidates.length > 0) {
            setSelectedCand(activeData.candidates[0].id);
        }
    }, [data]);

    const activeCand = activeData.candidates.find((c) => c.id === selectedCand) || activeData.candidates[0];

    const handleSelect = (cand: typeof mockIdentityResolution.candidates[0]) => {
        setSelectedCand(cand.id);
        if (onSelectCandidate) {
            onSelectCandidate({
                id: cand.id,
                label: cand.name,
                type: "candidate_merge",
                confidence: (cand.confidence || 90) / 100,
                details: {
                    target: activeData.target,
                    source: cand.source,
                    matchingAttributes: Array.isArray(cand.matchingAttributes) ? cand.matchingAttributes.join(", ") : "",
                    conflictingAttributes: Array.isArray(cand.conflictingAttributes) ? cand.conflictingAttributes.join(", ") : "",
                },
                merge_reason: cand.reasoning || `Matched on primary KYC attributes.`,
            });
        }
    };

    return (
        <div className="flex flex-col bg-surface-0 rounded-xl border border-surface-300 p-5 font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-surface-300">
                <div>
                    <h3 className="text-base font-bold text-surface-900 tracking-tight flex items-center gap-2">
                        <Icon name="fingerprint" size={17} className="text-insignia-400" />
                        <span>Entity De-duplication & Identity Resolution</span>
                    </h3>
                    <p className="text-xs text-surface-500 mt-0.5">
                        Target Entity: <span className="font-bold text-insignia-400 font-mono">{activeData.target}</span> - Cross-system disambiguation.
                    </p>
                </div>

                <div className="text-xs font-mono text-surface-400 bg-surface-100 border border-surface-200 px-2.5 py-1 rounded">
                    <span>Active Matching Engine: Levenshtein + C-DOT Phonetic</span>
                </div>
            </div>

            {activeData.candidates.length === 0 ? (
                <div className="rounded-xl border border-surface-300 bg-surface-100 p-8 text-center flex flex-col items-center justify-center">
                    <div className="h-10 w-10 rounded-full bg-surface-200 flex items-center justify-center text-surface-400 mb-2">
                        <Icon name="fingerprint" size={20} />
                    </div>
                    <h4 className="text-sm font-bold text-surface-800">No Disambiguation Conflicts</h4>
                    <p className="mt-1 text-xs text-surface-500 max-w-sm">
                        All extracted entities across case documents possess unambiguous identifiers. No unresolved phonetic or KYC aliases pending review.
                    </p>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Candidates List */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-3">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-surface-500">
                            Candidate Profiles ({activeData.candidates.length})
                        </span>
                        {activeData.candidates.map((cand) => (
                            <div 
                                key={cand.id}
                                onClick={() => handleSelect(cand)}
                                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                                    selectedCand === cand.id 
                                        ? "bg-insignia-500/10 border-insignia-500/60 shadow-sm" 
                                        : "bg-surface-100/70 border-surface-300 hover:border-surface-400 hover:bg-surface-100"
                                }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="font-bold text-surface-900 text-sm">{cand.name}</div>
                                    <ConfidenceBadge score={cand.confidence} size="sm" />
                                </div>
                                <div className="text-xs font-mono text-surface-500">
                                    Source: <span className="text-surface-400">{cand.source}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Comparison Panel */}
                    {activeCand && (
                        <div className="flex-1 bg-surface-100 rounded-xl border border-surface-300 flex flex-col overflow-hidden">
                            <div className="p-4 border-b border-surface-200/80 bg-surface-200/40 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Icon name="scale-justice" size={14} className="text-insignia-400" />
                                    <h4 className="font-bold text-surface-900 text-xs uppercase tracking-wider">
                                        Entity Attribute Comparison
                                    </h4>
                                </div>
                                <ConfidenceBadge score={activeCand.confidence} size="sm" />
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Visual Avatar Comparison */}
                                <div className="flex items-center gap-6 justify-center">
                                    <div className="text-center">
                                        <div className="w-14 h-14 rounded-full bg-surface-200 border-2 border-surface-300 flex items-center justify-center text-lg font-bold text-surface-400 mx-auto mb-2">
                                            {activeData.target.charAt(0)}
                                        </div>
                                        <div className="font-bold text-sm text-surface-900">{activeData.target}</div>
                                        <div className="text-[10px] font-mono text-surface-500 uppercase">Target FIR Node</div>
                                    </div>
                                    
                                    <div className="flex-1 max-w-[100px] h-0.5 bg-surface-300 relative">
                                        <div className="absolute left-1/2 -top-2.5 transform -translate-x-1/2 bg-surface-100 px-2 font-mono text-[10px] font-bold text-insignia-400">
                                            VS
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <div className="w-14 h-14 rounded-full bg-insignia-500/15 border-2 border-insignia-500/40 flex items-center justify-center text-lg font-bold text-insignia-400 mx-auto mb-2">
                                            {activeCand.name.charAt(0)}
                                        </div>
                                        <div className="font-bold text-sm text-surface-900">{activeCand.name}</div>
                                        <div className="text-[10px] font-mono text-surface-500 uppercase">{activeCand.source}</div>
                                    </div>
                                </div>

                                {activeCand.reasoning && (
                                    <div className="bg-surface-0 border border-surface-300 rounded-lg p-3 text-xs text-surface-700 leading-relaxed">
                                        <span className="font-bold text-surface-900 block mb-1">Disambiguation Rationale:</span>
                                        {activeCand.reasoning}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
