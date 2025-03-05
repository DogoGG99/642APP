import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default('user'),
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
  price: text("price").notNull(),
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
  amount: text("amount").notNull(),
  status: text("status").notNull(),
  date: timestamp("date", { mode: 'string' }).notNull(),
});

export const shifts = pgTable("shifts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  startTime: timestamp("start_time", { mode: 'string' }).notNull(),
  endTime: timestamp("end_time", { mode: 'string' }),
  status: text("status").notNull().default('active'),
  shiftType: text("shift_type").notNull(), 
  notes: text("notes"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertClientSchema = createInsertSchema(clients);

export const insertInventorySchema = createInsertSchema(inventory).extend({
  quantity: z.coerce.number(),
  price: z.coerce.number().transform(val => val.toString())
});

export const insertReservationSchema = createInsertSchema(reservations).extend({
  clientId: z.coerce.number(),
  date: z.string().transform(val => new Date(val).toISOString())
});

export const insertBillSchema = createInsertSchema(bills).extend({
  clientId: z.coerce.number(),
  amount: z.coerce.number().transform(val => val.toString()),
  date: z.string().transform(val => new Date(val).toISOString())
});

export const insertShiftSchema = createInsertSchema(shifts).extend({
  userId: z.coerce.number(),
  startTime: z.string().transform(val => new Date(val).toISOString()),
  shiftType: z.enum(['matutino', 'vespertino']), 
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type InsertInventory = z.infer<typeof insertInventorySchema>;
export type InsertReservation = z.infer<typeof insertReservationSchema>;
export type InsertBill = z.infer<typeof insertBillSchema>;
export type InsertShift = z.infer<typeof insertShiftSchema>;

export type User = typeof users.$inferSelect;
export type Client = typeof clients.$inferSelect;
export type Inventory = typeof inventory.$inferSelect;
export type Reservation = typeof reservations.$inferSelect;
export type Bill = typeof bills.$inferSelect;
export type Shift = typeof shifts.$inferSelect;