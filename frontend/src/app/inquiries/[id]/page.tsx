"use client";

import React, { useEffect, useState, use, Suspense } from "react";
import Link from "next/link";
import { api } from "../../../lib/api";
import { Inquiry, InquiryStatus } from "../../../lib/types";
import { StatusBadge } from "../../../components/StatusBadge";
import { StatusActions } from "../../../components/StatusActions";
import { Skeleton } from "../../../components/Skeleton";
import { ErrorState } from "../../../components/ErrorState";
import { Toast, ToastMessage } from "../../../components/Toast";

interface PageProps {
  params: Promise<{ id: string }>;
}

function InquiryDetailContent({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const fetchDetail = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getInquiry(id);
      setInquiry(data);
    } catch (err: any) {
      setError(err.message || "Failed to load inquiry details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleStatusTransition = async (targetStatus: InquiryStatus, notes?: string) => {
    if (!inquiry) return;
    setIsUpdating(true);
    try {
      const updated = await api.updateInquiryStatus(inquiry.id, {
        status: targetStatus,
        notes: notes || undefined
      });
      setInquiry(updated);
      setToast({
        id: String(Date.now()),
        type: "success",
        message: `Status updated to ${targetStatus}`
      });
    } catch (err: any) {
      setToast({
        id: String(Date.now()),
        type: "error",
        message: err.message || "Status update failed"
      });
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container">
        <Skeleton height="2rem" width="200px" />
        <div style={{ marginTop: "1.5rem" }}>
          <Skeleton height="15rem" />
        </div>
      </div>
    );
  }

  if (error || !inquiry) {
    return (
      <div className="container">
        <ErrorState message={error || "Inquiry not found"} onRetry={fetchDetail} />
      </div>
    );
  }

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleString();
  };

  return (
    <div className="container">
      <div style={{ marginBottom: "1.5rem" }}>
        <Link
          href="/inquiries"
          style={{
            color: "var(--text-secondary)",
            fontSize: "0.875rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem"
          }}
        >
          ← Back to Inquiries
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
        {/* Main Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "1rem",
                marginBottom: "1rem"
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "var(--text-muted)",
                    display: "block",
                    marginBottom: "0.25rem"
                  }}
                >
                  INQUIRY #{inquiry.id} • {inquiry.category}
                </span>
                <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>{inquiry.subject}</h1>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <StatusBadge status={inquiry.priority} type="priority" />
                <StatusBadge status={inquiry.status} type="status" />
              </div>
            </div>

            <div
              style={{
                fontSize: "0.85rem",
                color: "var(--text-muted)",
                marginBottom: "1.5rem"
              }}
            >
              Submitted on {formatDate(inquiry.created_at)}
            </div>

            <div
              style={{
                background: "var(--bg-surface-elevated)",
                borderRadius: "var(--radius-md)",
                padding: "1.25rem",
                lineHeight: "1.6",
                color: "var(--text-primary)",
                whiteSpace: "pre-wrap"
              }}
            >
              {inquiry.message}
            </div>

            {inquiry.notes && (
              <div
                style={{
                  marginTop: "1.5rem",
                  borderTop: "1px solid var(--border-subtle)",
                  paddingTop: "1.25rem"
                }}
              >
                <h4 style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                  Resolution / Agent Notes
                </h4>
                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--text-primary)",
                    background: "var(--bg-subtle)",
                    padding: "0.75rem 1rem",
                    borderRadius: "var(--radius-md)"
                  }}
                >
                  {inquiry.notes}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Status Actions */}
          <div className="card">
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem" }}>
              Status Lifecycle
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.825rem", marginBottom: "1rem" }}>
              Transition this inquiry to the next workflow state.
            </p>
            <StatusActions
              currentStatus={inquiry.status}
              isUpdating={isUpdating}
              onTransition={handleStatusTransition}
            />
          </div>

          {/* Customer Metadata Card */}
          <div className="card">
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>
              Customer Details
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.875rem" }}>
              <div>
                <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.75rem" }}>
                  Name
                </span>
                <span style={{ fontWeight: 600 }}>{inquiry.customer_name}</span>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.75rem" }}>
                  Email
                </span>
                <a
                  href={`mailto:${inquiry.customer_email}`}
                  style={{ color: "var(--accent-primary)", textDecoration: "underline" }}
                >
                  {inquiry.customer_email}
                </a>
              </div>
              {inquiry.customer_phone && (
                <div>
                  <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.75rem" }}>
                    Phone
                  </span>
                  <span>{inquiry.customer_phone}</span>
                </div>
              )}
              {inquiry.assigned_agent_name && (
                <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "0.5rem" }}>
                  <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.75rem" }}>
                    Assigned Agent
                  </span>
                  <span>{inquiry.assigned_agent_name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default function InquiryDetailPage(props: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="container">
          <Skeleton height="2rem" width="200px" />
          <div style={{ marginTop: "1.5rem" }}>
            <Skeleton height="15rem" />
          </div>
        </div>
      }
    >
      <InquiryDetailContent {...props} />
    </Suspense>
  );
}
