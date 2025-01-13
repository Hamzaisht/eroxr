import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Post } from "@/integrations/supabase/types/post";
import { Story } from "@/integrations/supabase/types/story";

export const TempDemoContent = () => {
  const { data: posts } = useQuery({
    queryKey: ["recent-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          id,
          content,
          media_url,
          created_at,
          creator:profiles(id, username, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      
      return (data || []).map(post => ({
        ...post,
        creator: {
          id: post.creator?.id || null,
          username: post.creator?.username || null,
          avatar_url: post.creator?.avatar_url || null
        }
      })) as Post[];
    },
  });

  const { data: stories } = useQuery({
    queryKey: ["recent-stories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stories")
        .select(`
          id,
          media_url,
          creator:profiles(id, username, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      
      return (data || []).map(story => ({
        ...story,
        creator: {
          id: story.creator?.id || null,
          username: story.creator?.username || null,
          avatar_url: story.creator?.avatar_url || null
        }
      })) as Story[];
    },
  });

  if (!posts?.length && !stories?.length) return null;

  return (
    <div className="space-y-8">
      {/* Stories */}
      {stories && stories.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-primary">Latest Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stories.map((story) => (
              <Card key={story.id} className="overflow-hidden">
                <div className="aspect-[9/16] relative">
                  <img
                    src={story.media_url}
                    alt={`Story by ${story.creator.username}`}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <Avatar className="h-8 w-8 border-2 border-white">
                      <AvatarImage src={story.creator.avatar_url} />
                      <AvatarFallback>
                        {story.creator.username?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-white font-medium drop-shadow-lg">
                      {story.creator.username}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Posts */}
      {posts && posts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-primary">Latest Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {posts.map((post) => (
              <Link key={post.id} to={`/profile/${post.creator.username}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  {post.media_url && post.media_url[0] && (
                    <div className="aspect-video relative">
                      <img
                        src={post.media_url[0]}
                        alt={`Post by ${post.creator.username}`}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={post.creator.avatar_url} />
                        <AvatarFallback>
                          {post.creator.username?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{post.creator.username}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(post.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-muted-foreground line-clamp-2">{post.content}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
