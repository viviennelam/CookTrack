import { 
  type User, type InsertUser,
  type Recipe, type InsertRecipe,
  type Achievement, type InsertAchievement
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStreak(id: number, streak: number): Promise<User>;

  // Recipe operations
  getRecipes(limit: number, offset: number): Promise<Recipe[]>;
  getRecipesByUser(userId: number): Promise<Recipe[]>;
  createRecipe(recipe: InsertRecipe): Promise<Recipe>;

  // Achievement operations
  getAchievements(userId: number): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  updateAchievement(id: number, earned: boolean): Promise<Achievement>;

  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private recipes: Map<number, Recipe>;
  private achievements: Map<number, Achievement>;
  private currentIds: { users: number; recipes: number; achievements: number };
  public sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.recipes = new Map();
    this.achievements = new Map();
    this.currentIds = { users: 1, recipes: 1, achievements: 1 };
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const user: User = { 
      ...insertUser, 
      id, 
      streak: 0,
      totalRecipes: 0
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserStreak(id: number, streak: number): Promise<User> {
    const user = await this.getUser(id);
    if (!user) throw new Error("User not found");

    const updatedUser = { ...user, streak };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getRecipes(limit: number, offset: number): Promise<Recipe[]> {
    return Array.from(this.recipes.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit);
  }

  async getRecipesByUser(userId: number): Promise<Recipe[]> {
    return Array.from(this.recipes.values())
      .filter(recipe => recipe.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createRecipe(insertRecipe: InsertRecipe): Promise<Recipe> {
    const id = this.currentIds.recipes++;
    const recipe: Recipe = {
      ...insertRecipe,
      id,
      createdAt: new Date(),
      likes: 0,
      imageData: null // Add this line to fix the type error
    };
    this.recipes.set(id, recipe);
    return recipe;
  }

  async getAchievements(userId: number): Promise<Achievement[]> {
    return Array.from(this.achievements.values())
      .filter(achievement => achievement.userId === userId);
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const id = this.currentIds.achievements++;
    const achievement: Achievement = {
      ...insertAchievement,
      id,
      earned: false,
      earnedAt: null
    };
    this.achievements.set(id, achievement);
    return achievement;
  }

  async updateAchievement(id: number, earned: boolean): Promise<Achievement> {
    const achievement = this.achievements.get(id);
    if (!achievement) throw new Error("Achievement not found");

    const updatedAchievement: Achievement = {
      ...achievement,
      earned,
      earnedAt: earned ? new Date() : null
    };
    this.achievements.set(id, updatedAchievement);
    return updatedAchievement;
  }
}

export const storage = new MemStorage();