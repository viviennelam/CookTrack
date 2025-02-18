import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  streak: integer("streak").notNull().default(0),
  totalRecipes: integer("total_recipes").notNull().default(0),
});

export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  ingredients: text("ingredients").array().notNull(),
  instructions: text("instructions").array().notNull(),
  imageData: text("image_data"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  likes: integer("likes").notNull().default(0),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(),
  earned: boolean("earned").notNull().default(false),
  earnedAt: timestamp("earned_at"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertRecipeSchema = createInsertSchema(recipes)
  .pick({
    userId: true,
    title: true,
    ingredients: true,
    instructions: true,
  })
  .extend({
    image: z.any().optional(), 
  });

export const insertAchievementSchema = createInsertSchema(achievements).pick({
  userId: true,
  type: true,
});

export type User = typeof users.$inferSelect;
export type Recipe = typeof recipes.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertRecipe = z.infer<typeof insertRecipeSchema>;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;