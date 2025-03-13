const { describe, it, expect, beforeAll, beforeEach } = require('@jest/globals');
const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');

// Mock de storage
const mockStorage = {
  getUserByUsername: jest.fn(),
  createUser: jest.fn()
};

jest.mock('../server/storage.ts', () => ({
  storage: mockStorage
}));

jest.mock('bcrypt');

console.log('Loading auth.test.js');

describe('Authentication Tests', () => {
  let app;
  const mockUser = {
    id: 1,
    username: 'testuser',
    password: 'hashedpassword',
    role: 'user'
  };

  beforeAll(async () => {
    console.log('Setting up auth tests');
    app = express();
    app.use(express.json());

    app.use((req, _res, next) => {
      req.isAuthenticated = () => true;
      req.user = mockUser;
      next();
    });

    const { registerRoutes } = await import('../server/routes.ts');
    await registerRoutes(app);
  });

  beforeEach(() => {
    console.log('Clearing mocks before test');
    jest.clearAllMocks();
  });

  describe('Login Tests', () => {
    it('should return 401 when credentials are invalid', async () => {
      console.log('Running invalid credentials test');
      mockStorage.getUserByUsername.mockResolvedValue({
        id: 1,
        username: 'testuser',
        password: 'hashedpassword',
        role: 'user'
      });

      bcrypt.compare.mockResolvedValueOnce(false);

      const response = await request(app)
        .post('/api/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Credenciales inválidas');
    });

    it('should return 200 and user data when credentials are valid', async () => {
      console.log('Running valid credentials test');
      mockStorage.getUserByUsername.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValueOnce(true);

      const response = await request(app)
        .post('/api/login')
        .send({
          username: 'testuser',
          password: 'correctpassword'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', mockUser.id);
      expect(response.body).toHaveProperty('username', mockUser.username);
    });

    it('should handle server errors during login', async () => {
      console.log('Running server error test');
      mockStorage.getUserByUsername.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/login')
        .send({
          username: 'testuser',
          password: 'password'
        });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'Error en el servidor');
    });
  });
});