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

// Configure mocks before tests
const storagePath = path.resolve(__dirname, 'server', 'storage.ts');
const routesPath = path.resolve(__dirname, 'server', 'routes.ts');

// Mock modules using explicit paths
jest.mock(storagePath, () => ({
  storage: mockStorage,
  default: mockStorage
}), { virtual: true });

jest.mock('bcrypt', () => mockBcrypt);

// Mock express-session
jest.mock('express-session', () => {
  return jest.fn(() => {
    return (_req, _res, next) => next();
  });
});

// Make mocks available globally for tests
global.__mocks__ = {
  bcrypt: mockBcrypt,
  storage: mockStorage,
  paths: {
    storage: storagePath,
    routes: routesPath
  }
};

console.log('Jest setup completed');