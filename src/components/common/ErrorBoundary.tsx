// src/components/common/ErrorBoundary.tsx
import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
    public state: State = { hasError: false, error: null };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught render error in tree:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <div className="bg-records-room grain-overlay flex min-h-screen flex-col items-center justify-center p-6 text-center text-surface-900">
                    <div className="glass-strong w-full max-w-md space-y-4 rounded-2xl p-8 shadow-2xl">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/40 bg-red-500/12 text-2xl font-bold text-red-400">
                            !
                        </div>
                        <h2 className="font-display text-xl font-bold tracking-tight text-surface-900">
                            Dashboard render notice
                        </h2>
                        <p className="font-mono text-xs leading-relaxed text-surface-500">
                            {this.state.error
                                ? String(this.state.error.message || this.state.error)
                                : "An unexpected rendering anomaly occurred while mounting this component."}
                        </p>
                        <div className="flex items-center justify-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => (window.location.href = "/dashboard")}
                                className="cursor-pointer rounded-lg bg-surface-200 px-4 py-2 text-xs font-semibold text-surface-800 transition-colors hover:bg-surface-300"
                            >
                                Return to dashboard
                            </button>
                            <button
                                type="button"
                                onClick={() => window.location.reload()}
                                className="cursor-pointer rounded-lg bg-ember-500 px-4 py-2 text-xs font-semibold text-surface-900 shadow-[inset_0_1px_0_0_rgba(246,242,237,0.18)] transition-colors hover:bg-ember-400"
                            >
                                Reload page
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
