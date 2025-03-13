import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AuthPage from "../pages/auth-page";
import { TestWrapper } from "../test/test-utils";

// Mock de los hooks y componentes necesarios
vi.mock("wouter", () => ({
  useLocation: () => ["/auth", () => {}]
}));

vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({
    user: null,
    login: vi.fn(),
    loginMutation: {
      isPending: false,
      isError: false,
      error: null,
      mutate: vi.fn()
    },
    signupMutation: {
      isPending: false,
      isError: false,
      error: null,
      mutate: vi.fn()
    }
  }),
  AuthProvider: ({ children }) => <>{children}</>
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

describe("AuthPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debería mostrar el formulario de login", async () => {
    render(
      <TestWrapper>
        <AuthPage />
      </TestWrapper>
    );

    const usernameInput = await screen.findByPlaceholderText(/usuario/i);
    const passwordInput = await screen.findByPlaceholderText(/contraseña/i);

    expect(usernameInput).toBeDefined();
    expect(passwordInput).toBeDefined();
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

    const usernameInput = await screen.findByPlaceholderText(/usuario/i);
    const passwordInput = await screen.findByPlaceholderText(/contraseña/i);
    const submitButton = await screen.findByRole("button", { name: /iniciar sesión/i });

    fireEvent.change(usernameInput, { target: { value: "wronguser" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpass" } });
    fireEvent.click(submitButton);

    const errorMessage = await screen.findByText(/credenciales inválidas/i);
    expect(errorMessage).toBeDefined();
  });
});