const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock de storage con métodos para usuarios y turnos
const mockStorage = {
  getUserByUsername: jest.fn().mockImplementation((username) => {
    if (username === 'test') {
      return Promise.resolve({
        id: 1,
        username: 'test',
        password: 'hash',
        role: 'user'
      });
    }
    return Promise.resolve(null);
  }),
  getActiveShift: jest.fn().mockImplementation((userId) => {
    return Promise.resolve(null);
  }),
  createShift: jest.fn().mockImplementation((data) => {
    return Promise.resolve({
      id: 1,
      userId: data.userId,
      startTime: data.startTime,
      endTime: null,
      status: 'active',
      shiftType: data.shiftType,
      notes: data.notes
    });
  })
};

// Mock simple de bcrypt
const mockBcrypt = {
  compare: jest.fn().mockImplementation((pass, hash) => {
    return Promise.resolve(pass === 'password' && hash === 'hash');
  })
};

// Mock de los módulos
jest.mock('./server/storage', () => ({
  storage: mockStorage
}));

jest.mock('bcrypt', () => mockBcrypt);

// Exportar mocks para uso en tests
global.__mocks__ = {
  storage: mockStorage,
  bcrypt: mockBcrypt
};