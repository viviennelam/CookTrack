import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRecipeSchema, insertUserSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Users
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    const user = await storage.getUser(parseInt(req.params.id));
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  });

  // Recipes
  app.get("/api/recipes", async (req, res) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const recipes = await storage.getRecipes(limit, offset);
    res.json(recipes);
  });

  app.post("/api/recipes", async (req, res) => {
    try {
      const recipeData = insertRecipeSchema.parse(req.body);
      const recipe = await storage.createRecipe(recipeData);
      res.json(recipe);
    } catch (error) {
      res.status(400).json({ error: "Invalid recipe data" });
    }
  });

  app.get("/api/users/:userId/recipes", async (req, res) => {
    const recipes = await storage.getRecipesByUser(parseInt(req.params.userId));
    res.json(recipes);
  });

  // Achievements
  app.get("/api/users/:userId/achievements", async (req, res) => {
    const achievements = await storage.getAchievements(parseInt(req.params.userId));
    res.json(achievements);
  });

  const httpServer = createServer(app);
  return httpServer;
}
