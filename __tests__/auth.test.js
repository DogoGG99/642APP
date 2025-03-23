const { describe, it, expect, beforeAll, beforeEach } = require('@jest/globals');
const request = require('supertest');
const express = require('express');

describe('Authentication Tests', () => {
  let app;
  let mockStorage;
  let mockBcrypt;

  beforeAll(async () => {
    console.log('Setting up Authentication Tests');
    mockStorage = global.__mocks__.storage;
    mockBcrypt = global.__mocks__.bcrypt;

    const { registerRoutes } = require('server/routes');
    app = express();
    app.use(express.json());

    // Mock authentication middleware
    app.use((req, _res, next) => {
      req.isAuthenticated = () => true;
      req.user = { id: 1, username: 'testuser', role: 'user' };
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
      console.log('Testing invalid credentials');
      mockStorage.getUserByUsername.mockResolvedValue({ 
        id: 1, 
        username: 'testuser',
        password: 'hashedpassword' 
      });
      mockBcrypt.compare.mockResolvedValueOnce(false);

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
      console.log('Testing valid credentials');
      mockStorage.getUserByUsername.mockResolvedValue({ 
        id: 1, 
        username: 'testuser',
        password: 'hashedpassword' 
      });
      mockBcrypt.compare.mockResolvedValueOnce(true);

      // Act
      const response = await request(app)
        .post('/api/login')
        .send({
          username: 'testuser',
          password: 'correctpassword'
        });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('username', 'testuser');
      expect(mockStorage.getUserByUsername).toHaveBeenCalledWith('testuser');
    });

    it('should handle server errors during login', async () => {
      // Arrange
      console.log('Testing server error');
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