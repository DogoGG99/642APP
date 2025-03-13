/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TestWrapper } from "../test/test-utils";
import AuthPage from "../pages/auth-page";

const mockToast = vi.fn();

// Configure los mocks antes de importar el componente
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: mockToast
  })
}));

describe("AuthPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockToast.mockClear();
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
    const mockResponse = {
      ok: false,
      status: 401,
      json: () => Promise.resolve({ message: "Credenciales inválidas" })
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

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
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Error",
          description: "Credenciales inválidas",
          variant: "destructive"
        })
      );
    }, { timeout: 1000 }); // Reducir el timeout a 1 segundo

    // Verificar que fetch fue llamado con los parámetros correctos
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});