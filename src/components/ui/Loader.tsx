// src/components/ui/Loader.tsx
// Props unchanged ({ label }). A slow evidence-scan sweep rather than a spinner.

export default function Loader({ label = "Loading..." }: { label?: string }) {
    return (
        <div className="flex items-center gap-3 px-1 py-2 font-mono text-xs text-surface-500">
            <span className="relative block h-3.5 w-3.5 shrink-0">
                <span className="absolute inset-0 rounded-sm border border-surface-400/70" />
                <span className="absolute inset-x-0 top-0 h-px animate-[scan_1.4s_ease-in-out_infinite] bg-ember-400" />
            </span>
            <span>{label}</span>
            <style>{`@keyframes scan{0%{top:0;opacity:.2}50%{top:100%;opacity:1}100%{top:0;opacity:.2}}`}</style>
        </div>
    );
}

/** Full-panel skeleton used while a case section hydrates. */
export function PanelSkeleton({ rows = 3, className = "" }: { rows?: number; className?: string }) {
    return (
        <div className={`space-y-2.5 ${className}`} aria-busy>
            {Array.from({ length: rows }).map((_, i) => (
                <div
                    key={i}
                    className="h-11 animate-pulse rounded-lg border border-surface-300/70 bg-surface-200/40"
                    style={{ animationDelay: `${i * 90}ms` }}
                />
            ))}
        </div>
    );
}
