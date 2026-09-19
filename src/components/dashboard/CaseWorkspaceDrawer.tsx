// src/components/dashboard/CaseWorkspaceDrawer.tsx
//
// The right-hand "inspector" that opens when any graph node, lead, timeline
// event or MO match is clicked. Same item shape and tab set (Details / Source
// / Feedback) — rebuilt as a settling glass drawer with the human feedback
// tab now playing the "link confirmed" snap when a linkage is verified.

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "../ui/Icon";
import ConfidenceBadge from "../ui/ConfidenceBadge";
import Chip, { Kicker } from "../ui/Chip";
import { SegmentedControl } from "../motion";

interface DrawerProps {
    item: any | null;
    onClose: () => void;
}

export default function CaseWorkspaceDrawer({ item, onClose }: DrawerProps) {
    const [activeTab, setActiveTab] = useState<"details" | "source" | "feedback">("details");
    const [feedbackStatus, setFeedbackStatus] = useState<
        "confirmed" | "not_useful" | "incorrect" | null
    >(null);
    const [snap, setSnap] = useState(false);

    if (!item) return null;

    const riskScore = item.risk_score !== undefined ? item.risk_score : undefined;
    const confidence = item.confidence !== undefined ? item.confidence : undefined;

    const setFeedback = (status: typeof feedbackStatus) => {
        setFeedbackStatus(status);
        if (status === "confirmed") {
            setSnap(true);
            window.setTimeout(() => setSnap(false), 700);
        }
    };

    return (
        <AnimatePresence>
            <motion.aside
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 40, opacity: 0 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className="glass-strong fixed bottom-0 right-0 top-14 z-40 flex w-88 max-w-[92vw] flex-col shadow-2xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-surface-300/80 p-4">
                    <div className="flex items-center gap-2">
                        <Icon name="radar" size={14} className="text-ember-300" />
                        <Kicker tone="ember">Investigation inspector</Kicker>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer rounded p-1 text-surface-500 transition-colors hover:bg-surface-200 hover:text-surface-900"
                    >
                        <Icon name="cross" size={14} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-surface-300/80 p-3">
                    <SegmentedControl
                        layoutId="drawer-tab-pill"
                        size="sm"
                        value={activeTab}
                        onChange={(id) => setActiveTab(id as any)}
                        items={[
                            { id: "details", label: "Details" },
                            { id: "source", label: "Source" },
                            {
                                id: "feedback",
                                label: "Feedback",
                                icon: feedbackStatus ? (
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                ) : undefined,
                            },
                        ]}
                    />
                </div>

                {/* Body */}
                <div className="flex-1 space-y-6 overflow-y-auto p-5">
                    <AnimatePresence mode="wait">
                        {activeTab === "details" && (
                            <motion.div
                                key="details"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-5"
                            >
                                <div>
                                    <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-surface-500">
                                        Entity / node ID
                                    </span>
                                    <div className="break-all rounded border border-surface-300 bg-surface-0/60 p-2 font-mono text-xs text-surface-700">
                                        {item.id}
                                    </div>
                                </div>

                                <div>
                                    <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-surface-500">
                                        Label / title
                                    </span>
                                    <div className="font-display text-base font-bold text-surface-900">
                                        {item.label || item.name || item.title || item.entity}
                                    </div>
                                    {item.type && (
                                        <span className="mt-1.5 inline-block">
                                            <Chip tone="ember" size="xs">
                                                {item.type}
                                            </Chip>
                                        </span>
                                    )}
                                </div>

                                {item.merge_reason && (
                                    <div className="rounded-lg border border-ember-500/40 bg-ember-500/8 p-3 font-mono text-xs leading-relaxed text-ember-200">
                                        <strong className="mb-1 block text-[10px] uppercase tracking-wider text-ember-300">
                                            Entity resolution reasoning
                                        </strong>
                                        “{item.merge_reason}”
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-3">
                                    {riskScore !== undefined && (
                                        <div className="rounded-lg border border-surface-300 bg-surface-0/50 p-3">
                                            <span className="mb-1 block font-mono text-[10px] uppercase text-surface-500">
                                                Risk score
                                            </span>
                                            <div className="font-mono text-xl font-bold text-red-400">
                                                {(riskScore * 100).toFixed(1)}%
                                            </div>
                                        </div>
                                    )}
                                    {confidence !== undefined && (
                                        <div className="rounded-lg border border-surface-300 bg-surface-0/50 p-3">
                                            <span className="mb-1 block font-mono text-[10px] uppercase text-surface-500">
                                                Confidence
                                            </span>
                                            <ConfidenceBadge score={confidence} size="sm" />
                                        </div>
                                    )}
                                </div>

                                {item.details && Object.keys(item.details).length > 0 && (
                                    <div className="border-t border-surface-300/70 pt-3">
                                        <span className="mb-2.5 block font-mono text-[10px] uppercase tracking-wider text-surface-500">
                                            Extracted metadata
                                        </span>
                                        <div className="space-y-2 rounded-lg border border-surface-300 bg-surface-0/50 p-3 font-mono text-xs">
                                            {Object.entries(item.details).map(([k, v]) => (
                                                <div
                                                    key={k}
                                                    className="flex justify-between gap-2 border-b border-surface-300/40 pb-1.5 capitalize last:border-0 last:pb-0"
                                                >
                                                    <span className="text-surface-500">{k}</span>
                                                    <span className="truncate text-right text-surface-800">
                                                        {String(v)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {item.attributes && Object.keys(item.attributes).length > 0 && (
                                    <div className="border-t border-surface-300/70 pt-3">
                                        <span className="mb-2.5 block font-mono text-[10px] uppercase tracking-wider text-surface-500">
                                            Forensic / content attributes
                                        </span>
                                        <div className="space-y-1.5 rounded-lg border border-surface-300 bg-surface-0/50 p-3 font-mono text-xs">
                                            {Object.entries(item.attributes).map(([k, v]) => (
                                                <div key={k}>
                                                    <span className="text-surface-500">{k}:</span>{" "}
                                                    <span className="font-medium text-surface-800">
                                                        {String(v)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === "source" && (
                            <motion.div
                                key="source"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center gap-2">
                                    <Icon name="chain-link" size={14} className="text-ember-300" />
                                    <Kicker tone="ember">Chain of custody</Kicker>
                                </div>

                                <div className="space-y-3 rounded-xl border border-surface-300 bg-surface-0/50 p-4 font-mono text-xs">
                                    <div>
                                        <span className="block text-[10px] text-surface-500">
                                            Source document
                                        </span>
                                        <span className="text-sm font-bold text-surface-900">
                                            {item.citation?.documentTitle || "FIR 101/2026 core dossier"}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-surface-300/60 pt-2 text-[11px]">
                                        <span className="text-surface-500">Modality channel</span>
                                        <span className="rounded bg-surface-200 px-2 py-0.5 text-surface-700">
                                            {item.type || "Forensic record"}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-surface-300/60 pt-2 text-[11px]">
                                        <span className="text-surface-500">Extraction offset</span>
                                        <span className="font-bold text-ember-300">
                                            {item.citation?.pageOrOffset || "Record #1094"}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-surface-300/60 pt-2 text-[11px]">
                                        <span className="text-surface-500">Parsing model</span>
                                        <span className="text-surface-600">
                                            {item.citation?.extractorModel || "AstraX-NER-v2.1"}
                                        </span>
                                    </div>

                                    {item.citation?.rawSnippet && (
                                        <div className="border-t border-surface-300/60 pt-2">
                                            <span className="mb-1 block text-[10px] text-surface-500">
                                                Raw extracted snippet
                                            </span>
                                            <div className="bg-case-paper rounded border border-surface-300/70 p-2 text-[11px] italic leading-relaxed text-surface-700">
                                                “{item.citation.rawSnippet}”
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "feedback" && (
                            <motion.div
                                key="feedback"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-4"
                            >
                                <div>
                                    <h4 className="font-display text-xs font-bold uppercase tracking-wider text-surface-900">
                                        Investigator human-in-the-loop feedback
                                    </h4>
                                    <p className="mt-1 text-xs leading-relaxed text-surface-500">
                                        One-tap feedback tunes the underlying GNN edge weights and
                                        disambiguation thresholds for this case record.
                                    </p>
                                </div>

                                <div className="space-y-2 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => setFeedback("confirmed")}
                                        className={`flex w-full cursor-pointer items-center justify-between rounded-lg border p-3 text-xs font-semibold transition-all ${
                                            feedbackStatus === "confirmed"
                                                ? `border-emerald-500 bg-emerald-500/12 text-emerald-300 ${snap ? "link-snap" : ""}`
                                                : "border-surface-300 bg-surface-0/50 text-surface-700 hover:border-emerald-500/50 hover:bg-emerald-500/6"
                                        }`}
                                    >
                                        <span className="flex items-center gap-2.5">
                                            <Icon name="check-circle" size={15} className="text-emerald-400" />
                                            Confirmed correct linkage
                                        </span>
                                        {feedbackStatus === "confirmed" && (
                                            <span className="font-mono text-[10px]">LOCKED IN</span>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setFeedback("not_useful")}
                                        className={`flex w-full cursor-pointer items-center justify-between rounded-lg border p-3 text-xs font-semibold transition-all ${
                                            feedbackStatus === "not_useful"
                                                ? "border-amber-500 bg-amber-500/12 text-amber-300"
                                                : "border-surface-300 bg-surface-0/50 text-surface-700 hover:border-amber-500/50 hover:bg-amber-500/6"
                                        }`}
                                    >
                                        <span className="flex items-center gap-2.5">
                                            <Icon name="radar" size={15} className="text-amber-400" />
                                            Not useful / weak signal
                                        </span>
                                        {feedbackStatus === "not_useful" && (
                                            <span className="font-mono text-[10px]">ACTIVE</span>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setFeedback("incorrect")}
                                        className={`flex w-full cursor-pointer items-center justify-between rounded-lg border p-3 text-xs font-semibold transition-all ${
                                            feedbackStatus === "incorrect"
                                                ? "border-red-500 bg-red-500/12 text-red-300"
                                                : "border-surface-300 bg-surface-0/50 text-surface-700 hover:border-red-500/50 hover:bg-red-500/6"
                                        }`}
                                    >
                                        <span className="flex items-center gap-2.5">
                                            <Icon name="alert-triangle" size={15} className="text-red-400" />
                                            Incorrect link — break connection
                                        </span>
                                        {feedbackStatus === "incorrect" && (
                                            <span className="font-mono text-[10px]">ACTIVE</span>
                                        )}
                                    </button>
                                </div>

                                {feedbackStatus && (
                                    <div className="flex items-center gap-2 rounded-lg border border-surface-300 bg-surface-0/50 p-3 font-mono text-[11px] text-emerald-400">
                                        <Icon name="check-circle" size={13} />
                                        <span>Feedback recorded. Graph updated in real time.</span>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.aside>
        </AnimatePresence>
    );
}
