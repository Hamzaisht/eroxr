
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles, Zap } from "lucide-react";

export const FeaturedContent = () => {
  const { data: featuredContent } = useQuery({
    queryKey: ["featured-content"],
    queryFn: async () => {
      const { data: topCreators } = await supabase
        .from('profiles_with_stats')
        .select('*')
        .order('subscriber_count', { ascending: false })
        .limit(5);

      const { data: latestNews } = await supabase
        .from('posts')
        .select('*, creator:profiles(username, avatar_url)')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(3);

      return { topCreators, latestNews };
    }
  });

  return (
    <ScrollArea className="h-[400px] w-full pr-4">
      <div className="space-y-6">
        {/* Top Performers Section */}
        <div>
          <h3 className="text-white/90 font-semibold flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-luxury-primary" />
            Top 1% Performers
          </h3>
          <div className="space-y-3">
            {featuredContent?.topCreators?.map((creator) => (
              <div key={creator.id} className="flex items-center justify-between bg-black/20 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={creator.avatar_url || ""} />
                    <AvatarFallback>{creator.username?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-white">{creator.username}</p>
                    <p className="text-xs text-white/60">{creator.subscriber_count} subscribers</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-luxury-primary hover:text-luxury-primary/80">
                  Follow
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Featured News Section */}
        <div>
          <h3 className="text-white/90 font-semibold flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-luxury-primary" />
            Latest Updates
          </h3>
          <div className="space-y-4">
            {featuredContent?.latestNews?.map((post) => (
              <div key={post.id} className="bg-black/20 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={post.creator?.avatar_url || ""} />
                    <AvatarFallback>{post.creator?.username?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm text-white/80">{post.creator?.username}</p>
                    <p className="text-white mt-1">{post.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};
