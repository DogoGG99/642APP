import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom';

expect.extend(matchers);

// Limpia el DOM después de cada prueba
afterEach(() => {
  cleanup();
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

// Mock Auth Hook
vi.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({
    user: null,
    login: vi.fn(),
    loginMutation: {
      isPending: false,
      isError: false,
      error: null,
      mutate: vi.fn(),
      reset: vi.fn()
    },
    signupMutation: {
      isPending: false,
      isError: false,
      error: null,
      mutate: vi.fn(),
      reset: vi.fn()
    }
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

// Mock Toast Hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

// Mock Query Client
vi.mock('@/lib/queryClient', () => ({
  queryClient: {
    invalidateQueries: vi.fn(),
    setQueryData: vi.fn()
  },
  apiRequest: vi.fn()
}));