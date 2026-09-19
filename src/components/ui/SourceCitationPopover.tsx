// src/components/ui/SourceCitationPopover.tsx
// Public interface unchanged (CitationSource, source/children/className).
// DESIGN.md §7: every AI insight keeps a clickable "view source" affordance.

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "./Icon";
import ConfidenceBadge from "./ConfidenceBadge";
import { Kicker } from "./Chip";

export interface CitationSource {
    documentTitle?: string;
    documentType?: "image" | "text" | "voice" | "video" | "cdr" | "cctv";
    pageOrOffset?: string;
    extractedAt?: string;
    confidenceScore?: number;
    rawSnippet?: string;
    extractorModel?: string;
}

interface SourceCitationPopoverProps {
    source?: CitationSource;
    children?: React.ReactNode;
    className?: string;
}

export default function SourceCitationPopover({
    source,
    children,
    className = "",
}: SourceCitationPopoverProps) {
    const [isOpen, setIsOpen] = useState(false);

    if (!source || !source.documentTitle) {
        return children ? <>{children}</> : null;
    }

    return (
        <span className={`relative inline-block ${className}`}>
            {children ? (
                <span
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(!isOpen);
                    }}
                    className="cursor-pointer border-b border-dotted border-ember-400/60 transition-colors hover:border-ember-300 hover:text-ember-200"
                    title="Click to view extraction source"
                >
                    {children}
                </span>
            ) : (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(!isOpen);
                    }}
                    title="View extraction citation"
                    className={`ml-1.5 inline-flex cursor-pointer items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] transition-colors ${
                        isOpen
                            ? "border-ember-500/50 bg-ember-500/15 text-ember-200"
                            : "border-surface-300 bg-surface-200/60 text-surface-500 hover:border-ember-500/40 hover:text-ember-300"
                    }`}
                >
                    <Icon name="chain-link" size={10} />
                    <span>src</span>
                </button>
            )}

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen(false);
                            }}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.98 }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            onClick={(e) => e.stopPropagation()}
                            className="glass-strong absolute right-0 top-full z-50 mt-2 w-72 max-w-[calc(100vw-2.5rem)] rounded-xl p-4 text-left shadow-2xl sm:w-80"
                        >
                            <div className="mb-3 flex items-start justify-between gap-2 border-b border-surface-300/70 pb-2">
                                <Kicker tone="ember">Chain of Custody</Kicker>
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="cursor-pointer p-1 text-surface-500 hover:text-surface-900"
                                >
                                    <Icon name="cross" size={11} />
                                </button>
                            </div>

                            <div className="space-y-2.5 text-xs">
                                <div>
                                    <span className="block font-mono text-[10px] uppercase tracking-wider text-surface-500">
                                        Document / Channel
                                    </span>
                                    <span className="break-words font-semibold text-surface-800">
                                        {source.documentTitle}
                                    </span>
                                </div>

                                {source.pageOrOffset && (
                                    <div className="flex items-center justify-between font-mono text-[11px]">
                                        <span className="text-surface-500">Location ref</span>
                                        <span className="rounded bg-surface-200 px-1.5 py-0.5 text-surface-700">
                                            {source.pageOrOffset}
                                        </span>
                                    </div>
                                )}

                                {source.confidenceScore !== undefined && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] text-surface-500">Model confidence</span>
                                        <ConfidenceBadge score={source.confidenceScore} size="sm" />
                                    </div>
                                )}

                                {source.extractorModel && (
                                    <div className="flex items-center justify-between font-mono text-[11px]">
                                        <span className="text-surface-500">Extractor</span>
                                        <span className="text-surface-600">{source.extractorModel}</span>
                                    </div>
                                )}

                                {source.rawSnippet && (
                                    <div className="border-t border-surface-300/70 pt-2">
                                        <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-surface-500">
                                            Raw extracted excerpt
                                        </span>
                                        <div className="bg-case-paper max-h-28 overflow-y-auto rounded border border-surface-300/80 p-2 font-mono text-[11px] italic leading-relaxed text-surface-700">
                                            “{source.rawSnippet}”
                                        </div>
                                    </div>
                                )}

                                {source.extractedAt && (
                                    <div className="pt-1 text-right font-mono text-[10px] text-surface-500">
                                        Extracted {source.extractedAt}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </span>
    );
}
