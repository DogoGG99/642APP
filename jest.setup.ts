/// <reference types="jest" />
// Configuración global para Jest
import { TextEncoder, TextDecoder } from 'util';
import { jest } from '@jest/globals';

// Configurar encoders/decoders globales
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Configurar mocks globales si es necesario
jest.mock('bcrypt', () => ({
  hash: jest.fn<(text: string, rounds: number) => Promise<string>>().mockResolvedValue('hashedPassword'),
  compare: jest.fn<(text: string, hash: string) => Promise<boolean>>().mockResolvedValue(true)
}));

// Logging para debug
console.log('Jest setup file loaded');