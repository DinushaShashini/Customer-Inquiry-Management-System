"use client";

import React, { useEffect } from "react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
  durationMs?: number;
}

export function Toast({ toast, onClose, durationMs = 4000 }: ToastProps) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, durationMs);

    return () => clearTimeout(timer);
  }, [toast, onClose, durationMs]);

  if (!toast) return null;

  const getColors = () => {
    switch (toast.type) {
      case "success":
        return {
          bg: "rgba(16, 185, 129, 0.95)",
          color: "#ffffff"
        };
      case "error":
        return {
          bg: "rgba(239, 68, 68, 0.95)",
          color: "#ffffff"
        };
      default:
        return {
          bg: "rgba(59, 130, 246, 0.95)",
          color: "#ffffff"
        };
    }
  };

  const { bg, color } = getColors();

  return (
    <div
      role="alert"
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        zIndex: 50,
        backgroundColor: bg,
        color,
        padding: "0.75rem 1.25rem",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-lg)",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        fontSize: "0.875rem",
        fontWeight: 600,
        animation: "slideIn 0.2s ease-out"
      }}
    >
      <span>{toast.message}</span>
      <button
        onClick={onClose}
        style={{
          background: "transparent",
          border: "none",
          color: "inherit",
          cursor: "pointer",
          fontSize: "1rem",
          lineHeight: 1
        }}
      >
        ×
      </button>
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateY(12px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
