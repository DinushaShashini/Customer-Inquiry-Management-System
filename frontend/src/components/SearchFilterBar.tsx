"use client";

import React, { useEffect, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { InquiryFilters } from "../lib/types";

interface SearchFilterBarProps {
  filters: InquiryFilters;
  onChange: (newFilters: Partial<InquiryFilters>) => void;
}

export function SearchFilterBar({ filters, onChange }: SearchFilterBarProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const debouncedSearch = useDebounce(searchTerm, 350);

  useEffect(() => {
    if (debouncedSearch !== (filters.search || "")) {
      onChange({ search: debouncedSearch });
    }
  }, [debouncedSearch, filters.search, onChange]);

  const handleReset = () => {
    setSearchTerm("");
    onChange({
      search: "",
      status: "ALL",
      category: "ALL",
      priority: "ALL",
      page: 1
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.75rem",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "1.5rem"
      }}
    >
      <div style={{ flex: "1 1 280px" }}>
        <input
          type="text"
          className="form-input"
          style={{ width: "100%" }}
          placeholder="Search by customer name, email, or subject..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        <select
          className="form-select"
          value={filters.status || "ALL"}
          onChange={(e) => onChange({ status: e.target.value })}
        >
          <option value="ALL">All Statuses</option>
          <option value="NEW">New</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>

        <select
          className="form-select"
          value={filters.category || "ALL"}
          onChange={(e) => onChange({ category: e.target.value })}
        >
          <option value="ALL">All Categories</option>
          <option value="BILLING">Billing</option>
          <option value="TECHNICAL">Technical</option>
          <option value="SALES">Sales</option>
          <option value="GENERAL">General</option>
        </select>

        <select
          className="form-select"
          value={filters.priority || "ALL"}
          onChange={(e) => onChange({ priority: e.target.value })}
        >
          <option value="ALL">All Priorities</option>
          <option value="URGENT">Urgent</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleReset}
          title="Reset Filters"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
