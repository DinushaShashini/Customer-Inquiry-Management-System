import {
  CreateInquiryInput,
  Inquiry,
  InquiryFilters,
  InquiryListResponse,
  UpdateStatusInput,
  User
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export class ApiError extends Error {
  statusCode: number;
  details?: any;

  constructor(message: string, statusCode: number, details?: any) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    ...options,
    headers: defaultHeaders,
    credentials: "include" // Send and receive HTTP-only cookies
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const errorMsg = data?.message || `Request failed with status ${response.status}`;
    throw new ApiError(errorMsg, response.status, data?.details);
  }

  return data as T;
}

export const api = {
  // Auth
  async login(credentials: { email: string; password: string }): Promise<{ user: User }> {
    const res = await apiFetch<{ data: { user: User } }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials)
    });
    return res.data;
  },

  async logout(): Promise<void> {
    await apiFetch("/api/auth/logout", { method: "POST" });
  },

  async getMe(): Promise<User> {
    const res = await apiFetch<{ data: { user: User } }>("/api/auth/me");
    return res.data.user;
  },

  // Inquiries
  async getInquiries(filters: InquiryFilters = {}): Promise<InquiryListResponse> {
    const params = new URLSearchParams();
    if (filters.page) params.set("page", String(filters.page));
    if (filters.limit) params.set("limit", String(filters.limit));
    if (filters.search) params.set("search", filters.search);
    if (filters.status && filters.status !== "ALL") params.set("status", filters.status);
    if (filters.category && filters.category !== "ALL") params.set("category", filters.category);
    if (filters.priority && filters.priority !== "ALL") params.set("priority", filters.priority);

    const queryStr = params.toString() ? `?${params.toString()}` : "";
    return apiFetch<InquiryListResponse>(`/api/inquiries${queryStr}`);
  },

  async getInquiry(id: number | string): Promise<Inquiry> {
    const res = await apiFetch<{ data: Inquiry }>(`/api/inquiries/${id}`);
    return res.data;
  },

  async createInquiry(input: CreateInquiryInput): Promise<Inquiry> {
    const res = await apiFetch<{ data: Inquiry }>("/api/inquiries", {
      method: "POST",
      body: JSON.stringify(input)
    });
    return res.data;
  },

  async updateInquiryStatus(id: number | string, input: UpdateStatusInput): Promise<Inquiry> {
    const res = await apiFetch<{ data: Inquiry }>(`/api/inquiries/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(input)
    });
    return res.data;
  }
};
