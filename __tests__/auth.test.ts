import request from 'supertest';
import express from 'express';
import { storage } from '../server/storage';
import { registerRoutes } from '../server/routes';
import bcrypt from 'bcrypt';

jest.mock('../server/storage');
jest.mock('bcrypt');

describe('Authentication Tests', () => {
  let app: express.Express;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    await registerRoutes(app);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Login Tests', () => {
    it('should return 401 when credentials are invalid', async () => {
      // Arrange
      const hashedPassword = await bcrypt.hash('correctpassword', 10);
      const mockedStorage = jest.mocked(storage);
      mockedStorage.getUserByUsername.mockResolvedValue({
        id: 1,
        username: 'testuser',
        password: hashedPassword,
        role: 'user'
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

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
      // Arrange
      const hashedPassword = await bcrypt.hash('correctpassword', 10);
      const validUser = {
        id: 1,
        username: 'testuser',
        password: hashedPassword,
        role: 'user'
      };

      const mockedStorage = jest.mocked(storage);
      mockedStorage.getUserByUsername.mockResolvedValue(validUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      // Act
      const response = await request(app)
        .post('/api/login')
        .send({
          username: 'testuser',
          password: 'correctpassword'
        });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', validUser.id);
      expect(response.body).toHaveProperty('username', validUser.username);
    });

    it('should handle server errors during login', async () => {
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