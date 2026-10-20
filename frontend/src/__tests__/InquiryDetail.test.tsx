import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { StatusBadge } from "../components/StatusBadge";
import { StatusActions } from "../components/StatusActions";

describe("InquiryDetail & Status Components", () => {
  it("renders status badge with correct text", () => {
    render(<StatusBadge status="IN_PROGRESS" type="status" />);
    expect(screen.getByText(/IN PROGRESS/i)).toBeInTheDocument();
  });

  it("renders allowable status transition buttons for NEW inquiries", () => {
    render(
      <StatusActions
        currentStatus="NEW"
        onTransition={vi.fn()}
      />
    );

    // From NEW, allowed transitions are IN_PROGRESS and CLOSED
    expect(screen.getByRole("button", { name: /Start Progress/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Close Inquiry/i })).toBeInTheDocument();
  });

  it("triggers onTransition when confirming status change", async () => {
    const mockTransition = vi.fn().mockResolvedValue(undefined);
    render(
      <StatusActions
        currentStatus="NEW"
        onTransition={mockTransition}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Start Progress/i }));

    expect(screen.getByText(/Confirm transition to/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Confirm Status Change/i }));

    await waitFor(() => {
      expect(mockTransition).toHaveBeenCalledWith("IN_PROGRESS", "");
    });
  });
});
