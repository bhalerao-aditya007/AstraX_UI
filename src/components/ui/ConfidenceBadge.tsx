// src/components/ui/ConfidenceBadge.tsx
//
// Public API unchanged (default export + getConfidenceTier) — only the
// presentation was rebuilt on the shared Chip system.
//
// DESIGN.md §7: every AI insight carries a plain-language qualifier. Kept
// verbatim: "strong evidence" / "possible lead" / "unconfirmed hypothesis".
// The percentage is always font-mono (DESIGN.md §4).

import Chip, { type ChipTone } from "./Chip";

export type ConfidenceTier = "strong" | "possible" | "hypothesis";

interface ConfidenceBadgeProps {
    /** Value between 0 and 1 (e.g. 0.92) or 0 and 100 (e.g. 92) */
    score: number;
    showPercentage?: boolean;
    className?: string;
    size?: "sm" | "md";
    /** render a 3-segment strength meter instead of a dot */
    meter?: boolean;
}

export function getConfidenceTier(score: number): {
    tier: ConfidenceTier;
    label: string;
    percentage: number;
    tone: ChipTone;
    badgeStyle: string;
    dotStyle: string;
} {
    const normalized =
        score > 1 ? Math.min(100, Math.round(score)) : Math.min(100, Math.round(score * 100));

    if (normalized >= 85) {
        return {
            tier: "strong",
            label: "strong evidence",
            percentage: normalized,
            tone: "confirmed",
            // legacy string fields retained for any external consumer
            badgeStyle: "bg-emerald-500/12 text-emerald-300 border-emerald-500/40",
            dotStyle: "bg-emerald-400",
        };
    }
    if (normalized >= 60) {
        return {
            tier: "possible",
            label: "possible lead",
            percentage: normalized,
            tone: "alert",
            badgeStyle: "bg-amber-500/12 text-amber-300 border-amber-500/40",
            dotStyle: "bg-amber-400",
        };
    }
    return {
        tier: "hypothesis",
        label: "unconfirmed hypothesis",
        percentage: normalized,
        tone: "hypothesis",
        badgeStyle: "bg-purple-500/12 text-purple-300 border-purple-500/50 border-dashed",
        dotStyle: "bg-purple-400",
    };
}

/** Three-bar strength meter — confidence you can read at a glance. */
function Meter({ tier }: { tier: ConfidenceTier }) {
    const filled = tier === "strong" ? 3 : tier === "possible" ? 2 : 1;
    const color =
        tier === "strong" ? "bg-emerald-400" : tier === "possible" ? "bg-amber-400" : "bg-purple-400";
    return (
        <span className="inline-flex items-end gap-[2px]" aria-hidden>
            {[1, 2, 3].map((i) => (
                <span
                    key={i}
                    className={`w-[3px] rounded-[1px] ${
                        i <= filled ? color : "bg-surface-400/60"
                    }`}
                    style={{ height: `${3 + i * 2}px` }}
                />
            ))}
        </span>
    );
}

export default function ConfidenceBadge({
    score,
    showPercentage = true,
    className = "",
    size = "sm",
    meter = true,
}: ConfidenceBadgeProps) {
    const { tier, label, percentage, tone } = getConfidenceTier(score);

    return (
        <Chip
            tone={tone}
            size={size}
            uppercase={false}
            dot={!meter}
            icon={meter ? <Meter tier={tier} /> : undefined}
            className={`normal-case ${className}`}
            title={`${label} — model confidence ${percentage}%`}
        >
            <span className="font-sans font-medium tracking-normal">{label}</span>
            {showPercentage && (
                <span className="ml-1.5 font-mono text-[10px] tabular-nums opacity-80">
                    {percentage}%
                </span>
            )}
        </Chip>
    );
}
