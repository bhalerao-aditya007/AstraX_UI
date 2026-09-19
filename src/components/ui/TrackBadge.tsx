// src/components/ui/TrackBadge.tsx
// Props unchanged. Rebuilt on Chip + a proper spatial tooltip.

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "./Icon";
import Chip, { Kicker } from "./Chip";

interface TrackBadgeProps {
    track: 1 | 2;
    triageReason?: string;
    showReasonInline?: boolean;
    size?: "sm" | "md";
    className?: string;
}

export default function TrackBadge({
    track,
    triageReason,
    showReasonInline = false,
    size = "md",
    className = "",
}: TrackBadgeProps) {
    const [open, setOpen] = useState(false);
    const isTrack1 = track === 1;

    const defaultReason = isTrack1
        ? "Routine incident — single perpetrator / direct jurisdiction. No syndicate signal detected."
        : "Complex network — multiple correlated accounts, burner phones, or cross-jurisdictional movement detected.";
    const reason = triageReason || defaultReason;

    return (
        <div
            className={`relative inline-flex items-center gap-2 ${className}`}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <span className="cursor-help">
                <Chip
                    tone={isTrack1 ? "neutral" : "ember"}
                    size={size === "sm" ? "sm" : "md"}
                    icon={
                        <Icon
                            name={isTrack1 ? "scale-justice" : "network-graph"}
                            size={size === "sm" ? 11 : 13}
                        />
                    }
                >
                    {isTrack1 ? "Track 1 · Routine" : "Track 2 · Complex Network"}
                </Chip>
            </span>

            {showReasonInline && (
                <span className="hidden max-w-md truncate text-xs text-surface-500 sm:inline">
                    {reason}
                </span>
            )}

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.98 }}
                        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                        className="glass-strong pointer-events-none absolute left-0 top-full z-50 mt-2 w-72 rounded-xl p-3.5 text-xs shadow-2xl"
                    >
                        <Kicker tone="ember">Case Triage Classification</Kicker>
                        <p className="mt-2 leading-relaxed text-surface-600">{reason}</p>
                        <div className="mt-2.5 border-t border-surface-300/70 pt-2 font-mono text-[10px] text-surface-500">
                            {isTrack1
                                ? "Single-jurisdiction protocol · graph generation bypassed"
                                : "Multi-modality entity correlation · GNN link prediction enabled"}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
