// src/components/ui/EmptyState.tsx
//
// One component for every empty / error / awaiting-evidence surface in the
// app, replacing the old flat "icon + heading + paragraph" template.
// It reads as an *unfilled case file*: a corkboard/paper plate, an evidence
// tag with a case-relevant status line, ambient dust, and an optional action.
//
// Texture degrades to a pure gradient if /textures/corkboard.png is absent.

import type { ReactNode } from "react";
import Icon, { type IconName } from "./Icon";
import Chip from "./Chip";
import { ParticleField, Reveal } from "../motion";

export type EmptyTone = "idle" | "working" | "error";

interface EmptyStateProps {
    icon?: IconName;
    title: string;
    body?: string;
    /** short mono status line, e.g. "NO SIGNAL · 0 RECORDS" */
    stamp?: string;
    tone?: EmptyTone;
    action?: ReactNode;
    dense?: boolean;
    className?: string;
}

export default function EmptyState({
    icon = "folder",
    title,
    body,
    stamp,
    tone = "idle",
    action,
    dense = false,
    className = "",
}: EmptyStateProps) {
    const accent =
        tone === "error"
            ? "text-red-400 border-red-500/40 bg-red-500/10"
            : tone === "working"
              ? "text-steel-300 border-steel-500/40 bg-steel-500/10"
              : "text-surface-500 border-surface-300 bg-surface-200/60";

    return (
        <Reveal
            className={`bg-evidence-wall relative overflow-hidden rounded-xl border border-dashed border-surface-300 ${
                dense ? "p-6" : "p-10"
            } text-center ${className}`}
        >
            <ParticleField count={14} seed={31} color="rgba(216,152,115,0.35)" />

            {/* Evidence tag plate */}
            <div className="relative z-10 flex flex-col items-center">
                <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl border ${accent} ${
                        tone === "working" ? "animate-pulse" : ""
                    }`}
                >
                    <Icon name={icon} size={22} />
                </div>

                <h4 className="font-display text-base font-bold tracking-tight text-surface-800">
                    {title}
                </h4>

                {body && (
                    <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-surface-500">
                        {body}
                    </p>
                )}

                {stamp && (
                    <div className="mt-4">
                        <Chip
                            tone={tone === "error" ? "risk" : tone === "working" ? "steel" : "neutral"}
                            size="xs"
                            dot
                        >
                            {stamp}
                        </Chip>
                    </div>
                )}

                {action && <div className="mt-5">{action}</div>}
            </div>
        </Reveal>
    );
}
