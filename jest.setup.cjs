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

// Mock dependencies in the correct order
jest.mock('express-session', () => {
  return jest.fn(() => (_req, _res, next) => next());
});

jest.mock('bcrypt', () => mockBcrypt);

jest.mock('./server/storage', () => {
  const storage = mockStorage;
  storage.__esModule = true;
  storage.default = mockStorage;
  storage.storage = mockStorage;
  return storage;
});

// Ensure all mocks are available globally
global.__mocks__ = {
  bcrypt: mockBcrypt,
  storage: mockStorage
};

// Add any additional mocks or global setup needed for tests