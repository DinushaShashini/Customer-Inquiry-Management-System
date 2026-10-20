import { InquiryStatus, CreateInquiryInput } from "./types";

export interface FormErrors {
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  subject?: string;
  message?: string;
  category?: string;
  priority?: string;
}

export const ALLOWED_TRANSITIONS: Record<InquiryStatus, InquiryStatus[]> = {
  NEW: ["IN_PROGRESS", "CLOSED"],
  IN_PROGRESS: ["RESOLVED", "CLOSED", "NEW"],
  RESOLVED: ["CLOSED", "IN_PROGRESS"],
  CLOSED: ["IN_PROGRESS"]
};

export function canTransitionStatus(
  current: InquiryStatus,
  target: InquiryStatus
): boolean {
  if (current === target) return true;
  return ALLOWED_TRANSITIONS[current]?.includes(target) ?? false;
}

export function validateInquiryForm(data: Partial<CreateInquiryInput>): {
  isValid: boolean;
  errors: FormErrors;
} {
  const errors: FormErrors = {};

  if (!data.customer_name || data.customer_name.trim().length < 2) {
    errors.customer_name = "Customer name must be at least 2 characters";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.customer_email || !emailRegex.test(data.customer_email.trim())) {
    errors.customer_email = "Please enter a valid email address";
  }

  if (!data.subject || data.subject.trim().length < 3) {
    errors.subject = "Subject must be at least 3 characters";
  } else if (data.subject.trim().length > 200) {
    errors.subject = "Subject must be 200 characters or less";
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
