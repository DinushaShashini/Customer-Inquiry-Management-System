"use client";

import React, { useState } from "react";
import { InquiryStatus } from "../lib/types";
import { ALLOWED_TRANSITIONS } from "../lib/validation";

interface StatusActionsProps {
  currentStatus: InquiryStatus;
  isUpdating?: boolean;
  onTransition: (targetStatus: InquiryStatus, notes?: string) => Promise<void>;
}

export function StatusActions({
  currentStatus,
  isUpdating = false,
  onTransition
}: StatusActionsProps) {
  const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
  const [activeTarget, setActiveTarget] = useState<InquiryStatus | null>(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!activeTarget) return;
    setIsSubmitting(true);
    try {
      await onTransition(activeTarget, notes);
      setActiveTarget(null);
      setNotes("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getButtonLabel = (status: InquiryStatus) => {
    switch (status) {
      case "IN_PROGRESS":
        return currentStatus === "CLOSED" ? "Re-open Inquiry" : "Start Progress";
      case "RESOLVED":
        return "Mark Resolved";
      case "CLOSED":
        return "Close Inquiry";
      case "NEW":
        return "Reset to New";
      default:
        return status;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {allowed.map((target) => (
          <button
            key={target}
            type="button"
            className="btn btn-secondary"
            disabled={isUpdating || isSubmitting}
            onClick={() => setActiveTarget(target)}
            style={{
              borderColor: activeTarget === target ? "var(--accent-primary)" : undefined
            }}
          >
            {getButtonLabel(target)}
          </button>
        ))}
      </div>

      {activeTarget && (
        <div
          style={{
            background: "var(--bg-surface-elevated)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "1rem",
            marginTop: "0.5rem"
          }}
        >
          <div style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>
            Confirm transition to <span style={{ color: "var(--accent-primary)" }}>{activeTarget}</span>
          </div>
          <div className="form-group" style={{ marginBottom: "0.75rem" }}>
            <label className="form-label">Internal Resolution Notes (Optional)</label>
            <textarea
              className="form-textarea"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add relevant context, ticket link, or troubleshooting summary..."
            />
          </div>
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setActiveTarget(null)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Confirm Status Change"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
