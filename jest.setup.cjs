const { TextEncoder, TextDecoder } = require('util');

// Configure global encoders/decoders
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Configure mock storage
const mockStorage = {
  getUserByUsername: jest.fn(),
  getUser: jest.fn(),
  createUser: jest.fn(),
  getActiveShift: jest.fn(),
  createShift: jest.fn(),
  updateShift: jest.fn()
};

// Configure bcrypt mock
const mockBcrypt = {
  hash: jest.fn().mockImplementation(() => Promise.resolve('hashedPassword')),
  compare: jest.fn().mockImplementation(() => Promise.resolve(true))
};

// Mock modules
jest.mock('bcrypt', () => mockBcrypt);
jest.mock('server/storage', () => ({
  storage: mockStorage
}));

// Make mocks available globally
global.__mocks__ = {
  bcrypt: mockBcrypt,
  storage: mockStorage
};

console.log('Jest setup completed - mocks configured');