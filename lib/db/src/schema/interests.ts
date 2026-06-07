import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const interestsTable = pgTable("interests", {
  id: serial("id").primaryKey(),
  fromProfileId: integer("from_profile_id").notNull(),
  toProfileId: integer("to_profile_id").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertInterestSchema = createInsertSchema(interestsTable).omit({ id: true, status: true, createdAt: true });
export type InsertInterest = z.infer<typeof insertInterestSchema>;
export type Interest = typeof interestsTable.$inferSelect;
