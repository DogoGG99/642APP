const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Configure mocks
const mockStorage = {
  getUserByUsername: jest.fn(),
  getUser: jest.fn(),
  getActiveShift: jest.fn(),
  createShift: jest.fn(),
  updateShift: jest.fn()
};

const mockBcrypt = {
  hash: jest.fn().mockImplementation(() => Promise.resolve('hashedPassword')),
  compare: jest.fn().mockImplementation(() => Promise.resolve(true))
};

// Mock express-session first
jest.mock('express-session', () => {
  return jest.fn(() => (_req, _res, next) => next());
});

// Mock bcrypt
jest.mock('bcrypt', () => mockBcrypt);

// Mock storage with proper ES module support
jest.mock('./server/storage.ts', () => {
  return {
    __esModule: true,
    storage: mockStorage,
    default: mockStorage
  };
});

// Make mocks available globally
global.__mocks__ = {
  bcrypt: mockBcrypt,
  storage: mockStorage
};