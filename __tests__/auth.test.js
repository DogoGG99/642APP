const { jest, describe, it, expect, beforeAll, beforeEach } = require('@jest/globals');
const request = require('supertest');
const express = require('express');
const { storage } = require('../server/storage');
const { registerRoutes } = require('../server/routes');
const bcrypt = require('bcrypt');

jest.mock('../server/storage');
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
    await registerRoutes(app);
  });

  beforeEach(() => {
    console.log('Clearing mocks before test');
    jest.clearAllMocks();
  });

  describe('Login Tests', () => {
    it('should return 401 when credentials are invalid', async () => {
      console.log('Running invalid credentials test');
      // Arrange
      const mockedStorage = jest.mocked(storage);
      mockedStorage.getUserByUsername.mockResolvedValue({
        id: 1,
        username: 'testuser',
        password: 'hashedpassword',
        role: 'user'
      });

      bcrypt.compare.mockResolvedValueOnce(false);

      // Act
      const response = await request(app)
        .post('/api/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword'
        });

      // Assert
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Credenciales inválidas');
    });

    it('should return 200 and user data when credentials are valid', async () => {
      console.log('Running valid credentials test');
      // Arrange
      const mockedStorage = jest.mocked(storage);
      mockedStorage.getUserByUsername.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValueOnce(true);

      // Act
      const response = await request(app)
        .post('/api/login')
        .send({
          username: 'testuser',
          password: 'correctpassword'
        });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', mockUser.id);
      expect(response.body).toHaveProperty('username', mockUser.username);
    });

    it('should handle server errors during login', async () => {
      console.log('Running server error test');
      // Arrange
      const mockedStorage = jest.mocked(storage);
      mockedStorage.getUserByUsername.mockRejectedValue(new Error('Database error'));

      // Act
      const response = await request(app)
        .post('/api/login')
        .send({
          username: 'testuser',
          password: 'password'
        });

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'Error en el servidor');
    });
  });
});