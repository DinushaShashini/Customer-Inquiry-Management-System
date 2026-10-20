export type InquiryStatus = "NEW" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type InquiryCategory = "BILLING" | "TECHNICAL" | "GENERAL" | "SALES";
export type InquiryPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Inquiry {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string | null;
  subject: string;
  message: string;
  category: InquiryCategory;
  priority: InquiryPriority;
  status: InquiryStatus;
  assigned_to?: number | null;
  assigned_agent_name?: string | null;
  assigned_agent_email?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface InquiryListResponse {
  status: string;
  data: Inquiry[];
  meta: PaginationMeta;
}

export interface CreateInquiryInput {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  subject: string;
  message: string;
  category: InquiryCategory;
  priority: InquiryPriority;
}

export interface UpdateStatusInput {
  status: InquiryStatus;
  notes?: string;
  assigned_to?: number | null;
}

export interface InquiryFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
  priority?: string;
}
