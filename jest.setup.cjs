const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock básico de storage con manejo de errores
const mockStorage = {
  getUserByUsername: jest.fn().mockImplementation((username) => {
    if (!username) {
      return Promise.reject(new Error('Username is required'));
    }
    return Promise.resolve(null);
  }),
  getUser: jest.fn(),
  getActiveShift: jest.fn(),
  createShift: jest.fn(),
  updateShift: jest.fn(),
  sessionStore: {}
};

// Mock básico de bcrypt con manejo de errores
const mockBcrypt = {
  hash: jest.fn().mockImplementation(() => Promise.resolve('hashedpassword')),
  compare: jest.fn().mockImplementation((plaintext, hash) => {
    if (!plaintext || !hash) {
      return Promise.reject(new Error('Invalid arguments'));
    }
    return Promise.resolve(plaintext === 'correctpassword' && hash === 'hashedpassword');
  })
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