"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { InquiryForm } from "../../../components/InquiryForm";
import { Toast, ToastMessage } from "../../../components/Toast";
import { api } from "../../../lib/api";
import { CreateInquiryInput } from "../../../lib/types";

export default function NewInquiryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const handleSubmit = async (data: CreateInquiryInput) => {
    setIsSubmitting(true);
    try {
      const created = await api.createInquiry(data);
      setToast({
        id: String(Date.now()),
        type: "success",
        message: `Inquiry #${created.id} submitted successfully!`
      });
      setTimeout(() => {
        router.push(`/inquiries/${created.id}`);
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
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

      <InquiryForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
