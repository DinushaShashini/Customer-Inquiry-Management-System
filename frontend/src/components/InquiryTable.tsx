import React from "react";
import Link from "next/link";
import { Inquiry, PaginationMeta } from "../lib/types";
import { StatusBadge } from "./StatusBadge";
import { Skeleton } from "./Skeleton";
import { EmptyState } from "./EmptyState";

interface InquiryTableProps {
  inquiries: Inquiry[];
  meta: PaginationMeta;
  isLoading: boolean;
  onPageChange: (newPage: number) => void;
}

export function InquiryTable({
  inquiries,
  meta,
  isLoading,
  onPageChange
}: InquiryTableProps) {
  if (isLoading) {
    return (
      <div className="card" style={{ padding: "1.5rem" }}>
        <Skeleton height="3rem" count={5} />
      </div>
    );
  }

  if (inquiries.length === 0) {
    return <EmptyState />;
  }

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
            fontSize: "0.875rem"
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: "1px solid var(--border-subtle)",
                background: "var(--bg-surface-elevated)",
                color: "var(--text-secondary)",
                textTransform: "uppercase",
                fontSize: "0.75rem",
                letterSpacing: "0.05em"
              }}
            >
              <th style={{ padding: "0.9rem 1.25rem" }}>ID</th>
              <th style={{ padding: "0.9rem 1.25rem" }}>Customer</th>
              <th style={{ padding: "0.9rem 1.25rem" }}>Subject</th>
              <th style={{ padding: "0.9rem 1.25rem" }}>Category</th>
              <th style={{ padding: "0.9rem 1.25rem" }}>Priority</th>
              <th style={{ padding: "0.9rem 1.25rem" }}>Status</th>
              <th style={{ padding: "0.9rem 1.25rem" }}>Submitted</th>
              <th style={{ padding: "0.9rem 1.25rem", textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inquiry) => (
              <tr
                key={inquiry.id}
                style={{
                  borderBottom: "1px solid var(--border-subtle)",
                  transition: "background-color 0.15s ease"
                }}
              >
                <td style={{ padding: "1rem 1.25rem", fontWeight: 700, color: "var(--text-muted)" }}>
                  #{inquiry.id}
                </td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <div style={{ fontWeight: 600 }}>{inquiry.customer_name}</div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                    {inquiry.customer_email}
                  </div>
                </td>
                <td style={{ padding: "1rem 1.25rem", maxWidth: "260px" }}>
                  <Link
                    href={`/inquiries/${inquiry.id}`}
                    style={{
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {inquiry.subject}
                  </Link>
                </td>
                <td style={{ padding: "1rem 1.25rem", color: "var(--text-secondary)" }}>
                  {inquiry.category}
                </td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <StatusBadge status={inquiry.priority} type="priority" />
                </td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <StatusBadge status={inquiry.status} type="status" />
                </td>
                <td style={{ padding: "1rem 1.25rem", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                  {formatDate(inquiry.created_at)}
                </td>
                <td style={{ padding: "1rem 1.25rem", textAlign: "right" }}>
                  <Link
                    href={`/inquiries/${inquiry.id}`}
                    className="btn btn-secondary"
                    style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem 1.25rem",
          background: "var(--bg-surface)",
          borderTop: "1px solid var(--border-subtle)"
        }}
      >
        <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
          Showing {inquiries.length} of {meta.total} inquiries (Page {meta.page} of {meta.totalPages})
        </span>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={meta.page <= 1}
            onClick={() => onPageChange(meta.page - 1)}
            style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}
          >
            Previous
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={meta.page >= meta.totalPages}
            onClick={() => onPageChange(meta.page + 1)}
            style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
