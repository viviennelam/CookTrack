import { Link, useLocation } from "wouter";
import { Home, PlusCircle, User, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function Navbar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/">
            <a className="mr-6 flex items-center space-x-2">
              <span className="hidden font-bold sm:inline-block">
                CookShare
              </span>
            </a>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex justify-center space-x-4">
            <Button
              variant={location === "/" ? "default" : "ghost"}
              size="icon"
              asChild
            >
              <Link href="/">
                <a><Home className="h-5 w-5" /></a>
              </Link>
            </Button>
            {user && (
              <Button
                variant={location === "/create" ? "default" : "ghost"}
                size="icon"
                asChild
              >
                <Link href="/create">
                  <a><PlusCircle className="h-5 w-5" /></a>
                </Link>
              </Button>
            )}
            {user ? (
              <>
                <Button
                  variant={location.startsWith("/profile") ? "default" : "ghost"}
                  size="icon"
                  asChild
                >
                  <Link href={`/profile/${user.id}`}>
                    <a><User className="h-5 w-5" /></a>
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => logoutMutation.mutate()}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Button
                variant={location === "/auth" ? "default" : "ghost"}
                size="icon"
                asChild
              >
                <Link href="/auth">
                  <a><LogIn className="h-5 w-5" /></a>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}