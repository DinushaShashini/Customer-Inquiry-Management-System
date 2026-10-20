import React from "react";

interface StaleBannerProps {
  onRefresh: () => void;
}

export function StaleBanner({ onRefresh }: StaleBannerProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(245, 158, 11, 0.12)",
        border: "1px solid rgba(245, 158, 11, 0.3)",
        borderRadius: "var(--radius-md)",
        padding: "0.75rem 1rem",
        marginBottom: "1.25rem",
        color: "#fbbf24",
        fontSize: "0.875rem"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span>⚠️</span>
        <span>
          A recent update failed or current data may be out of date.
        </span>
      </div>
      <button
        type="button"
        onClick={onRefresh}
        className="btn btn-secondary"
        style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}
      >
        Sync & Refresh
      </button>
    </div>
  );
}
