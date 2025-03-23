const { TextEncoder, TextDecoder } = require('util');

// Configure global encoders/decoders
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Configure bcrypt mock
const mockBcrypt = {
  hash: jest.fn().mockImplementation(() => Promise.resolve('hashedPassword')),
  compare: jest.fn().mockImplementation(() => Promise.resolve(true))
};

// Configure storage mock with all required methods
const mockStorage = {
  getUserByUsername: jest.fn(),
  createUser: jest.fn(),
  getActiveShift: jest.fn(),
  createShift: jest.fn(),
  updateShift: jest.fn(),
  getUser: jest.fn(),
  getClients: jest.fn(),
  getInventory: jest.fn(),
  getReservations: jest.fn(),
  getBills: jest.fn()
};

// Set up global mocks
jest.mock('bcrypt', () => mockBcrypt);
jest.mock('server/storage', () => ({
  storage: mockStorage
}));

// Make mocks available globally for tests
global.__mocks__ = {
  bcrypt: mockBcrypt,
  storage: mockStorage
};

// Debug logging
console.log('Jest setup file loaded');