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

// Mock express-session
jest.mock('express-session', () => {
  return jest.fn(() => {
    return (_req, _res, next) => next();
  });
});

// Mock storage module
jest.mock('./server/storage.js', () => ({
  storage: mockStorage,
  default: mockStorage
}));

// Mock bcrypt
jest.mock('bcrypt', () => mockBcrypt);

// Make mocks available globally
global.__mocks__ = {
  bcrypt: mockBcrypt,
  storage: mockStorage
};