const { TextEncoder, TextDecoder } = require('util');
const { jest } = require('@jest/globals');

// Configurar encoders/decoders globales
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Configurar mocks globales si es necesario
const mockBcrypt = {
  hash: jest.fn().mockImplementation(() => Promise.resolve('hashedPassword')),
  compare: jest.fn().mockImplementation(() => Promise.resolve(true))
};

jest.mock('bcrypt', () => mockBcrypt);

// Logging para debug
console.log('Jest setup file loaded');
