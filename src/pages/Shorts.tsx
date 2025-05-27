
import { ErosItem } from "@/components/eros/ErosItem";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { ErosVideo } from "@/types/eros";

const Shorts = () => {
  const { data: shorts, isLoading } = useQuery({
    queryKey: ['shorts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shorts')
        .select(`
          id,
          title,
          description,
          video_url,
          thumbnail_url,
          creator_id,
          likes_count,
          views_count,
          created_at,
          creator:profiles(id, username)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data || [];
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-luxury-primary" />
      </div>
    );
  }

  // Transform shorts data to ErosVideo format
  const transformedShorts: ErosVideo[] = shorts?.map((short) => ({
    id: short.id,
    url: short.video_url || '',
    thumbnailUrl: short.thumbnail_url || '',
    description: short.description || '',
    creator: {
      id: short.creator_id,
      name: Array.isArray(short.creator) && short.creator.length > 0 
        ? short.creator[0].username || 'Unknown'
        : 'Unknown',
      username: Array.isArray(short.creator) && short.creator.length > 0 
        ? short.creator[0].username || 'Unknown'
        : 'Unknown',
      avatarUrl: ''
    },
    stats: {
      likes: short.likes_count || 0,
      comments: 0,
      shares: 0,
      views: short.views_count || 0
    },
    hasLiked: false,
    hasSaved: false,
    createdAt: short.created_at
  })) || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Eros Shorts</h1>
        <p className="text-gray-400">Quick, engaging content</p>
      </div>
      
      <div className="space-y-6">
        {transformedShorts && transformedShorts.length > 0 ? (
          transformedShorts.map((video) => (
            <ErosItem
              key={video.id}
              video={video}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">No shorts available</p>
            <p className="text-gray-500 text-sm mt-2">Check back later for new content</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shorts;
