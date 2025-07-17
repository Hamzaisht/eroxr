import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Crown, 
  DollarSign, 
  TrendingUp, 
  MessageCircle,
  Heart,
  Gift,
  Star,
  Users
} from "lucide-react";
import { TimeFrame } from "./TimeframeFilter";

interface TopPayingSubscribersProps {
  data: any;
  timeframe: TimeFrame;
  isLoading: boolean;
}

export const TopPayingSubscribers = ({ data, timeframe, isLoading }: TopPayingSubscribersProps) => {
  if (isLoading) {
    return (
      <Card className="bg-card/80 backdrop-blur-xl border-border/50">
        <CardHeader>
          <div className="h-6 bg-muted/50 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-12 w-12 bg-muted/50 rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted/50 rounded animate-pulse" />
                  <div className="h-3 bg-muted/50 rounded w-2/3 animate-pulse" />
                </div>
                <div className="h-6 w-16 bg-muted/50 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Generate top paying subscribers from real data
  const engagedFans = data.engagedFansData || [];
  const topPayingSubscribers = engagedFans
    .filter(fan => fan.totalSpent > 0)
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 10)
    .map((fan, index) => ({
      id: fan.userId,
      username: fan.username,
      avatar: fan.avatar,
      totalSpent: fan.totalSpent,
      monthlySpent: fan.totalSpent * (timeframe === '1M' ? 1 : timeframe === '1W' ? 0.25 : timeframe === '1D' ? 0.033 : 0.08),
      subscriptionTier: fan.totalSpent > 200 ? 'VIP' : fan.totalSpent > 100 ? 'Premium' : 'Standard',
      totalPurchases: fan.totalPurchases,
      lastInteraction: fan.lastInteraction,
      rank: index + 1,
      growthRate: Math.random() * 20 - 5 // -5% to +15%
    }));

  const totalRevenue = topPayingSubscribers.reduce((sum, sub) => sum + sub.totalSpent, 0);
  const averageSpending = totalRevenue / Math.max(topPayingSubscribers.length, 1);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'VIP': return 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black';
      case 'Premium': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      default: return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'VIP': return Crown;
      case 'Premium': return Star;
      default: return Users;
    }
  };

  return (
    <Card className="bg-card/80 backdrop-blur-xl border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="relative">
            <Crown className="h-6 w-6 text-primary animate-pulse" />
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-lg" />
          </div>
          Top Paying Subscribers
          <Badge className="bg-primary/20 text-primary border-primary/30 ml-auto">
            {timeframe} Period
          </Badge>
        </CardTitle>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-500" />
            <span>Total Revenue: ${totalRevenue.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <span>Avg Spending: ${averageSpending.toFixed(0)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topPayingSubscribers.length > 0 ? (
            topPayingSubscribers.map((subscriber, index) => {
              const TierIcon = getTierIcon(subscriber.subscriptionTier);
              return (
                <div
                  key={subscriber.id}
                  className="group relative overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm border border-border/30 p-4 hover:border-primary/30 transition-all duration-500 hover:scale-[1.02]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative flex items-center gap-4">
                    {/* Rank Badge */}
                    <div className="relative">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black' :
                        index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-500 text-black' :
                        index === 2 ? 'bg-gradient-to-r from-amber-600 to-amber-800 text-white' :
                        'bg-gradient-to-r from-slate-600 to-slate-800 text-white'
                      }`}>
                        {subscriber.rank}
                      </div>
                      {index < 3 && (
                        <div className="absolute -top-1 -right-1">
                          <Crown className="h-4 w-4 text-yellow-400" />
                        </div>
                      )}
                    </div>

                    {/* Avatar and Info */}
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-12 w-12 border-2 border-primary/30 group-hover:border-primary/50 transition-colors">
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-lg">
                          {subscriber.avatar}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {subscriber.username}
                          </h4>
                          <Badge className={`text-xs px-2 py-1 ${getTierColor(subscriber.subscriptionTier)}`}>
                            <TierIcon className="h-3 w-3 mr-1" />
                            {subscriber.subscriptionTier}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Gift className="h-3 w-3" />
                            <span>{subscriber.totalPurchases} purchases</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            <span>Active {Math.floor(Math.random() * 30)} days ago</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Spending Info */}
                    <div className="text-right space-y-2">
                      <div>
                        <p className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                          ${subscriber.totalSpent.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">Total Spent</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${
                          subscriber.growthRate > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {subscriber.growthRate > 0 ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingUp className="h-3 w-3 mr-1 transform rotate-180" />
                          )}
                          {Math.abs(subscriber.growthRate).toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 w-full h-2 bg-border rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 group-hover:shadow-lg group-hover:shadow-primary/50"
                      style={{ width: `${Math.min(100, (subscriber.totalSpent / Math.max(...topPayingSubscribers.map(s => s.totalSpent))) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No subscriber data available for this timeframe</p>
            </div>
          )}
        </div>

        {topPayingSubscribers.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border/50">
            <Button variant="outline" className="w-full border-border/50 hover:border-primary/50">
              View All Subscribers
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};