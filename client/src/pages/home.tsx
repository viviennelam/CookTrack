import RecipeFeed from "@/components/recipe-feed";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { LogIn } from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h1 className="text-3xl font-bold text-center">Welcome to CookShare</h1>
        <p className="text-muted-foreground text-center max-w-md">
          Join our community to share your recipes and discover amazing dishes from other food enthusiasts.
        </p>
        <Button asChild>
          <Link href="/auth">
            <a className="flex items-center space-x-2">
              <LogIn className="h-4 w-4" />
              <span>Login or Register</span>
            </a>
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <RecipeFeed />
    </div>
  );
}