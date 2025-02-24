import session from "express-session";
import createMemoryStore from "memorystore";
import { User, Client, Inventory, Reservation, Bill, InsertUser, InsertClient, InsertInventory, InsertReservation, InsertBill } from "@shared/schema";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Clients
  getClients(): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client>;
  deleteClient(id: number): Promise<void>;

  // Inventory
  getInventory(): Promise<Inventory[]>;
  getInventoryItem(id: number): Promise<Inventory | undefined>;
  createInventoryItem(item: InsertInventory): Promise<Inventory>;
  updateInventoryItem(id: number, item: Partial<InsertInventory>): Promise<Inventory>;
  deleteInventoryItem(id: number): Promise<void>;

  // Reservations
  getReservations(): Promise<Reservation[]>;
  getReservation(id: number): Promise<Reservation | undefined>;
  createReservation(reservation: InsertReservation): Promise<Reservation>;
  updateReservation(id: number, reservation: Partial<InsertReservation>): Promise<Reservation>;
  deleteReservation(id: number): Promise<void>;

  // Bills
  getBills(): Promise<Bill[]>;
  getBill(id: number): Promise<Bill | undefined>;
  createBill(bill: InsertBill): Promise<Bill>;
  updateBill(id: number, bill: Partial<InsertBill>): Promise<Bill>;
  deleteBill(id: number): Promise<void>;

  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private clients: Map<number, Client>;
  private inventory: Map<number, Inventory>;
  private reservations: Map<number, Reservation>;
  private bills: Map<number, Bill>;
  private currentId: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.clients = new Map();
    this.inventory = new Map();
    this.reservations = new Map();
    this.bills = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Client methods
  async getClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }

  async getClient(id: number): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async createClient(client: InsertClient): Promise<Client> {
    const id = this.currentId++;
    const newClient = { ...client, id };
    this.clients.set(id, newClient);
    return newClient;
  }

  async updateClient(id: number, client: Partial<InsertClient>): Promise<Client> {
    const existing = await this.getClient(id);
    if (!existing) throw new Error("Client not found");
    const updated = { ...existing, ...client };
    this.clients.set(id, updated);
    return updated;
  }

  async deleteClient(id: number): Promise<void> {
    this.clients.delete(id);
  }

  // Inventory methods
  async getInventory(): Promise<Inventory[]> {
    return Array.from(this.inventory.values());
  }

  async getInventoryItem(id: number): Promise<Inventory | undefined> {
    return this.inventory.get(id);
  }

  async createInventoryItem(item: InsertInventory): Promise<Inventory> {
    const id = this.currentId++;
    const newItem = { ...item, id };
    this.inventory.set(id, newItem);
    return newItem;
  }

  async updateInventoryItem(id: number, item: Partial<InsertInventory>): Promise<Inventory> {
    const existing = await this.getInventoryItem(id);
    if (!existing) throw new Error("Inventory item not found");
    const updated = { ...existing, ...item };
    this.inventory.set(id, updated);
    return updated;
  }

  async deleteInventoryItem(id: number): Promise<void> {
    this.inventory.delete(id);
  }

  // Reservation methods
  async getReservations(): Promise<Reservation[]> {
    return Array.from(this.reservations.values());
  }

  async getReservation(id: number): Promise<Reservation | undefined> {
    return this.reservations.get(id);
  }

  async createReservation(reservation: InsertReservation): Promise<Reservation> {
    const id = this.currentId++;
    const newReservation = { ...reservation, id };
    this.reservations.set(id, newReservation);
    return newReservation;
  }

  async updateReservation(id: number, reservation: Partial<InsertReservation>): Promise<Reservation> {
    const existing = await this.getReservation(id);
    if (!existing) throw new Error("Reservation not found");
    const updated = { ...existing, ...reservation };
    this.reservations.set(id, updated);
    return updated;
  }

  async deleteReservation(id: number): Promise<void> {
    this.reservations.delete(id);
  }

  // Bill methods
  async getBills(): Promise<Bill[]> {
    return Array.from(this.bills.values());
  }

  async getBill(id: number): Promise<Bill | undefined> {
    return this.bills.get(id);
  }

  async createBill(bill: InsertBill): Promise<Bill> {
    const id = this.currentId++;
    const newBill = { ...bill, id };
    this.bills.set(id, newBill);
    return newBill;
  }

  async updateBill(id: number, bill: Partial<InsertBill>): Promise<Bill> {
    const existing = await this.getBill(id);
    if (!existing) throw new Error("Bill not found");
    const updated = { ...existing, ...bill };
    this.bills.set(id, updated);
    return updated;
  }

  async deleteBill(id: number): Promise<void> {
    this.bills.delete(id);
  }
}

export const storage = new MemStorage();
