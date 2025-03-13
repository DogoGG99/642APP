/// <reference types="jest" />
// Configuración global para Jest
import { TextEncoder, TextDecoder } from 'util';
import { jest } from '@jest/globals';

// Configurar encoders/decoders globales
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Configurar mocks globales si es necesario
jest.mock('bcrypt', () => {
  const mock = {
    hash: jest.fn((_data: string, _salt: number) => Promise.resolve('hashedPassword')),
    compare: jest.fn((_data: string, _hash: string) => Promise.resolve(true))
  };
  return mock;
});

// Logging para debug
console.log('Jest setup file loaded');