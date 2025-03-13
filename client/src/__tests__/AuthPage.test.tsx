import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TestWrapper } from "../test/test-utils";
import AuthPage from "../pages/auth-page";

vi.mock("wouter", () => ({
  useLocation: () => ["/auth", () => {}]
}));

describe("AuthPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debería mostrar el formulario de login", () => {
    render(
      <TestWrapper>
        <AuthPage />
      </TestWrapper>
    );

    const usernameInput = screen.getByPlaceholderText(/usuario/i);
    const passwordInput = screen.getByPlaceholderText(/contraseña/i);

    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  it("debería mostrar error con credenciales inválidas", async () => {
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

    const usernameInput = screen.getByPlaceholderText(/usuario/i);
    const passwordInput = screen.getByPlaceholderText(/contraseña/i);
    const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });

    fireEvent.change(usernameInput, { target: { value: "wronguser" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpass" } });
    fireEvent.click(submitButton);

    const errorMessage = await screen.findByText(/credenciales inválidas/i);
    expect(errorMessage).toBeInTheDocument();
  });
});