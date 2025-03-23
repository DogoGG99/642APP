const { describe, it, expect } = require('@jest/globals');
const request = require('supertest');
const express = require('express');

// Test suite simple para autenticación
describe('Authentication Tests', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Configurar rutas sin passport
    app.post('/api/login', async (req, res) => {
      if (!req.body?.username || !req.body?.password) {
        return res.status(400).json({ message: "Credenciales inválidas" });
      }

      try {
        const user = await global.__mocks__.storage.getUserByUsername(req.body.username);
        if (!user) {
          return res.status(401).json({ message: "Credenciales inválidas" });
        }

        const isValid = await global.__mocks__.bcrypt.compare(req.body.password, user.password);
        if (!isValid) {
          return res.status(401).json({ message: "Credenciales inválidas" });
        }

        return res.status(200).json({
          id: user.id,
          username: user.username,
          role: user.role
        });
      } catch (error) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }
    });
  });

  // Test básico para credenciales faltantes
  it('should return 400 when credentials are missing', () => {
    return request(app)
      .post('/api/login')
      .send({})
      .expect(400);
  });

  // Test básico para login exitoso
  it('should return 200 when login is successful', () => {
    return request(app)
      .post('/api/login')
      .send({
        username: 'test',
        password: 'password'
      })
      .expect(200)
      .then(response => {
        expect(response.body.username).toBe('test');
      });
  });
});