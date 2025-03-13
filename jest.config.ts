import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/client/src/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1'
  },
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json'
    }]
  },
  setupFiles: ['<rootDir>/jest.setup.ts'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  verbose: true,
  testTimeout: 10000,
  transformIgnorePatterns: [
    'node_modules/(?!@shared)/'
  ]
};

export default config;