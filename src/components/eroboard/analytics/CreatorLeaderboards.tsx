import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Crown, 
  Star,
  TrendingUp,
  Play,
  Image as ImageIcon,
  FileText,
  Zap,
  Award,
  Medal
} from "lucide-react";
import { TimeFrame } from "./TimeframeFilter";

interface CreatorLeaderboardsProps {
  data: any;
  timeframe: TimeFrame;
  isLoading: boolean;
}

export const CreatorLeaderboards = ({ data, timeframe, isLoading }: CreatorLeaderboardsProps) => {
  if (isLoading) {
    return (
      <Card className="bg-card/80 backdrop-blur-xl border-border/50">
        <CardHeader>
          <div className="h-8 bg-muted/50 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 10 }).map((_, i) => (
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

  // Generate leaderboard data (simulated global rankings)
  const generateCreatorLeaderboard = (category: string) => {
    const baseData = [
      { name: "ScandalousSwede", avatar: "🇸🇪", specialty: "Videos" },
      { name: "NordicNoir", avatar: "🇳🇴", specialty: "Photos" },
      { name: "DanishDelight", avatar: "🇩🇰", specialty: "Stories" },
      { name: "FinnishFantasy", avatar: "🇫🇮", specialty: "Streams" },
      { name: "VikingnVixen", avatar: "⚡", specialty: "Mixed" },
      { name: "StockholmSiren", avatar: "🌟", specialty: "Videos" },
      { name: "OsloOnyx", avatar: "💎", specialty: "Photos" },
      { name: "CopenhagenCrush", avatar: "🔥", specialty: "Stories" },
      { name: "HelsinkiHeart", avatar: "❤️", specialty: "Streams" },
      { name: "ArcticAngel", avatar: "❄️", specialty: "Mixed" }
    ];

    return baseData.map((creator, index) => {
      const isCurrentUser = index === 4; // Simulate current user at position 5
      let value;
      
      switch (category) {
        case 'earnings':
          value = Math.floor(Math.random() * 50000) + 10000;
          break;
        case 'streaming':
          value = Math.floor(Math.random() * 500) + 50; // hours
          break;
        case 'engagement':
          value = Math.floor(Math.random() * 95) + 5; // percentage
          break;
        case 'content':
          value = Math.floor(Math.random() * 1000) + 100; // posts
          break;
        default:
          value = Math.floor(Math.random() * 10000);
      }

      return {
        ...creator,
        value,
        rank: index + 1,
        isCurrentUser,
        change: Math.floor(Math.random() * 10) - 5, // -5 to +5 position change
        growth: Math.floor(Math.random() * 30) - 10 // -10% to +20% growth
      };
    }).sort((a, b) => b.value - a.value).map((creator, index) => ({
      ...creator,
      rank: index + 1
    }));
  };

  const earningsLeaderboard = generateCreatorLeaderboard('earnings');
  const streamingLeaderboard = generateCreatorLeaderboard('streaming');
  const engagementLeaderboard = generateCreatorLeaderboard('engagement');
  const contentLeaderboard = generateCreatorLeaderboard('content');

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black';
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-500 text-black';
      case 3: return 'bg-gradient-to-r from-amber-600 to-amber-800 text-white';
      default: return 'bg-gradient-to-r from-slate-600 to-slate-800 text-white';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return Trophy;
      case 2: return Medal;
      case 3: return Award;
      default: return Star;
    }
  };

  const formatValue = (value: number, category: string) => {
    switch (category) {
      case 'earnings':
        return `$${value.toLocaleString()}`;
      case 'streaming':
        return `${value}h`;
      case 'engagement':
        return `${value}%`;
      case 'content':
        return `${value} posts`;
      default:
        return value.toString();
    }
  };

  const LeaderboardList = ({ leaderboard, category, title, icon: Icon, color }: any) => (
    <Card className="bg-card/80 backdrop-blur-xl border-border/50">
      <CardHeader>
        <CardTitle className={`flex items-center gap-3 ${color}`}>
          <Icon className="h-6 w-6" />
          {title}
          <Badge className="bg-primary/20 text-primary border-primary/30 ml-auto">
            {timeframe} Period
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leaderboard.slice(0, 10).map((creator: any, index: number) => {
            const RankIcon = getRankIcon(creator.rank);
            return (
              <div
                key={creator.name}
                className={`group relative overflow-hidden rounded-2xl p-4 transition-all duration-500 hover:scale-[1.02] ${
                  creator.isCurrentUser 
                    ? 'bg-primary/20 border-2 border-primary/50 shadow-lg shadow-primary/20' 
                    : 'bg-card/50 backdrop-blur-sm border border-border/30 hover:border-primary/30'
                }`}
              >
                {creator.isCurrentUser && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-primary text-primary-foreground">
                      You
                    </Badge>
                  </div>
                )}
                
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${getRankColor(creator.rank)}`}>
                      {creator.rank}
                    </div>
                    {creator.rank <= 3 && (
                      <div className="absolute -top-1 -right-1">
                        <RankIcon className="h-5 w-5 text-yellow-400" />
                      </div>
                    )}
                  </div>

                  {/* Avatar and Info */}
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="h-12 w-12 border-2 border-primary/30">
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-lg">
                        {creator.avatar}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-semibold transition-colors ${
                          creator.isCurrentUser ? 'text-primary' : 'text-foreground group-hover:text-primary'
                        }`}>
                          {creator.name}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {creator.specialty}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {creator.change !== 0 && (
                          <Badge className={`text-xs ${
                            creator.change > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {creator.change > 0 ? '↑' : '↓'} {Math.abs(creator.change)}
                          </Badge>
                        )}
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {creator.growth > 0 ? '+' : ''}{creator.growth}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Value */}
                  <div className="text-right">
                    <p className={`text-xl font-bold transition-colors ${
                      creator.isCurrentUser ? 'text-primary' : 'text-foreground group-hover:text-primary'
                    }`}>
                      {formatValue(creator.value, category)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Rank #{creator.rank}
                    </p>
                  </div>
                </div>

                {/* Performance Bar */}
                <div className="mt-3 w-full h-2 bg-border rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      creator.isCurrentUser 
                        ? 'bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/50' 
                        : 'bg-gradient-to-r from-muted-foreground to-primary/50'
                    }`}
                    style={{ width: `${Math.min(100, (creator.value / leaderboard[0].value) * 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-primary/10 via-accent/5 to-primary/15 border border-primary/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Trophy className="h-8 w-8 text-primary animate-pulse" />
            Creator Leaderboards
            <Badge className="bg-primary/20 text-primary border-primary/30 ml-auto">
              Global Rankings
            </Badge>
          </CardTitle>
          <p className="text-muted-foreground">
            See how you rank against other creators across different categories
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="earnings" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto bg-card/50 backdrop-blur-sm">
          <TabsTrigger value="earnings" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            <span className="hidden sm:inline">Earnings</span>
          </TabsTrigger>
          <TabsTrigger value="streaming" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            <span className="hidden sm:inline">Streaming</span>
          </TabsTrigger>
          <TabsTrigger value="engagement" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Engagement</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            <span className="hidden sm:inline">Content</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="earnings" className="mt-6">
          <LeaderboardList 
            leaderboard={earningsLeaderboard}
            category="earnings"
            title="Top Earners"
            icon={Crown}
            color="text-emerald-400"
          />
        </TabsContent>

        <TabsContent value="streaming" className="mt-6">
          <LeaderboardList 
            leaderboard={streamingLeaderboard}
            category="streaming"
            title="Most Stream Time"
            icon={Play}
            color="text-red-400"
          />
        </TabsContent>

        <TabsContent value="engagement" className="mt-6">
          <LeaderboardList 
            leaderboard={engagementLeaderboard}
            category="engagement"
            title="Highest Engagement"
            icon={Zap}
            color="text-purple-400"
          />
        </TabsContent>

        <TabsContent value="content" className="mt-6">
          <LeaderboardList 
            leaderboard={contentLeaderboard}
            category="content"
            title="Most Content Created"
            icon={Star}
            color="text-blue-400"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};