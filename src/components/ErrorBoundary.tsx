import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('ErrorBoundary caught an error:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#0A0D14] text-zinc-400">
          <p className="text-sm font-semibold text-white mb-1">Visualização indisponível</p>
          <p className="text-xs">Não foi possível carregar este componente no momento.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
