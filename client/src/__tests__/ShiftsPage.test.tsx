import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

// Mock los hooks necesarios antes de importar el componente
vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    useMutation: () => ({
      mutate: vi.fn(),
      mutateAsync: vi.fn(),
      isPending: false,
      isError: false,
      error: null,
      reset: vi.fn()
    }),
    useQuery: () => ({
      data: null,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
      isFetching: false
    })
  };
});

vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({
    user: { id: 1, username: "testuser" },
    loginMutation: {
      isPending: false,
      isError: false,
      error: null,
      mutate: vi.fn(),
      reset: vi.fn()
    }
  }),
  AuthProvider: ({ children }) => <>{children}</>
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

vi.mock("@/lib/queryClient", () => ({
  queryClient: {
    invalidateQueries: vi.fn(),
    setQueryData: vi.fn()
  },
  apiRequest: vi.fn()
}));

// Importar el componente después de los mocks
import ShiftsPage from "../pages/shifts-page";
import { TestWrapper } from "../test/test-utils";

describe("ShiftsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debería mostrar el botón de 'Abrir Turno' cuando no hay turno activo", () => {
    render(
      <TestWrapper>
        <ShiftsPage />
      </TestWrapper>
    );

    const button = screen.getByText("Abrir Turno");
    expect(button).toBeInTheDocument();
  });

  it("debería mostrar el formulario de apertura de turno al hacer click en el botón", () => {
    render(
      <TestWrapper>
        <ShiftsPage />
      </TestWrapper>
    );

    const openButton = screen.getByText("Abrir Turno");
    fireEvent.click(openButton);

    const formTitle = screen.getByText("Abrir Nuevo Turno");
    const shiftTypeLabel = screen.getByText("Tipo de Turno");

    expect(formTitle).toBeInTheDocument();
    expect(shiftTypeLabel).toBeInTheDocument();
  });
});