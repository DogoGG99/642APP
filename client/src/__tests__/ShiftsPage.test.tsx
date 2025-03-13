import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ShiftsPage from "../pages/shifts-page";
import { TestWrapper } from "../test/test-utils";

// Mock de los hooks y componentes necesarios
vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({
    user: { id: 1, username: "testuser" }
  }),
  AuthProvider: ({ children }) => <>{children}</>
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

// Mock de las respuestas de la API
vi.mock("@/lib/queryClient", () => ({
  queryClient: new QueryClient(),
  apiRequest: vi.fn()
}));

describe("ShiftsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debería mostrar el botón de 'Abrir Turno' cuando no hay turno activo", async () => {
    render(
      <TestWrapper>
        <ShiftsPage />
      </TestWrapper>
    );

    const button = await screen.findByText("Abrir Turno");
    expect(button).toBeDefined();
  });

  it("debería mostrar el formulario de apertura de turno al hacer click en el botón", async () => {
    render(
      <TestWrapper>
        <ShiftsPage />
      </TestWrapper>
    );

    const openButton = await screen.findByText("Abrir Turno");
    fireEvent.click(openButton);

    const formTitle = await screen.findByText("Abrir Nuevo Turno");
    const shiftTypeLabel = await screen.findByText("Tipo de Turno");

    expect(formTitle).toBeDefined();
    expect(shiftTypeLabel).toBeDefined();
  });
});