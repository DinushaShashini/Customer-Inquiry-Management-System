import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { InquiryForm } from "../components/InquiryForm";

describe("InquiryForm Component", () => {
  it("renders all inquiry input fields correctly", () => {
    render(<InquiryForm onSubmit={vi.fn()} />);

    expect(screen.getByLabelText(/Customer Name \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Subject \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message Description \*/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submit Inquiry/i })).toBeInTheDocument();
  });

  it("displays client-side validation errors when required fields are missing", async () => {
    const mockSubmit = vi.fn();
    render(<InquiryForm onSubmit={mockSubmit} />);

    fireEvent.click(screen.getByRole("button", { name: /Submit Inquiry/i }));

    await waitFor(() => {
      expect(screen.getByText(/Customer name must be at least 2 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/Subject must be at least 3 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/Message must be at least 10 characters/i)).toBeInTheDocument();
    });

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it("calls onSubmit when valid data is provided", async () => {
    const mockSubmit = vi.fn().mockResolvedValue(undefined);
    render(<InquiryForm onSubmit={mockSubmit} />);

    fireEvent.change(screen.getByLabelText(/Customer Name \*/i), {
      target: { value: "Sarah Connor" }
    });
    fireEvent.change(screen.getByLabelText(/Email Address \*/i), {
      target: { value: "sarah@example.com" }
    });
    fireEvent.change(screen.getByLabelText(/Subject \*/i), {
      target: { value: "Billing issue regarding cloud license" }
    });
    fireEvent.change(screen.getByLabelText(/Message Description \*/i), {
      target: { value: "We were charged twice for our subscription renewal this month." }
    });

    fireEvent.click(screen.getByRole("button", { name: /Submit Inquiry/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledTimes(1);
      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          customer_name: "Sarah Connor",
          customer_email: "sarah@example.com",
          subject: "Billing issue regarding cloud license"
        })
      );
    });
  });
});
