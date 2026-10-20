import React from "react";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry
}: ErrorStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 1.5rem",
        textAlign: "center",
        background: "var(--danger-bg)",
        border: "1px solid var(--danger-border)",
        borderRadius: "var(--radius-lg)"
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          background: "rgba(239, 68, 68, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1rem",
          color: "var(--danger-text)",
          fontSize: "1.25rem"
        }}
      >
        ⚠️
      </div>
      <h3
        style={{
          fontSize: "1.1rem",
          fontWeight: 700,
          color: "var(--danger-text)",
          marginBottom: "0.5rem"
        }}
      >
        {title}
      </h3>
      <p
        style={{
          color: "var(--text-secondary)",
          maxWidth: "460px",
          fontSize: "0.9rem",
          marginBottom: onRetry ? "1.5rem" : 0
        }}
      >
        {message}
      </p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn btn-secondary">
          Try Again
        </button>
      )}
    </div>
  );
}
