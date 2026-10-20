import React from "react";
import { InquiryPriority, InquiryStatus } from "../lib/types";

interface StatusBadgeProps {
  status: InquiryStatus | InquiryPriority;
  type?: "status" | "priority";
}

export function StatusBadge({ status, type = "status" }: StatusBadgeProps) {
  const getStyles = () => {
    switch (status) {
      case "NEW":
        return {
          background: "var(--badge-new-bg)",
          color: "var(--badge-new-text)",
          border: "1px solid var(--badge-new-border)"
        };
      case "IN_PROGRESS":
        return {
          background: "var(--badge-progress-bg)",
          color: "var(--badge-progress-text)",
          border: "1px solid var(--badge-progress-border)"
        };
      case "RESOLVED":
        return {
          background: "var(--badge-resolved-bg)",
          color: "var(--badge-resolved-text)",
          border: "1px solid var(--badge-resolved-border)"
        };
      case "CLOSED":
        return {
          background: "var(--badge-closed-bg)",
          color: "var(--badge-closed-text)",
          border: "1px solid var(--badge-closed-border)"
        };
      case "URGENT":
        return {
          background: "rgba(239, 68, 68, 0.15)",
          color: "#f87171",
          border: "1px solid rgba(239, 68, 68, 0.3)"
        };
      case "HIGH":
        return {
          background: "rgba(249, 115, 22, 0.15)",
          color: "#fb923c",
          border: "1px solid rgba(249, 115, 22, 0.3)"
        };
      case "MEDIUM":
        return {
          background: "rgba(59, 130, 246, 0.15)",
          color: "#60a5fa",
          border: "1px solid rgba(59, 130, 246, 0.3)"
        };
      case "LOW":
      default:
        return {
          background: "rgba(100, 116, 139, 0.15)",
          color: "#94a3b8",
          border: "1px solid rgba(100, 116, 139, 0.3)"
        };
    }
  };

  const formatText = (val: string) => {
    return val.replace("_", " ");
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        padding: "0.25rem 0.65rem",
        borderRadius: "var(--radius-full)",
        fontSize: "0.75rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        ...getStyles()
      }}
    >
      <span
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: "currentColor"
        }}
      />
      {formatText(status)}
    </span>
  );
}
