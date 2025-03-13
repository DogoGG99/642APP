import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom';
import React from 'react';

expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Mock global fetch
global.fetch = vi.fn();

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock React Query
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useMutation: () => ({
      mutate: vi.fn().mockRejectedValue(new Error("Credenciales inválidas")),
      isPending: false,
      isError: true,
      error: new Error("Credenciales inválidas")
    })
  };
});

// Mock Toast Hook
const mockToast = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast
  })
}));

// Mock Auth Hook
vi.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({
    user: null,
    loginMutation: {
      mutate: vi.fn().mockRejectedValue(new Error("Credenciales inválidas")),
      isPending: false,
      isError: true,
      error: new Error("Credenciales inválidas")
    }
  }),
  AuthProvider: ({ children }) => React.createElement(React.Fragment, null, children)
}));

// Mock wouter
vi.mock('wouter', () => ({
  useLocation: () => ["/", () => {}],
  Link: ({ children, ...props }) => React.createElement('a', props, children)
}));

// Export mock toast for tests
export { mockToast };