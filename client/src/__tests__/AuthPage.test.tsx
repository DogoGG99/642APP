/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TestWrapper } from "../test/test-utils";
import AuthPage from "../pages/auth-page";
import { mockToast } from '../test/setup';

describe("AuthPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show login form", () => {
    render(
      <TestWrapper>
        <AuthPage />
      </TestWrapper>
    );

    expect(screen.getByPlaceholderText(/usuario/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/contraseña/i)).toBeInTheDocument();
  });

  it("should show error with invalid credentials", async () => {
    render(
      <TestWrapper>
        <AuthPage />
      </TestWrapper>
    );

    // Submit form with invalid credentials
    fireEvent.change(screen.getByPlaceholderText(/usuario/i), { 
      target: { value: "wronguser" } 
    });
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), { 
      target: { value: "wrongpass" } 
    });
    fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    // Use vi.runAllTimers() to flush pending timers
    vi.runAllTimers();

    // Wait for the toast to be called
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalled();
      const [toastArgs] = mockToast.mock.calls[0];
      expect(toastArgs.title).toBe("Error");
      expect(toastArgs.description).toBe("Credenciales inválidas");
    });
  });
});