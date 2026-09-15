import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught render error in tree:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-screen bg-surface-0 text-surface-900 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full rounded-2xl border border-red-500/20 bg-surface-100 p-8 shadow-2xl space-y-4">
            <div className="h-12 w-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto text-2xl font-bold">
              !
            </div>
            <h2 className="text-xl font-bold tracking-tight text-surface-900">Dashboard Render Notice</h2>
            <p className="text-sm text-surface-500">
              {this.state.error ? String(this.state.error.message || this.state.error) : 'An unexpected rendering anomaly occurred while mounting this component.'}
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => (window.location.href = '/dashboard')}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-surface-200 hover:bg-surface-300 text-surface-800 transition-colors cursor-pointer"
              >
                Return to Dashboard
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-insignia-600 hover:bg-insignia-500 text-white transition-colors cursor-pointer"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
