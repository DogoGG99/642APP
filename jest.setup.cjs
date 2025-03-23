const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Configure storage mock
const mockStorage = {
  getUserByUsername: jest.fn(),
  getUser: jest.fn(),
  getActiveShift: jest.fn(),
  createShift: jest.fn(),
  updateShift: jest.fn(),
  sessionStore: {}
};

// Configure bcrypt mock with simplified behavior
const mockBcrypt = {
  hash: jest.fn().mockResolvedValue('hashedpassword'),
  compare: jest.fn().mockImplementation((plaintext, _hash) => {
    return Promise.resolve(plaintext === 'correctpassword');
  })
};

// Mock express-session first to avoid circular dependencies
jest.mock('express-session', () => {
  return jest.fn(() => (_req, _res, next) => next());
});

// Mock bcrypt with explicit behavior
jest.mock('bcrypt', () => mockBcrypt);

// Mock storage with proper ES module support
jest.mock('./server/storage', () => ({
  __esModule: true,
  storage: mockStorage,
  default: mockStorage
}));

// Make mocks available globally
global.__mocks__ = {
  bcrypt: mockBcrypt,
  storage: mockStorage
};