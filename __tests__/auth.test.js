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
    mockStorage = global.__mocks__.storage;
    mockBcrypt = global.__mocks__.bcrypt;

    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    const routes = require('../server/routes');
    server = await routes.registerRoutes(app);
  });

  beforeEach(() => {
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
      const response = await request(app)
        .post('/api/login')
        .set('Content-Type', 'application/json')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Credenciales inválidas');
      expect(mockStorage.getUserByUsername).not.toHaveBeenCalled();
    });

    it('should return 401 when user does not exist', async () => {
      mockStorage.getUserByUsername.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/login')
        .set('Content-Type', 'application/json')
        .send({
          username: 'nonexistent',
          password: 'password'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Credenciales inválidas');
      expect(mockStorage.getUserByUsername).toHaveBeenCalledWith('nonexistent');
      expect(mockBcrypt.compare).not.toHaveBeenCalled();
    });

    it('should return 401 when password is incorrect', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        password: 'hashedpassword',
        role: 'user'
      };

      mockStorage.getUserByUsername.mockResolvedValue(mockUser);
      mockBcrypt.compare.mockResolvedValue(false);

      const response = await request(app)
        .post('/api/login')
        .set('Content-Type', 'application/json')
        .send({
          username: 'testuser',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Credenciales inválidas');
    });

    it('should return 200 and user data when credentials are valid', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        password: 'hashedpassword',
        role: 'user'
      };

      mockStorage.getUserByUsername.mockResolvedValue(mockUser);
      mockBcrypt.compare.mockResolvedValue(true);

      const response = await request(app)
        .post('/api/login')
        .set('Content-Type', 'application/json')
        .send({
          username: 'testuser',
          password: 'correctpassword'
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: mockUser.id,
        username: mockUser.username,
        role: mockUser.role
      });
    });
  });
});