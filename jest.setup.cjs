const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock de storage con implementación simple y segura
const mockStorage = {
  getUserByUsername: jest.fn((username) => {
    return Promise.resolve(null);
  }),
  getUser: jest.fn(),
  getActiveShift: jest.fn(),
  createShift: jest.fn(),
  updateShift: jest.fn(),
  sessionStore: {}
};

// Mock de bcrypt con implementación simple
const mockBcrypt = {
  hash: jest.fn(() => Promise.resolve('hashedpassword')),
  compare: jest.fn(() => Promise.resolve(false))
};

// Mock de express-session
jest.mock('express-session', () => {
  return jest.fn(() => (_req, _res, next) => next());
});

jest.mock('bcrypt', () => mockBcrypt);

jest.mock('./server/storage', () => ({
  __esModule: true,
  storage: mockStorage,
  default: mockStorage
}));

// Hacer los mocks disponibles globalmente
global.__mocks__ = {
  bcrypt: mockBcrypt,
  storage: mockStorage
};