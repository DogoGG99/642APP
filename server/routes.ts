import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertClientSchema, insertInventorySchema, insertReservationSchema, insertBillSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Middleware to check if user is authenticated
  const requireAuth = (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    if (!req.isAuthenticated()) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    next();
  };

  // Client routes
  app.get("/api/clients", requireAuth, async (_req, res) => {
    const clients = await storage.getClients();
    res.json(clients);
  });

  app.post("/api/clients", requireAuth, async (req, res) => {
    const parsed = insertClientSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Invalid client data" });
      return;
    }
    const client = await storage.createClient(parsed.data);
    res.status(201).json(client);
  });

  app.patch("/api/clients/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    const client = await storage.updateClient(id, req.body);
    res.json(client);
  });

  app.delete("/api/clients/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteClient(id);
    res.sendStatus(204);
  });

  // Inventory routes
  app.get("/api/inventory", requireAuth, async (_req, res) => {
    const inventory = await storage.getInventory();
    res.json(inventory);
  });

  app.post("/api/inventory", requireAuth, async (req, res) => {
    const parsed = insertInventorySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Invalid inventory data" });
      return;
    }
    const item = await storage.createInventoryItem(parsed.data);
    res.status(201).json(item);
  });

  app.patch("/api/inventory/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    const item = await storage.updateInventoryItem(id, req.body);
    res.json(item);
  });

  app.delete("/api/inventory/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteInventoryItem(id);
    res.sendStatus(204);
  });

  // Reservation routes
  app.get("/api/reservations", requireAuth, async (_req, res) => {
    const reservations = await storage.getReservations();
    res.json(reservations);
  });

  app.post("/api/reservations", requireAuth, async (req, res) => {
    const parsed = insertReservationSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Invalid reservation data" });
      return;
    }
    const reservation = await storage.createReservation(parsed.data);
    res.status(201).json(reservation);
  });

  app.patch("/api/reservations/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    const reservation = await storage.updateReservation(id, req.body);
    res.json(reservation);
  });

  app.delete("/api/reservations/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteReservation(id);
    res.sendStatus(204);
  });

  // Bill routes
  app.get("/api/bills", requireAuth, async (_req, res) => {
    const bills = await storage.getBills();
    res.json(bills);
  });

  app.post("/api/bills", requireAuth, async (req, res) => {
    const parsed = insertBillSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Invalid bill data" });
      return;
    }
    const bill = await storage.createBill(parsed.data);
    res.status(201).json(bill);
  });

  app.patch("/api/bills/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    const bill = await storage.updateBill(id, req.body);
    res.json(bill);
  });

  app.delete("/api/bills/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteBill(id);
    res.sendStatus(204);
  });

  const httpServer = createServer(app);
  return httpServer;
}
