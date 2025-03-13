const { jest, describe, it, expect, beforeAll, beforeEach } = require('@jest/globals');
const request = require('supertest');
const express = require('express');
const { registerRoutes } = require('../server/routes');
const { storage } = require('../server/storage');

jest.mock('../server/storage');

console.log('Loading shifts.test.js');

describe('Shift Management Tests', () => {
  let app;
  const mockUser = {
    id: 1,
    username: 'testuser',
    password: 'hashedpassword',
    role: 'user'
  };

  beforeAll(async () => {
    console.log('Setting up shifts tests');
    app = express();
    app.use(express.json());
    // Configurar autenticación simulada antes de registrar las rutas
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

  describe('Open Shift Tests', () => {
    it('should not allow opening a shift when user already has an active shift', async () => {
      console.log('Running active shift test');
      // Arrange
      const mockActiveShift = {
        id: 1,
        userId: mockUser.id,
        startTime: new Date().toISOString(),
        endTime: null,
        status: 'active',
        shiftType: 'matutino',
        notes: null
      };

      const mockedStorage = jest.mocked(storage);
      mockedStorage.getActiveShift.mockResolvedValue(mockActiveShift);

      const shiftData = {
        userId: mockUser.id,
        startTime: new Date().toISOString(),
        shiftType: 'matutino'
      };

      // Act
      const response = await request(app)
        .post('/api/shifts')
        .send(shiftData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Ya tienes un turno activo');
    });

    it('should successfully open a new shift', async () => {
      console.log('Running new shift test');
      // Arrange
      const mockedStorage = jest.mocked(storage);
      mockedStorage.getActiveShift.mockResolvedValue(undefined);

      const newShift = {
        id: 2,
        userId: mockUser.id,
        startTime: new Date().toISOString(),
        endTime: null,
        status: 'active',
        shiftType: 'matutino',
        notes: null
      };

      mockedStorage.createShift.mockResolvedValue(newShift);

      const shiftData = {
        userId: mockUser.id,
        startTime: new Date().toISOString(),
        shiftType: 'matutino'
      };

      // Act
      const response = await request(app)
        .post('/api/shifts')
        .send(shiftData);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id', newShift.id);
      expect(response.body).toHaveProperty('status', 'active');
      expect(response.body).toHaveProperty('shiftType', 'matutino');
    });

    it('should handle validation errors when creating a shift', async () => {
      console.log('Running validation error test');
      // Arrange
      const invalidShiftData = {
        userId: mockUser.id,
        startTime: 'invalid-date',
        shiftType: 'invalid-type'
      };

      // Act
      const response = await request(app)
        .post('/api/shifts')
        .send(invalidShiftData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Datos de turno inválidos');
    });
  });
});