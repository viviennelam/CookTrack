import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRecipeSchema } from "@shared/schema";
import multer from "multer";
import { setupAuth } from "./auth";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes and middleware
  setupAuth(app);

  // Recipes
  app.get("/api/recipes", async (req, res) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const recipes = await storage.getRecipes(limit, offset);
    res.json(recipes);
  });

  app.post("/api/recipes", upload.single("image"), async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const recipeData = {
        userId: req.user!.id,
        title: req.body.title,
        ingredients: JSON.parse(req.body.ingredients),
        instructions: JSON.parse(req.body.instructions),
        imageData: req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : undefined
      };

      const recipe = await storage.createRecipe(recipeData);
      res.json(recipe);
    } catch (error) {
      console.error(error);
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