import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
          }}
        >
          <div
            style={{
              background: 'var(--surface-solid)',
              border: '1px solid var(--glass-border)',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '400px',
              textAlign: 'center',
              backdropFilter: 'blur(20px) saturate(150%)',
              WebkitBackdropFilter: 'blur(20px) saturate(150%)',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚠</div>
            <h2 style={{ color: 'var(--text)', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
              Something went wrong
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px', wordBreak: 'break-word' }}>
              {this.state.error?.message ?? 'Unknown error'}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'var(--surface-strong)',
                border: '1px solid var(--glass-border)',
                borderRadius: '14px',
                color: 'var(--text)',
                padding: '10px 20px',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: '14px',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.borderColor = 'var(--primary)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.borderColor = 'var(--glass-border)';
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function PageErrorBoundary({ children }: { children: ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
