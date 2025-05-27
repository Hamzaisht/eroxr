
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Heart, MessageCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const TrendingContent = () => {
  const { data: trendingPosts, isLoading } = useQuery({
    queryKey: ['trending-posts'],
    queryFn: async () => {
      // Get trending posts by joining trending_content with posts and profiles
      const { data, error } = await supabase
        .from('trending_content')
        .select(`
          score,
          likes,
          comments,
          bookmarks,
          screenshots,
          posts!inner (
            id,
            content,
            created_at,
            likes_count,
            comments_count,
            creator_id,
            profiles!posts_creator_id_fkey (
              id, 
              username
            )
          )
        `)
        .order('score', { ascending: false })
        .limit(5);
      
      if (error) {
        console.error("Error fetching trending posts:", error);
        throw error;
      }
      
      // Transform the data to match the expected structure
      return data?.map(item => {
        const post = item.posts;
        const creator = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles;
        
        return {
          id: post.id,
          content: post.content,
          created_at: post.created_at,
          likes_count: post.likes_count,
          comments_count: post.comments_count,
          creator_id: post.creator_id,
          creator: creator,
          trending_score: item.score,
          trending_metrics: {
            likes: item.likes,
            comments: item.comments,
            bookmarks: item.bookmarks,
            screenshots: item.screenshots
          }
        };
      }) || [];
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trending Now
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Trending Now
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {trendingPosts?.slice(0, 5).map((post: any, index: number) => {
          const creator = post.creator || { username: "Unknown" };
          
          return (
            <div key={post.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="text-sm font-bold text-luxury-primary min-w-[20px]">
                #{index + 1}
              </div>
              
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt={creator.username} />
                <AvatarFallback className="text-xs">
                  {creator.username?.slice(0, 2).toUpperCase() || "UN"}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm truncate">
                    {creator.username}
                  </span>
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    Score: {Math.round(post.trending_score || 0)}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {post.content}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    <span>{post.likes_count || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    <span>{post.comments_count || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {(!trendingPosts || trendingPosts.length === 0) && (
          <div className="text-center py-6 text-gray-500">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No trending posts yet</p>
            <p className="text-xs mt-1">Start creating content to see trends!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
