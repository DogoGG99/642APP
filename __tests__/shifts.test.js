const { describe, it, expect, beforeEach } = require('@jest/globals');
const request = require('supertest');
const express = require('express');

describe('Shift Management Tests', () => {
  let app;
  let mockStorage;

  beforeEach(() => {
    mockStorage = global.__mocks__.storage;

    app = express();
    app.use(express.json());

    // Configurar ruta de turnos de manera simple
    app.post('/api/shifts', async (req, res) => {
      if (!req.body?.startTime || !req.body?.shiftType) {
        return res.status(400).json({ message: "Datos de turno inválidos" });
      }

      try {
        const activeShift = await mockStorage.getActiveShift(1); // userId fijo para pruebas
        if (activeShift) {
          return res.status(400).json({ message: "Ya tienes un turno activo" });
        }

        const shift = await mockStorage.createShift({
          ...req.body,
          userId: 1
        });

        return res.status(201).json(shift);
      } catch (error) {
        return res.status(500).json({ message: "Error al crear el turno" });
      }
    });
  });

  describe('Open Shift Tests', () => {
    it('should not allow opening a shift without required data', () => {
      return request(app)
        .post('/api/shifts')
        .send({})
        .expect(400)
        .then(response => {
          expect(response.body).toHaveProperty('message', 'Datos de turno inválidos');
        });
    });

    it('should successfully open a new shift', () => {
      const shiftData = {
        startTime: new Date().toISOString(),
        shiftType: 'matutino',
        notes: 'Test shift'
      };

      return request(app)
        .post('/api/shifts')
        .send(shiftData)
        .expect(201)
        .then(response => {
          expect(response.body).toHaveProperty('status', 'active');
          expect(response.body.shiftType).toBe('matutino');
        });
    });
  });
});