import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toDbValue, extractCreator } from "@/utils/supabase/helpers";

export const TempDemoContent = () => {
  const [showMore, setShowMore] = useState(false);

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ["temp-demo-posts"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select(`
            id,
            content,
            media_url,
            created_at,
            creator:creator_id(id, username, avatar_url)
          `)
          .order("created_at", { ascending: false })
          .limit(3);

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching demo posts:", error);
        throw error;
      }
    },
  });

  const { data: stories } = useQuery({
    queryKey: ["temp-demo-stories"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("stories")
          .select(`
            id,
            media_url,
            creator:creator_id(id, username, avatar_url)
          `)
          .order("created_at", { ascending: false })
          .limit(5);

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching demo stories:", error);
        throw error;
      }
    },
  });

  return (
    <div className="space-y-8 p-4">
      <div>
        <h2 className="text-xl font-bold mb-4">Sample Posts</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error loading content: {(error as Error).message}</p>
        ) : posts && posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => {
              const postData = post && typeof post === 'object' ? post : null;
              const creatorData = postData && postData.creator && Array.isArray(postData.creator) && postData.creator.length > 0 ? postData.creator[0] : null;
              
              return postData ? (
                <Card key={postData.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar>
                        <AvatarImage src={creatorData?.avatar_url || ''} />
                        <AvatarFallback>{creatorData?.username?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{creatorData?.username || 'Unknown Creator'}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(postData.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="mb-3">{postData.content}</p>
                    {postData.media_url && postData.media_url.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {postData.media_url.slice(0, 4).map((url: string, i: number) => (
                          <img
                            key={i}
                            src={url}
                            alt={`Post media ${i + 1}`}
                            className="rounded-md w-full h-32 object-cover"
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : null;
            })}
          </div>
        ) : (
          <p>No content available</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Sample Stories</h2>
        {stories && stories.length > 0 ? (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {stories.map((story) => {
              const storyData = story && typeof story === 'object' ? story : null;
              const creatorData = storyData && storyData.creator && Array.isArray(storyData.creator) && storyData.creator.length > 0 ? storyData.creator[0] : null;
              
              return storyData ? (
                <div
                  key={storyData.id}
                  className="flex-shrink-0 w-20 h-32 rounded-lg overflow-hidden relative"
                >
                  <img
                    src={storyData.media_url || ''}
                    alt="Story"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-black/70 to-transparent">
                    <p className="text-xs text-white truncate">
                      {creatorData?.username || 'User'}
                    </p>
                  </div>
                </div>
              ) : null;
            })}
          </div>
        ) : (
          <p>No stories available</p>
        )}
      </div>

      {!showMore ? (
        <Button onClick={() => setShowMore(true)} className="w-full">
          Show More Demo Content
        </Button>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Additional Demo Content</h2>
          <p>
            This is placeholder content to demonstrate the UI. In the real app,
            this would be populated with actual user-generated content.
          </p>
          <Button onClick={() => setShowMore(false)} className="w-full">
            Show Less
          </Button>
        </div>
      )}
    </div>
  );
};
