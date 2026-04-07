import { pgTable, text, serial, timestamp, real, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const factChecksTable = pgTable("fact_checks", {
  id: serial("id").primaryKey(),
  query: text("query").notNull(),
  overallVerdict: text("overall_verdict").notNull(),
  credibilityScore: real("credibility_score").notNull(),
  summary: text("summary").notNull(),
  claims: jsonb("claims").notNull().default([]),
  sources: jsonb("sources").notNull().default([]),
  relatedArticles: jsonb("related_articles").notNull().default([]),
  analysisDetails: text("analysis_details"),
  checkedAt: timestamp("checked_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertFactCheckSchema = createInsertSchema(factChecksTable).omit({ id: true, checkedAt: true });
export type InsertFactCheck = z.infer<typeof insertFactCheckSchema>;
export type FactCheck = typeof factChecksTable.$inferSelect;
