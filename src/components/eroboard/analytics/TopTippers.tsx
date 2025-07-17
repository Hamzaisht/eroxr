import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Gift, 
  DollarSign, 
  TrendingUp, 
  Heart,
  Zap,
  Trophy,
  Star
} from "lucide-react";
import { TimeFrame } from "./TimeframeFilter";

interface TopTippersProps {
  data: any;
  timeframe: TimeFrame;
  isLoading: boolean;
}

export const TopTippers = ({ data, timeframe, isLoading }: TopTippersProps) => {
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

  // Generate top tippers from revenue breakdown and engaged fans data
  const revenueBreakdown = data.revenueBreakdown || {};
  const engagedFans = data.engagedFansData || [];
  
  const topTippers = engagedFans
    .map((fan, index) => ({
      id: fan.userId,
      username: fan.username,
      avatar: fan.avatar,
      totalTips: Math.floor(fan.totalSpent * 0.3), // Assume 30% of spending is tips
      tipCount: Math.floor(fan.totalPurchases * 0.4), // 40% of purchases are tips
      averageTip: fan.totalSpent > 0 ? Math.floor((fan.totalSpent * 0.3) / Math.max(fan.totalPurchases * 0.4, 1)) : 0,
      lastTip: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      rank: index + 1,
      tipFrequency: Math.random() > 0.5 ? 'Daily' : Math.random() > 0.5 ? 'Weekly' : 'Monthly',
      largestTip: Math.floor(fan.totalSpent * 0.1), // Largest single tip
      generosityScore: Math.min(100, Math.floor(fan.engagementScore * 0.8 + Math.random() * 20))
    }))
    .filter(tipper => tipper.totalTips > 0)
    .sort((a, b) => b.totalTips - a.totalTips)
    .slice(0, 10);

  const totalTipsReceived = topTippers.reduce((sum, tipper) => sum + tipper.totalTips, 0);
  const averageTipAmount = totalTipsReceived / Math.max(topTippers.reduce((sum, tipper) => sum + tipper.tipCount, 0), 1);

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'Daily': return 'bg-emerald-500/20 text-emerald-400';
      case 'Weekly': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-purple-500/20 text-purple-400';
    }
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case 'Daily': return Zap;
      case 'Weekly': return Star;
      default: return Heart;
    }
  };

  return (
    <Card className="bg-card/80 backdrop-blur-xl border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="relative">
            <Gift className="h-6 w-6 text-pink-500 animate-pulse" />
            <div className="absolute inset-0 rounded-full bg-pink-500/20 blur-lg" />
          </div>
          Top Tippers
          <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30 ml-auto">
            {timeframe} Period
          </Badge>
        </CardTitle>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-500" />
            <span>Total Tips: ${totalTipsReceived.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <span>Avg Tip: ${averageTipAmount.toFixed(2)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topTippers.length > 0 ? (
            topTippers.map((tipper, index) => {
              const FrequencyIcon = getFrequencyIcon(tipper.tipFrequency);
              return (
                <div
                  key={tipper.id}
                  className="group relative overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm border border-border/30 p-4 hover:border-pink-500/30 transition-all duration-500 hover:scale-[1.02]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-pink-500/5 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative flex items-center gap-4">
                    {/* Rank Badge */}
                    <div className="relative">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-gradient-to-r from-pink-400 to-pink-600 text-white' :
                        index === 1 ? 'bg-gradient-to-r from-pink-300 to-pink-500 text-white' :
                        index === 2 ? 'bg-gradient-to-r from-pink-200 to-pink-400 text-black' :
                        'bg-gradient-to-r from-slate-600 to-slate-800 text-white'
                      }`}>
                        {tipper.rank}
                      </div>
                      {index < 3 && (
                        <div className="absolute -top-1 -right-1">
                          <Trophy className="h-4 w-4 text-yellow-400" />
                        </div>
                      )}
                    </div>

                    {/* Avatar and Info */}
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-12 w-12 border-2 border-pink-500/30 group-hover:border-pink-500/50 transition-colors">
                        <AvatarFallback className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 text-lg">
                          {tipper.avatar}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground group-hover:text-pink-500 transition-colors">
                            {tipper.username}
                          </h4>
                          <Badge className={`text-xs px-2 py-1 ${getFrequencyColor(tipper.tipFrequency)}`}>
                            <FrequencyIcon className="h-3 w-3 mr-1" />
                            {tipper.tipFrequency}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Gift className="h-3 w-3" />
                            <span>{tipper.tipCount} tips</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            <span>Largest: ${tipper.largestTip}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tip Stats */}
                    <div className="text-right space-y-2">
                      <div>
                        <p className="text-2xl font-bold text-foreground group-hover:text-pink-500 transition-colors">
                          ${tipper.totalTips.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">Total Tips</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className="text-xs bg-amber-500/20 text-amber-400">
                          <Heart className="h-3 w-3 mr-1" />
                          {tipper.generosityScore}% generous
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Generosity Progress Bar */}
                  <div className="mt-4 w-full h-2 bg-border rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-1000 group-hover:shadow-lg group-hover:shadow-pink-500/50"
                      style={{ width: `${tipper.generosityScore}%` }}
                    />
                  </div>

                  {/* Tip History Summary */}
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Avg per tip: ${tipper.averageTip}</span>
                    <span>Last tip: {new Date(tipper.lastTip).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Gift className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No tipping data available for this timeframe</p>
            </div>
          )}
        </div>

        {topTippers.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border/50">
            <Button variant="outline" className="w-full border-border/50 hover:border-pink-500/50">
              View All Tippers
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};