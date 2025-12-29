import React from "react";

type ErrorBoundaryState = { hasError: boolean };

export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    // Minimal logging to avoid breaking production
    console.error("App crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          background: "#0a0a0a",
          color: "#ffffff"
        }}>
          <div style={{ textAlign: "center", maxWidth: 560 }}>
            <h1 style={{ fontSize: 22, margin: 0, marginBottom: 12 }}>Something went wrong.</h1>
            <p style={{ opacity: 0.8, marginBottom: 16 }}>Please refresh the page. If the problem persists, try again later.</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: "#ffffff",
                color: "#0a0a0a",
                borderRadius: 999,
                padding: "10px 16px",
                fontWeight: 600,
                border: 0,
                cursor: "pointer"
              }}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
