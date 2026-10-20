"use client";

import React, { useState } from "react";
import { CreateInquiryInput, InquiryCategory, InquiryPriority } from "../lib/types";
import { FormErrors, validateInquiryForm } from "../lib/validation";

interface InquiryFormProps {
  onSubmit: (data: CreateInquiryInput) => Promise<void>;
  isSubmitting?: boolean;
}

export function InquiryForm({ onSubmit, isSubmitting = false }: InquiryFormProps) {
  const [formData, setFormData] = useState<CreateInquiryInput>({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    subject: "",
    message: "",
    category: "GENERAL",
    priority: "MEDIUM"
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const validation = validateInquiryForm({ ...formData, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: validation.errors[name as keyof FormErrors] }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const validation = validateInquiryForm(formData);
    setErrors(validation.errors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const validation = validateInquiryForm(formData);
    setErrors(validation.errors);
    setTouched({
      customer_name: true,
      customer_email: true,
      subject: true,
      message: true
    });

    if (!validation.isValid) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setServerError(err.message || "Failed to submit inquiry. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="card" style={{ maxWidth: "680px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.25rem" }}>
        Submit Customer Inquiry
      </h2>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
        Fill out the details below. Our support team will review and respond promptly.
      </p>

      {serverError && (
        <div
          role="alert"
          style={{
            background: "var(--danger-bg)",
            border: "1px solid var(--danger-border)",
            borderRadius: "var(--radius-md)",
            padding: "0.75rem 1rem",
            marginBottom: "1.25rem",
            color: "var(--danger-text)",
            fontSize: "0.875rem"
          }}
        >
          {serverError}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div className="form-group">
          <label htmlFor="customer_name" className="form-label">
            Customer Name *
          </label>
          <input
            id="customer_name"
            name="customer_name"
            type="text"
            className="form-input"
            value={formData.customer_name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Jane Doe"
          />
          {touched.customer_name && errors.customer_name && (
            <div className="form-error">{errors.customer_name}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="customer_email" className="form-label">
            Email Address *
          </label>
          <input
            id="customer_email"
            name="customer_email"
            type="email"
            className="form-input"
            value={formData.customer_email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="jane@example.com"
          />
          {touched.customer_email && errors.customer_email && (
            <div className="form-error">{errors.customer_email}</div>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
        <div className="form-group">
          <label htmlFor="customer_phone" className="form-label">
            Phone (Optional)
          </label>
          <input
            id="customer_phone"
            name="customer_phone"
            type="tel"
            className="form-input"
            value={formData.customer_phone || ""}
            onChange={handleChange}
            placeholder="+1 555-0123"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <select
            id="category"
            name="category"
            className="form-select"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="GENERAL">General</option>
            <option value="BILLING">Billing</option>
            <option value="TECHNICAL">Technical</option>
            <option value="SALES">Sales</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="priority" className="form-label">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            className="form-select"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="subject" className="form-label">
          Subject *
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          className="form-input"
          value={formData.subject}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Brief summary of your inquiry"
        />
        {touched.subject && errors.subject && (
          <div className="form-error">{errors.subject}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="message" className="form-label">
          Message Description *
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className="form-textarea"
          value={formData.message}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Please describe your question or issue in detail..."
        />
        {touched.message && errors.message && (
          <div className="form-error">{errors.message}</div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting Inquiry..." : "Submit Inquiry"}
        </button>
      </div>
    </form>
  );
}
