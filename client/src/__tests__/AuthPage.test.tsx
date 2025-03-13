/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TestWrapper } from "../test/test-utils";
import AuthPage from "../pages/auth-page";

global.fetch = vi.fn(); // Moved fetch mock outside the test

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
    
    (global.fetch as any).mockResolvedValueOnce({ // Type assertion for better type safety
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

    const errorMessage = await screen.findByText(/credenciales inválidas/i);
    expect(errorMessage).toBeInTheDocument();
  });
});