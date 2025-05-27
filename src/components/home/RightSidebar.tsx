
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const RightSidebar = () => {
  const { data: trendingCreators } = useQuery({
    queryKey: ['trending-creators'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, bio')
        .eq('is_paying_customer', true)
        .limit(5);
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: trendingHashtags } = useQuery({
    queryKey: ['trending-hashtags'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .rpc('get_top_trending_hashtags');
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching trending hashtags:', error);
        return [];
      }
    }
  });

  return (
    <div className="space-y-6 sticky top-20">
      {/* Trending Hashtags */}
      <Card className="bg-luxury-darker border-luxury-neutral/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-luxury-primary" />
            Trending
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {trendingHashtags?.slice(0, 5).map((hashtag: any, index: number) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">#{hashtag.tag}</p>
                <p className="text-gray-400 text-sm">{hashtag.count} posts</p>
              </div>
              <Badge variant="secondary" className="bg-luxury-primary/20 text-luxury-primary">
                +{hashtag.percentageincrease}%
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Popular Creators */}
      <Card className="bg-luxury-darker border-luxury-neutral/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-luxury-primary" />
            Popular Creators
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {trendingCreators?.map((creator) => (
            <div key={creator.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {creator.username?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white font-medium">{creator.username}</p>
                  <p className="text-gray-400 text-sm truncate max-w-24">
                    {creator.bio || "Creator"}
                  </p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="border-luxury-primary text-luxury-primary hover:bg-luxury-primary hover:text-white">
                Follow
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Activity Feed */}
      <Card className="bg-luxury-darker border-luxury-neutral/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Heart className="h-5 w-5 text-luxury-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-gray-400 text-sm">
            <p>Your posts have received 12 new likes today</p>
          </div>
          <div className="text-gray-400 text-sm">
            <p>3 new followers this week</p>
          </div>
          <div className="text-gray-400 text-sm">
            <p>You have 5 unread messages</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
