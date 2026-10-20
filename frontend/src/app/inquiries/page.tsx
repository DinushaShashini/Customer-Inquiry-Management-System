"use client";

import React from "react";
import Link from "next/link";
import { useInquiries } from "../../hooks/useInquiries";
import { SearchFilterBar } from "../../components/SearchFilterBar";
import { InquiryTable } from "../../components/InquiryTable";
import { StaleBanner } from "../../components/StaleBanner";
import { ErrorState } from "../../components/ErrorState";

export default function InquiriesListPage() {
  const {
    inquiries,
    meta,
    filters,
    isLoading,
    error,
    isStale,
    updateFilters,
    changePage,
    refetch
  } = useInquiries();

  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.75rem",
          flexWrap: "wrap",
          gap: "1rem"
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Inquiry Inbox</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Monitor, prioritize, and manage customer questions and tickets.
          </p>
        </div>
        <Link href="/inquiries/new" className="btn btn-primary">
          + New Inquiry
        </Link>
      </div>

      {isStale && <StaleBanner onRefresh={refetch} />}

      <SearchFilterBar filters={filters} onChange={updateFilters} />

      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : (
        <InquiryTable
          inquiries={inquiries}
          meta={meta}
          isLoading={isLoading}
          onPageChange={changePage}
        />
      )}
    </div>
  );
}
