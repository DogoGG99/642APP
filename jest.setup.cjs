const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock storage
const mockStorage = {
  getUserByUsername: jest.fn(),
  getUser: jest.fn(),
  createUser: jest.fn(),
  getActiveShift: jest.fn(),
  createShift: jest.fn(),
  updateShift: jest.fn()
};

// Mock bcrypt
const mockBcrypt = {
  hash: jest.fn().mockImplementation(() => Promise.resolve('hashedPassword')),
  compare: jest.fn().mockImplementation(() => Promise.resolve(true))
};

// Configure mocks
jest.mock('../server/storage', () => ({
  storage: mockStorage,
  default: mockStorage
}));

jest.mock('bcrypt', () => mockBcrypt);

// Mock express-session
jest.mock('express-session', () => {
  return jest.fn(() => {
    return (_req, _res, next) => next();
  });
});

// Make mocks available globally
global.__mocks__ = {
  bcrypt: mockBcrypt,
  storage: mockStorage
};