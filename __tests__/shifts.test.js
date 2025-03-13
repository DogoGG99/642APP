const { describe, it, expect, beforeAll, beforeEach } = require('@jest/globals');
const request = require('supertest');
const express = require('express');

// Mock de storage
const mockStorage = {
  getActiveShift: jest.fn(),
  createShift: jest.fn()
};

jest.mock('../server/storage.ts', () => ({
  storage: mockStorage
}));

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

  describe('Open Shift Tests', () => {
    it('should not allow opening a shift when user already has an active shift', async () => {
      console.log('Running active shift test');
      const mockActiveShift = {
        id: 1,
        userId: mockUser.id,
        startTime: new Date().toISOString(),
        endTime: null,
        status: 'active',
        shiftType: 'matutino',
        notes: null
      };

      mockStorage.getActiveShift.mockResolvedValue(mockActiveShift);

      const shiftData = {
        userId: mockUser.id,
        startTime: new Date().toISOString(),
        shiftType: 'matutino'
      };

      const response = await request(app)
        .post('/api/shifts')
        .send(shiftData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Ya tienes un turno activo');
    });

    it('should successfully open a new shift', async () => {
      console.log('Running new shift test');
      mockStorage.getActiveShift.mockResolvedValue(undefined);

      const newShift = {
        id: 2,
        userId: mockUser.id,
        startTime: new Date().toISOString(),
        endTime: null,
        status: 'active',
        shiftType: 'matutino',
        notes: null
      };

      mockStorage.createShift.mockResolvedValue(newShift);

      const shiftData = {
        userId: mockUser.id,
        startTime: new Date().toISOString(),
        shiftType: 'matutino'
      };

      const response = await request(app)
        .post('/api/shifts')
        .send(shiftData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id', newShift.id);
      expect(response.body).toHaveProperty('status', 'active');
      expect(response.body).toHaveProperty('shiftType', 'matutino');
    });
  });
});