const { describe, it, expect, beforeAll, beforeEach, afterAll } = require('@jest/globals');
const request = require('supertest');
const express = require('express');
const { createServer } = require('http');

describe('Authentication Tests', () => {
  let app;
  let mockStorage;
  let mockBcrypt;
  let server;

  beforeAll(async () => {
    // Get mocks from global setup
    mockStorage = global.__mocks__.storage;
    mockBcrypt = global.__mocks__.bcrypt;

    // Setup Express app with explicit middleware
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Import routes after mocks are set up
    const routes = require('../server/routes');
    server = await routes.registerRoutes(app);
  });

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    mockStorage.getUserByUsername.mockReset();
    mockBcrypt.compare.mockReset();
  });

  afterAll((done) => {
    if (server) server.close(done);
    else done();
  });

  describe('Login Tests', () => {
    it('should return 400 when credentials are missing', async () => {
      mockStorage.getUserByUsername.mockResolvedValue(null); //Reinstate this line
      const response = await request(app)
        .post('/api/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Credenciales inválidas');
    });

    it('should return 401 when user does not exist', async () => {
      mockStorage.getUserByUsername.mockResolvedValue(null); //Reinstate this line

      const response = await request(app)
        .post('/api/login')
        .send({
          username: 'nonexistent',
          password: 'password'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Credenciales inválidas');
    });

    it('should return 401 when password is incorrect', async () => {
      mockStorage.getUserByUsername.mockResolvedValue({
        id: 1,
        username: 'testuser',
        password: 'hashedpassword'
      });
      mockBcrypt.compare.mockResolvedValue(false);

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
      mockStorage.getUserByUsername.mockResolvedValue({
        id: 1,
        username: 'testuser',
        password: 'hashedpassword',
        role: 'user'
      });
      mockBcrypt.compare.mockResolvedValue(true);

      const response = await request(app)
        .post('/api/login')
        .send({
          username: 'testuser',
          password: 'correctpassword'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('username', 'testuser');
      expect(response.body).toHaveProperty('role', 'user');
    });
  });
});