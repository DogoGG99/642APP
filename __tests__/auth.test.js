const { describe, it, expect, beforeAll, beforeEach } = require('@jest/globals');
const request = require('supertest');
const express = require('express');

describe('Authentication Tests', () => {
  let app;
  let mockStorage;
  let mockBcrypt;

  beforeAll(async () => {
    // Get mocks from global setup
    mockStorage = global.__mocks__.storage;
    mockBcrypt = global.__mocks__.bcrypt;

    // Setup Express app
    app = express();
    app.use(express.json());

    // Mock authentication middleware
    app.use((req, _res, next) => {
      req.isAuthenticated = () => true;
      req.user = { id: 1, username: 'testuser', role: 'user' };
      next();
    });

    // Import routes after mocks are set up
    const { registerRoutes } = await import('../server/routes.js');
    await registerRoutes(app);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Login Tests', () => {
    it('should return 401 when credentials are invalid', async () => {
      mockStorage.getUserByUsername.mockResolvedValue({ 
        id: 1, 
        username: 'testuser',
        password: 'hashedpassword' 
      });
      mockBcrypt.compare.mockResolvedValueOnce(false);

      const response = await request(app)
        .post('/api/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Credenciales inválidas');
      expect(mockStorage.getUserByUsername).toHaveBeenCalledWith('testuser');
    });

    it('should return 200 and user data when credentials are valid', async () => {
      mockStorage.getUserByUsername.mockResolvedValue({ 
        id: 1, 
        username: 'testuser',
        password: 'hashedpassword' 
      });
      mockBcrypt.compare.mockResolvedValueOnce(true);

      const response = await request(app)
        .post('/api/login')
        .send({
          username: 'testuser',
          password: 'correctpassword'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('username', 'testuser');
      expect(mockStorage.getUserByUsername).toHaveBeenCalledWith('testuser');
    });
  });
});