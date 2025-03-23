const { describe, it, expect, beforeAll, beforeEach } = require('@jest/globals');
const request = require('supertest');
const express = require('express');

describe('Shift Management Tests', () => {
  let app;
  let mockStorage;
  const mockUser = { 
    id: 1, 
    username: 'testuser', 
    role: 'user' 
  };

  beforeAll(async () => {
    // Get mock from global setup
    mockStorage = global.__mocks__.storage;

    // Setup Express app
    app = express();
    app.use(express.json());

    // Mock authentication middleware
    app.use((req, _res, next) => {
      req.isAuthenticated = () => true;
      req.user = mockUser;
      next();
    });

    // Import routes after mocks are set up
    const { registerRoutes } = await import('../server/routes.js');
    await registerRoutes(app);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Open Shift Tests', () => {
    it('should not allow opening a shift when user already has an active shift', async () => {
      const mockActiveShift = {
        id: 1,
        userId: mockUser.id,
        startTime: new Date().toISOString(),
        endTime: null,
        status: 'active',
        shiftType: 'matutino',
        notes: null
      };

      // Mock storage to return active shift
      mockStorage.getActiveShift.mockResolvedValue(mockActiveShift);

      const response = await request(app)
        .post('/api/shifts')
        .send({
          startTime: new Date().toISOString(),
          shiftType: 'matutino',
          notes: ''
        });

      console.log('Response status:', response.status);
      console.log('Response body:', response.body);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Ya tienes un turno activo');
      expect(mockStorage.getActiveShift).toHaveBeenCalledWith(mockUser.id);
    });

    it('should successfully open a new shift', async () => {
      // Mock storage to return no active shift
      mockStorage.getActiveShift.mockResolvedValue(null);

      const shiftData = {
        startTime: new Date().toISOString(),
        shiftType: 'matutino',
        notes: ''
      };

      const newShift = {
        id: 2,
        userId: mockUser.id,
        ...shiftData,
        endTime: null,
        status: 'active'
      };

      mockStorage.createShift.mockResolvedValue(newShift);

      const response = await request(app)
        .post('/api/shifts')
        .send(shiftData);

      console.log('Response status:', response.status);
      console.log('Response body:', response.body);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id', newShift.id);
      expect(response.body).toHaveProperty('status', 'active');
      expect(response.body).toHaveProperty('shiftType', 'matutino');
      expect(mockStorage.getActiveShift).toHaveBeenCalledWith(mockUser.id);
      expect(mockStorage.createShift).toHaveBeenCalled();
    });
  });
});