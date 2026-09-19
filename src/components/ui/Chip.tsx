// src/components/ui/Chip.tsx
//
// THE badge system. Every pill in the app (track, status, confidence,
// modality, severity, lead state, graph legend) renders through this so the
// language is identical everywhere: hairline border, 12% tint, mono label,
// optional live ring, optional dashed "unresolved" texture.
//
// Tones map 1:1 onto the DESIGN.md semantic contract and are never mixed:
//   ember      → authority / chrome / primary
//   steel      → machine, data, technical channel
//   confirmed  → evidentiary (green)
//   risk       → high risk / incident (red)
//   alert      → pattern alert / pending (amber)
//   hypothesis → GNN prediction (violet, ALWAYS dashed)
//   neutral    → unknown

import type { ReactNode } from "react";

export type ChipTone =
    | "neutral"
    | "ember"
    | "steel"
    | "confirmed"
    | "risk"
    | "alert"
    | "hypothesis";

const TONES: Record<ChipTone, string> = {
    neutral: "border-surface-300 bg-surface-200/70 text-surface-600",
    ember: "border-ember-500/40 bg-ember-500/12 text-ember-200",
    steel: "border-steel-500/40 bg-steel-500/12 text-steel-200",
    confirmed: "border-emerald-500/40 bg-emerald-500/12 text-emerald-300",
    risk: "border-red-500/40 bg-red-500/12 text-red-300",
    alert: "border-amber-500/40 bg-amber-500/12 text-amber-300",
    hypothesis: "border-purple-500/50 bg-purple-500/12 text-purple-300 border-dashed",
};

const DOTS: Record<ChipTone, string> = {
    neutral: "bg-surface-500",
    ember: "bg-ember-400",
    steel: "bg-steel-400",
    confirmed: "bg-emerald-400",
    risk: "bg-red-400",
    alert: "bg-amber-400",
    hypothesis: "bg-purple-400",
};

export interface ChipProps {
    children: ReactNode;
    tone?: ChipTone;
    size?: "xs" | "sm" | "md";
    icon?: ReactNode;
    /** solid leading dot */
    dot?: boolean;
    /** dot + expanding ring (use sparingly: "live" state only) */
    live?: boolean;
    mono?: boolean;
    uppercase?: boolean;
    className?: string;
    title?: string;
}

export default function Chip({
    children,
    tone = "neutral",
    size = "sm",
    icon,
    dot = false,
    live = false,
    mono = true,
    uppercase = true,
    className = "",
    title,
}: ChipProps) {
    const pad =
        size === "xs"
            ? "px-1.5 py-[1px] text-[10px] gap-1"
            : size === "md"
              ? "px-2.5 py-1 text-xs gap-1.5"
              : "px-2 py-0.5 text-[11px] gap-1.5";

    return (
        <span
            title={title}
            className={`inline-flex items-center rounded-md border font-semibold tracking-wide ${
                mono ? "font-mono" : ""
            } ${uppercase ? "uppercase" : ""} ${pad} ${TONES[tone]} ${className}`}
        >
            {(dot || live) && (
                <span className="relative inline-flex">
                    <span className={`block h-1.5 w-1.5 rounded-full ${DOTS[tone]}`} />
                    {live && (
                        <span
                            className={`live-ring absolute inset-0 rounded-full ${
                                tone === "confirmed"
                                    ? "text-emerald-400"
                                    : tone === "ember"
                                      ? "text-ember-400"
                                      : tone === "risk"
                                        ? "text-red-400"
                                        : "text-steel-400"
                            }`}
                        />
                    )}
                </span>
            )}
            {icon}
            <span className="leading-none">{children}</span>
        </span>
    );
}

/** Micro section label: a hairline rule + uppercase mono kicker. */
export function Kicker({
    children,
    tone = "ember",
    className = "",
}: {
    children: ReactNode;
    tone?: "ember" | "steel" | "neutral" | "hypothesis";
    className?: string;
}) {
    const color =
        tone === "ember"
            ? "text-ember-300"
            : tone === "steel"
              ? "text-steel-300"
              : tone === "hypothesis"
                ? "text-purple-300"
                : "text-surface-500";
    return (
        <span
            className={`inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] ${color} ${className}`}
        >
            <span className="h-px w-5 bg-current opacity-50" />
            {children}
        </span>
    );
}

/** Numbered act/section marker used across the case file. */
export function Marker({ n, active = false }: { n: string | number; active?: boolean }) {
    return (
        <span
            className={`inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 font-mono text-[10px] font-bold ${
                active
                    ? "border-ember-500/50 bg-ember-500/15 text-ember-200"
                    : "border-surface-300 bg-surface-200/60 text-surface-500"
            }`}
        >
            {typeof n === "number" ? String(n).padStart(2, "0") : n}
        </span>
    );
}
