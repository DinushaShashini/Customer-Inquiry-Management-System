import React from "react";
import Link from "next/link";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = "No inquiries found",
  description = "No customer inquiries match your current filter parameters or none have been submitted yet.",
  actionText = "Create New Inquiry",
  actionHref = "/inquiries/new",
  onAction
}: EmptyStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "3.5rem 1.5rem",
        textAlign: "center",
        background: "var(--bg-surface)",
        borderRadius: "var(--radius-lg)",
        border: "1px dashed var(--border-subtle)"
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          background: "var(--bg-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1rem",
          color: "var(--text-muted)",
          fontSize: "1.25rem"
        }}
      >
        📥
      </div>
      <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        {title}
      </h3>
      <p
        style={{
          color: "var(--text-secondary)",
          maxWidth: "420px",
          fontSize: "0.9rem",
          marginBottom: "1.5rem"
        }}
      >
        {description}
      </p>
      {actionHref ? (
        <Link href={actionHref} className="btn btn-primary">
          {actionText}
        </Link>
      ) : onAction ? (
        <button type="button" onClick={onAction} className="btn btn-primary">
          {actionText}
        </button>
      ) : null}
    </div>
  );
}
