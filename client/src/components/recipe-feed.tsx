import { useQuery } from "@tanstack/react-query";
import RecipeCard from "./recipe-card";
import { type Recipe } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecipeFeed() {
  const { data: recipes, isLoading } = useQuery<Recipe[]>({
    queryKey: ["/api/recipes"],
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-full space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-[300px]" />
            <div className="flex space-x-4">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {recipes?.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
