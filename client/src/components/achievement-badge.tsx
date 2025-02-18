import { type Achievement } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface AchievementBadgeProps {
  achievement: Achievement;
}

export default function AchievementBadge({ achievement }: AchievementBadgeProps) {
  return (
    <Card className={cn(
      "transition-all duration-300",
      achievement.earned ? "bg-primary/10" : "opacity-50"
    )}>
      <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
        <Trophy className={cn(
          "w-8 h-8",
          achievement.earned ? "text-primary" : "text-muted-foreground"
        )} />
        <div className="font-semibold">{achievement.type}</div>
        {achievement.earnedAt && (
          <div className="text-sm text-muted-foreground">
            Earned {new Date(achievement.earnedAt).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
