import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import passport from "passport";
import bcrypt from "bcrypt";
import express from "express";

// Middleware de autenticación simple
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Basic middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  setupAuth(app);

  // Login route with minimal error handling
  app.post("/api/login", (req, res) => {
    // Basic validation
    if (!req.body?.username || !req.body?.password) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    const { username, password } = req.body;

    storage.getUserByUsername(username)
      .then(user => {
        if (!user) {
          return res.status(401).json({ message: "Credenciales inválidas" });
        }

        return bcrypt.compare(password, user.password)
          .then(isValid => {
            if (!isValid) {
              return res.status(401).json({ message: "Credenciales inválidas" });
            }

            return res.status(200).json({
              id: user.id,
              username: user.username,
              role: user.role
            });
          });
      })
      .catch(() => res.status(401).json({ message: "Credenciales inválidas" }));
  });

  // Client routes
  app.get("/api/clients", requireAuth, async (_req, res) => {
    try {
      const clients = await storage.getClients();
      res.json(clients);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch clients" });
    }
  });

  app.post("/api/clients", requireAuth, async (req, res) => {
    try {
      const parsed = insertClientSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          message: "Invalid client data",
          errors: parsed.error.errors
        });
      }
      const client = await storage.createClient(parsed.data);
      res.status(201).json(client);
    } catch (err) {
      console.error("Error creating client:", err);
      res.status(500).json({ message: "Failed to create client" });
    }
  });

  app.patch("/api/clients/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const client = await storage.updateClient(id, req.body);
      res.json(client);
    } catch (err) {
      console.error("Error updating client:", err);
      res.status(500).json({ message: "Failed to update client" });
    }
  });

  app.delete("/api/clients/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteClient(id);
      res.sendStatus(204);
    } catch (err) {
      console.error("Error deleting client:", err);
      res.status(500).json({ message: "Failed to delete client" });
    }
  });

  // Inventory routes
  app.get("/api/inventory", requireAuth, async (_req, res) => {
    try {
      const inventory = await storage.getInventory();
      res.json(inventory);
    } catch (err) {
      console.error("Error fetching inventory:", err);
      res.status(500).json({ message: "Failed to fetch inventory" });
    }
  });

  app.post("/api/inventory", requireAuth, async (req, res) => {
    try {
      const parsed = insertInventorySchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          message: "Invalid inventory data",
          errors: parsed.error.errors
        });
      }
      const item = await storage.createInventoryItem(parsed.data);
      res.status(201).json(item);
    } catch (err) {
      console.error("Error creating inventory item:", err);
      res.status(500).json({ message: "Failed to create inventory item" });
    }
  });

  app.patch("/api/inventory/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.updateInventoryItem(id, req.body);
      res.json(item);
    } catch (err) {
      console.error("Error updating inventory item:", err);
      res.status(500).json({ message: "Failed to update inventory item" });
    }
  });

  app.delete("/api/inventory/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteInventoryItem(id);
      res.sendStatus(204);
    } catch (err) {
      console.error("Error deleting inventory item:", err);
      res.status(500).json({ message: "Failed to delete inventory item" });
    }
  });

  // Reservation routes
  app.get("/api/reservations", requireAuth, async (_req, res) => {
    try {
      const reservations = await storage.getReservations();
      res.json(reservations);
    } catch (err) {
      console.error("Error fetching reservations:", err);
      res.status(500).json({ message: "Failed to fetch reservations" });
    }
  });

  app.post("/api/reservations", requireAuth, async (req, res) => {
    try {
      const parsed = insertReservationSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          message: "Invalid reservation data",
          errors: parsed.error.errors
        });
      }
      const reservation = await storage.createReservation(parsed.data);
      res.status(201).json(reservation);
    } catch (err) {
      console.error("Error creating reservation:", err);
      res.status(500).json({ message: "Failed to create reservation" });
    }
  });

  app.patch("/api/reservations/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const reservation = await storage.updateReservation(id, req.body);
      res.json(reservation);
    } catch (err) {
      console.error("Error updating reservation:", err);
      res.status(500).json({ message: "Failed to update reservation" });
    }
  });

  app.delete("/api/reservations/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteReservation(id);
      res.sendStatus(204);
    } catch (err) {
      console.error("Error deleting reservation:", err);
      res.status(500).json({ message: "Failed to delete reservation" });
    }
  });

  // Bill routes
  app.get("/api/bills", requireAuth, async (_req, res) => {
    try {
      const bills = await storage.getBills();
      res.json(bills);
    } catch (err) {
      console.error("Error fetching bills:", err);
      res.status(500).json({ message: "Failed to fetch bills" });
    }
  });

  app.post("/api/bills", requireAuth, async (req, res) => {
    try {
      const parsed = insertBillSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          message: "Invalid bill data",
          errors: parsed.error.errors
        });
      }
      const bill = await storage.createBill(parsed.data);
      res.status(201).json(bill);
    } catch (err) {
      console.error("Error creating bill:", err);
      res.status(500).json({ message: "Failed to create bill" });
    }
  });

  app.patch("/api/bills/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const bill = await storage.updateBill(id, req.body);
      res.json(bill);
    } catch (err) {
      console.error("Error updating bill:", err);
      res.status(500).json({ message: "Failed to update bill" });
    }
  });

  app.delete("/api/bills/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteBill(id);
      res.sendStatus(204);
    } catch (err) {
      console.error("Error deleting bill:", err);
      res.status(500).json({ message: "Failed to delete bill" });
    }
  });

  // Shift routes
  app.get("/api/shifts/active", requireAuth, async (req, res) => {
    try {
      const activeShift = await storage.getActiveShift(req.user!.id);
      res.json(activeShift);
    } catch (err) {
      console.error("Error fetching active shift:", err);
      res.status(500).json({ message: "Error al obtener el turno activo" });
    }
  });

  app.post("/api/shifts", requireAuth, async (req, res) => {
    try {
      const parsed = insertShiftSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          message: "Datos de turno inválidos",
          errors: parsed.error.errors
        });
      }

      // Verificar si ya existe un turno activo
      const activeShift = await storage.getActiveShift(req.user!.id);
      if (activeShift) {
        return res.status(400).json({
          message: "Ya tienes un turno activo"
        });
      }

      const shift = await storage.createShift({
        ...parsed.data,
        userId: req.user!.id
      });
      res.status(201).json(shift);
    } catch (err) {
      console.error("Error creating shift:", err);
      res.status(500).json({ message: "Error al crear el turno" });
    }
  });

  // Endpoint para cerrar turno
  app.patch("/api/shifts/:id/close", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);

      // Verificar que el turno existe y pertenece al usuario
      const shift = await storage.getActiveShift(req.user!.id);
      if (!shift || shift.id !== id) {
        console.log("No se encontró el turno activo o no pertenece al usuario:", {
          shiftId: id,
          userId: req.user!.id
        });
        return res.status(404).json({ message: "Turno no encontrado" });
      }

      console.log("Cerrando turno:", { shiftId: id, currentStatus: shift.status });

      const updatedShift = await storage.updateShift(id, {
        endTime: new Date().toISOString(),
        status: 'closed'
      });

      console.log("Turno cerrado exitosamente:", {
        shiftId: id,
        newStatus: updatedShift.status
      });

      res.json(updatedShift);
    } catch (err) {
      console.error("Error closing shift:", err);
      res.status(500).json({ message: "Error al cerrar el turno" });
    }
  });


  // Error handler middleware
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Error in routes:", err);
    res.status(500).json({ message: "Error en el servidor" });
  });

  return createServer(app);
}