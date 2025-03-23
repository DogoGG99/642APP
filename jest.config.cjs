module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/client/src/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1',
    '^server/(.*)$': '<rootDir>/server/$1'
  },
  transform: {
    '^.+\\.[jt]sx?$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { 
          targets: { node: 'current' }
        }],
        '@babel/preset-typescript'
      ]
    }]
  },
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/__tests__/**/*.spec.js'
  ],
  setupFiles: ['<rootDir>/jest.setup.cjs'],
  verbose: true,
  testTimeout: 10000,
  transformIgnorePatterns: [
    'node_modules/(?!@shared)/'
  ],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/'
  ],
  rootDir: '.'
};