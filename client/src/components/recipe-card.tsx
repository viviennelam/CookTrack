import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Recipe } from "@shared/schema";

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="p-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="font-semibold">{recipe.title}</div>
        </div>
      </CardHeader>
      <CardContent className="p-0 space-y-4">
        {recipe.imageUrl ? (
          <div className="aspect-square relative">
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="object-cover w-full h-full"
            />
          </div>
        ) : (
          <div className="aspect-square bg-muted flex items-center justify-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        <div className="px-4">
          <h3 className="font-semibold mb-2">Ingredients:</h3>
          <ul className="list-disc pl-5 space-y-1">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="text-sm text-muted-foreground">
                {ingredient}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between">
        <div className="flex space-x-4">
          <Button variant="ghost" size="icon">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          {recipe.likes} likes
        </div>
      </CardFooter>
    </Card>
  );
}