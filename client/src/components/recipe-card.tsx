import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2 } from "lucide-react";
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
      <CardContent className="p-0">
        {recipe.imageUrl && (
          <div className="aspect-square relative">
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}
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
