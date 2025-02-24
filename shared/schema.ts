import { pgTable, text, serial, integer, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
});

export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});

export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull(),
  date: timestamp("date", { mode: 'string' }).notNull(),
  status: text("status").notNull(),
  notes: text("notes"),
});

export const bills = pgTable("bills", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull(),
  date: timestamp("date", { mode: 'string' }).notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertClientSchema = createInsertSchema(clients);

export const insertInventorySchema = createInsertSchema(inventory).extend({
  quantity: z.coerce.number(),
  price: z.coerce.number()
});

export const insertReservationSchema = createInsertSchema(reservations).extend({
  clientId: z.coerce.number(),
  date: z.string().transform(val => new Date(val).toISOString())
});

export const insertBillSchema = createInsertSchema(bills).extend({
  clientId: z.coerce.number(),
  amount: z.coerce.number(),
  date: z.string().transform(val => new Date(val).toISOString())
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type InsertInventory = z.infer<typeof insertInventorySchema>;
export type InsertReservation = z.infer<typeof insertReservationSchema>;
export type InsertBill = z.infer<typeof insertBillSchema>;

export type User = typeof users.$inferSelect;
export type Client = typeof clients.$inferSelect;
export type Inventory = typeof inventory.$inferSelect;
export type Reservation = typeof reservations.$inferSelect;
export type Bill = typeof bills.$inferSelect;