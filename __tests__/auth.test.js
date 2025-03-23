const { describe, it, expect, beforeAll, beforeEach } = require('@jest/globals');
const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');

// Mock storage
const mockStorage = {
  getUserByUsername: jest.fn(),
  createUser: jest.fn()
};

// Mock modules
jest.mock('bcrypt');
jest.mock('server/storage', () => ({
  storage: mockStorage
}));

describe('Authentication Tests', () => {
  let app;
  const mockUser = {
    id: 1,
    username: 'testuser',
    password: 'hashedpassword',
    role: 'user'
  };

  beforeAll(async () => {
    const { registerRoutes } = require('server/routes');

    app = express();
    app.use(express.json());

    // Mock authentication middleware
    app.use((req, _res, next) => {
      req.isAuthenticated = () => true;
      req.user = mockUser;
      next();
    });

    await registerRoutes(app);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Login Tests', () => {
    it('should return 401 when credentials are invalid', async () => {
      // Arrange
      mockStorage.getUserByUsername.mockResolvedValue(mockUser);
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
      expect(mockStorage.getUserByUsername).toHaveBeenCalledWith('testuser');
    });

    it('should return 200 and user data when credentials are valid', async () => {
      // Arrange
      mockStorage.getUserByUsername.mockResolvedValue(mockUser);
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
      expect(mockStorage.getUserByUsername).toHaveBeenCalledWith('testuser');
    });

    it('should handle server errors during login', async () => {
      // Arrange
      mockStorage.getUserByUsername.mockRejectedValue(new Error('Database error'));

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