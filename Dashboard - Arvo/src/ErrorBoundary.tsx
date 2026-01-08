import React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: "20px", 
          fontFamily: "sans-serif", 
          background: "white", 
          color: "black", 
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column"
        }}>
          <h1 style={{ color: "red", marginBottom: "20px" }}>Fehler beim Laden der App</h1>
          <p style={{ color: "red", marginBottom: "10px" }}>
            {this.state.error?.message || "Unbekannter Fehler"}
          </p>
          <pre style={{
            background: "#f5f5f5",
            padding: "10px",
            borderRadius: "4px",
            overflow: "auto",
            maxWidth: "90%",
            wordWrap: "break-word"
          }}>
            {this.state.error?.stack || String(this.state.error)}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Seite neu laden
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

