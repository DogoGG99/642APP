/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TestWrapper } from "../test/test-utils";
import ShiftsPage from "../pages/shifts-page";

describe("ShiftsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show 'Open Shift' button when no active shift", () => {
    render(
      <TestWrapper>
        <ShiftsPage />
      </TestWrapper>
    );

    expect(screen.getByText(/abrir turno/i)).toBeInTheDocument();
  });

  it("should show shift form when clicking the button", () => {
    render(
      <TestWrapper>
        <ShiftsPage />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText(/abrir turno/i));

    expect(screen.getByText(/abrir nuevo turno/i)).toBeInTheDocument();
    expect(screen.getByText(/tipo de turno/i)).toBeInTheDocument();
  });
});