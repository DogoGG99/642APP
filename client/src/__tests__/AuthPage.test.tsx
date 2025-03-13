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
    mockToast.mockClear();
    (global.fetch as jest.Mock) = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ message: "Credenciales inválidas" })
    });
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

    fireEvent.change(screen.getByPlaceholderText(/usuario/i), { 
      target: { value: "wronguser" } 
    });
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), { 
      target: { value: "wrongpass" } 
    });

    // Trigger the login
    fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    // Esperar a que se llame al toast con el mensaje de error
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error",
        description: "Credenciales inválidas",
        variant: "destructive"
      });
    });
  });
});