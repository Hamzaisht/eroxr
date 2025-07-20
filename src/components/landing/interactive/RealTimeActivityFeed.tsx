import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { DollarSign, Heart, MessageCircle, UserPlus, Zap, TrendingUp } from "lucide-react";

interface Activity {
  id: string;
  type: "tip" | "like" | "comment" | "follow" | "live" | "milestone";
  user: string;
  creator?: string;
  amount?: number;
  message?: string;
  timestamp: Date;
  avatar: string;
}

const activityTypes = {
  tip: { icon: DollarSign, color: "text-accent", bg: "bg-accent/10" },
  like: { icon: Heart, color: "text-destructive", bg: "bg-destructive/10" },
  comment: { icon: MessageCircle, color: "text-primary", bg: "bg-primary/10" },
  follow: { icon: UserPlus, color: "text-secondary", bg: "bg-secondary/10" },
  live: { icon: Zap, color: "text-accent", bg: "bg-accent/10" },
  milestone: { icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
};

const generateActivity = (): Activity => {
  const types: Activity["type"][] = ["tip", "like", "comment", "follow", "live", "milestone"];
  const users = ["Alex", "Jordan", "Casey", "Taylor", "Morgan", "Riley", "Quinn", "Sage"];
  const creators = ["Maya", "Crystal", "Phoenix", "Aria", "Luna", "Nova", "Stella", "Iris"];
  
  const type = types[Math.floor(Math.random() * types.length)];
  const user = users[Math.floor(Math.random() * users.length)];
  const creator = creators[Math.floor(Math.random() * creators.length)];
  
  const activities = {
    tip: {
      message: `tipped ${creator} $${Math.floor(Math.random() * 500 + 50)}`,
      amount: Math.floor(Math.random() * 500 + 50),
      creator,
    },
    like: {
      message: `liked ${creator}'s latest post`,
      creator,
    },
    comment: {
      message: `commented on ${creator}'s live stream`,
      creator,
    },
    follow: {
      message: `started following ${creator}`,
      creator,
    },
    live: {
      message: `${creator} just went live!`,
      creator,
    },
    milestone: {
      message: `${creator} reached 10K followers!`,
      creator,
    },
  };

  return {
    id: Date.now().toString(),
    type,
    user,
    timestamp: new Date(),
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user}`,
    ...activities[type],
  };
};

export const RealTimeActivityFeed = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    // Initial activities
    const initialActivities = Array.from({ length: 5 }, () => generateActivity());
    setActivities(initialActivities);

    // Add new activities every 3-6 seconds
    const interval = setInterval(() => {
      const newActivity = generateActivity();
      setActivities(prev => [newActivity, ...prev.slice(0, 9)]); // Keep only 10 items
    }, Math.random() * 3000 + 3000);

    return () => clearInterval(interval);
  }, []);

  const formatTimeAgo = (timestamp: Date) => {
    const seconds = Math.floor((Date.now() - timestamp.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="fixed right-4 top-20 w-80 z-40">
      <div className="bg-background/95 backdrop-blur-xl border border-primary/20 rounded-xl p-4 shadow-2xl">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <h3 className="font-semibold text-foreground">Live Activity</h3>
        </div>
        
        <div className="space-y-3 max-h-96 overflow-hidden">
          <AnimatePresence mode="popLayout">
            {activities.map((activity) => {
              const ActivityIcon = activityTypes[activity.type].icon;
              
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: 20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: "auto" }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="relative">
                    <img
                      src={activity.avatar}
                      alt={activity.user}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${activityTypes[activity.type].bg}`}>
                      <ActivityIcon className={`w-2.5 h-2.5 ${activityTypes[activity.type].color}`} />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{activity.user}</span>
                      {" "}
                      <span className="text-muted-foreground">{activity.message}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatTimeAgo(activity.timestamp)}
                    </p>
                  </div>

                  {activity.amount && (
                    <div className="text-accent font-bold text-sm">
                      ${activity.amount}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};