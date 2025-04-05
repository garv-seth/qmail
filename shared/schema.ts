import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email"),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImage: text("profile_image"),
  replitId: text("replit_id").unique(), // For Replit auth
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  firstName: true,
  lastName: true,
  profileImage: true,
  replitId: true,
});

// Email provider connections
export const emailProviders = pgTable("email_providers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  provider: text("provider").notNull(), // e.g., "gmail", "outlook"
  credentials: jsonb("credentials").notNull(), // Encrypted credentials
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertEmailProviderSchema = createInsertSchema(emailProviders).pick({
  userId: true,
  provider: true,
  credentials: true,
  active: true,
});

// Email messages
export const emails = pgTable("emails", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  providerId: integer("provider_id").notNull().references(() => emailProviders.id),
  externalId: text("external_id").notNull(), // ID from email provider
  from: text("from").notNull(),
  to: text("to").notNull(),
  subject: text("subject"),
  body: text("body"),
  receivedAt: timestamp("received_at"),
  isRead: boolean("is_read").default(false),
  isFlagged: boolean("is_flagged").default(false),
  folder: text("folder").default("inbox"),
  aiAnalysis: jsonb("ai_analysis"), // AI-generated analysis and flags
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertEmailSchema = createInsertSchema(emails).pick({
  userId: true,
  providerId: true,
  externalId: true,
  from: true,
  to: true,
  subject: true,
  body: true,
  receivedAt: true,
  isRead: true,
  isFlagged: true,
  folder: true,
  aiAnalysis: true,
});

// Filter rules
export const filterRules = pgTable("filter_rules", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  conditions: jsonb("conditions").notNull(), // JSON with conditions like {field, operator, value}
  actions: jsonb("actions").notNull(), // Actions to perform when conditions match
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFilterRuleSchema = createInsertSchema(filterRules).pick({
  userId: true,
  name: true,
  conditions: true,
  actions: true,
  isActive: true,
});

// User settings
export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id).unique(),
  encryptionLevel: text("encryption_level").default("standard"), // standard, enhanced, maximum
  keyRotationDays: integer("key_rotation_days").default(30),
  useQuantumRng: boolean("use_quantum_rng").default(true),
  aiScanEnabled: boolean("ai_scan_enabled").default(true),
  aiUnsubscribeEnabled: boolean("ai_unsubscribe_enabled").default(true),
  theme: text("theme").default("system"), // light, dark, system
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).pick({
  userId: true,
  encryptionLevel: true,
  keyRotationDays: true,
  useQuantumRng: true,
  aiScanEnabled: true,
  aiUnsubscribeEnabled: true,
  theme: true,
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertEmailProvider = z.infer<typeof insertEmailProviderSchema>;
export type EmailProvider = typeof emailProviders.$inferSelect;

export type InsertEmail = z.infer<typeof insertEmailSchema>;
export type Email = typeof emails.$inferSelect;

export type InsertFilterRule = z.infer<typeof insertFilterRuleSchema>;
export type FilterRule = typeof filterRules.$inferSelect;

export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
export type UserSettings = typeof userSettings.$inferSelect;
