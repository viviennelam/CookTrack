import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { type User, type Recipe, type Achievement } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import RecipeCard from "@/components/recipe-card";
import AchievementBadge from "@/components/achievement-badge";
import { Trophy } from "lucide-react";

export default function Profile() {
  const { id } = useParams();
  
  const { data: user, isLoading: loadingUser } = useQuery<User>({
    queryKey: [`/api/users/${id}`],
  });

  const { data: recipes, isLoading: loadingRecipes } = useQuery<Recipe[]>({
    queryKey: [`/api/users/${id}/recipes`],
  });

  const { data: achievements, isLoading: loadingAchievements } = useQuery<Achievement[]>({
    queryKey: [`/api/users/${id}/achievements`],
  });

  if (loadingUser || loadingRecipes || loadingAchievements) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!user) return <div>User not found</div>;

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{user.username}</h1>
              <p className="text-muted-foreground">{user.totalRecipes} recipes shared</p>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-primary" />
              <span className="font-bold">{user.streak} day streak</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {achievements && achievements.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement) => (
              <AchievementBadge key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </div>
      )}

      {recipes && recipes.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Recipes</h2>
          <div className="space-y-4">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
