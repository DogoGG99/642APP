const { TextEncoder, TextDecoder } = require('util');
const path = require('path');

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

// Mock modules
jest.mock('bcrypt', () => mockBcrypt);

// Use require.resolve to get the actual path of the module
const storagePath = require.resolve('../server/storage');
jest.mock(storagePath, () => ({
  storage: mockStorage
}));

// Make mocks available globally
global.__mocks__ = {
  bcrypt: mockBcrypt,
  storage: mockStorage
};

console.log('Jest setup completed');