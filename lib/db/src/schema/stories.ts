import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const storiesTable = pgTable("stories", {
  id: serial("id").primaryKey(),
  coupleName: text("couple_name").notNull(),
  story: text("story").notNull(),
  photo: text("photo").notNull().default(""),
  marriageYear: integer("marriage_year").notNull(),
  city: text("city"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertStorySchema = createInsertSchema(storiesTable).omit({ id: true, createdAt: true });
export type InsertStory = z.infer<typeof insertStorySchema>;
export type Story = typeof storiesTable.$inferSelect;
