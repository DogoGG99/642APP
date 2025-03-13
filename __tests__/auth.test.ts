import { jest, describe, it, expect, beforeAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { storage } from '../server/storage';
import { registerRoutes } from '../server/routes';
import bcrypt from 'bcrypt';
import type { User } from '@shared/schema';

jest.mock('../server/storage');
jest.mock('bcrypt');

console.log('Loading auth.test.ts');

describe('Authentication Tests', () => {
  let app: express.Express;
  const mockUser: User = {
    id: 1,
    username: 'testuser',
    password: 'hashedpassword',
    role: 'user'
  };

  beforeAll(async () => {
    console.log('Setting up auth tests');
    app = express();
    app.use(express.json());
    // Configurar autenticación simulada antes de registrar las rutas
    app.use((req: any, _res, next) => {
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

      const mockCompare = bcrypt.compare as jest.Mock;
      mockCompare.mockResolvedValueOnce(false);

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

      const mockCompare = bcrypt.compare as jest.Mock;
      mockCompare.mockResolvedValueOnce(true);

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