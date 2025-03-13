/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TestWrapper } from "../test/test-utils";
import AuthPage from "../pages/auth-page";

const mockToast = vi.fn();

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: mockToast
  })
}));

describe("AuthPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as jest.Mock) = vi.fn();
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
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ message: "Credenciales inválidas" })
    });

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
    fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    // Usar act y waitFor para manejar correctamente las actualizaciones asíncronas
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Error",
          description: "Credenciales inválidas",
          variant: "destructive"
        })
      );
    }, { timeout: 2000 });
  });
});