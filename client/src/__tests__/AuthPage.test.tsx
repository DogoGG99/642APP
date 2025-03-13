import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TestWrapper } from "../test/test-utils";
import AuthPage from "../pages/auth-page";

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
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ message: "Credenciales inválidas" })
    });
    global.fetch = mockFetch;

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

    const errorMessage = await screen.findByText(/credenciales inválidas/i);
    expect(errorMessage).toBeInTheDocument();
  });
});