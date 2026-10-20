"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "../lib/api";
import { Inquiry, InquiryFilters, PaginationMeta, UpdateStatusInput } from "../lib/types";

export function useInquiries(initialFilters: InquiryFilters = {}) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });
  const [filters, setFilters] = useState<InquiryFilters>({
    page: 1,
    limit: 10,
    status: "ALL",
    category: "ALL",
    priority: "ALL",
    search: "",
    ...initialFilters
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isStale, setIsStale] = useState<boolean>(false);

  const fetchInquiries = useCallback(
    async (currentFilters: InquiryFilters) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.getInquiries(currentFilters);
        setInquiries(response.data);
        setMeta(response.meta);
        setIsStale(false);
      } catch (err: any) {
        setError(err.message || "Failed to load inquiries.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchInquiries(filters);
  }, [filters, fetchInquiries]);

  const updateFilters = useCallback((newFilters: Partial<InquiryFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      // Reset to page 1 if changing criteria
      page: newFilters.page !== undefined ? newFilters.page : 1
    }));
  }, []);

  const changePage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const mutateStatus = useCallback(
    async (id: number, input: UpdateStatusInput) => {
      // Optimistic update
      setInquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: input.status } : item))
      );

      try {
        const updated = await api.updateInquiryStatus(id, input);
        setInquiries((prev) =>
          prev.map((item) => (item.id === id ? updated : item))
        );
      } catch (err: any) {
        setIsStale(true);
        throw err;
      }
    },
    []
  );

  return {
    inquiries,
    meta,
    filters,
    isLoading,
    error,
    isStale,
    updateFilters,
    changePage,
    mutateStatus,
    refetch: () => fetchInquiries(filters)
  };
}
