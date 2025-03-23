module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/client/src/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1'
  },
  transform: {
    '^.+\\.tsx?$': ['babel-jest', {
      configFile: './babel.config.cjs'
    }],
    '^.+\\.jsx?$': ['babel-jest', {
      configFile: './babel.config.cjs'
    }]
  },
  testMatch: [
    '**/__tests__/**/*.test.js'
  ],
  setupFiles: ['<rootDir>/jest.setup.cjs'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  verbose: true,
  testTimeout: 10000,
  transformIgnorePatterns: [
    '/node_modules/(?!(@shared|drizzle-zod|drizzle-orm|zod)/)'
  ],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node']
};