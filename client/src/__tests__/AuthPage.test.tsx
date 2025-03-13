/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TestWrapper } from "../test/test-utils";
import AuthPage from "../pages/auth-page";
import { mockToast } from '../test/setup';

describe("AuthPage", () => {
  beforeEach(() => {
    mockToast.mockClear();
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

    // Fill in form with invalid credentials
    fireEvent.change(screen.getByPlaceholderText(/usuario/i), {
      target: { value: "wronguser" }
    });
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), {
      target: { value: "wrongpass" }
    });

    // Trigger login and handle promise rejection
    try {
      await fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));
    } catch (error) {
      // Expected error, ignore it
    }

    // Verify toast was called with error message
    expect(mockToast).toHaveBeenCalledWith({
      title: "Error",
      description: "Credenciales inválidas",
      variant: "destructive"
    });
  });
});