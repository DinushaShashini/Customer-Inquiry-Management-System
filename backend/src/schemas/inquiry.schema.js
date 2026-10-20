import { z } from "zod";

export const InquiryStatus = ["NEW", "IN_PROGRESS", "RESOLVED", "CLOSED"];
export const InquiryCategory = ["BILLING", "TECHNICAL", "GENERAL", "SALES"];
export const InquiryPriority = ["LOW", "MEDIUM", "HIGH", "URGENT"];

export const createInquirySchema = z.object({
  customer_name: z.string().trim().min(2, "Customer name must be at least 2 characters"),
  customer_email: z.string().trim().email("Please provide a valid email address"),
  customer_phone: z.string().trim().max(50).optional().nullable(),
  subject: z.string().trim().min(3, "Subject must be at least 3 characters").max(200),
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
  category: z.enum(["BILLING", "TECHNICAL", "GENERAL", "SALES"]).default("GENERAL"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM")
});

export const updateStatusSchema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED", "CLOSED"]),
  notes: z.string().trim().max(1000).optional(),
  assigned_to: z.number().int().positive().optional().nullable()
});

export const queryInquirySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED", "CLOSED", "ALL"]).optional(),
  category: z.enum(["BILLING", "TECHNICAL", "GENERAL", "SALES", "ALL"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT", "ALL"]).optional()
});
