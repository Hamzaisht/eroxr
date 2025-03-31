
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PostCard } from "@/components/feed/PostCard";
import { EmptyState } from "./EmptyState";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfilePostsProps {
  userId: string;
}

export const ProfilePosts = ({ userId }: ProfilePostsProps) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('creator_id', userId)
          .eq('post_type', 'post')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setPosts(data || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchPosts();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array(3).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-[300px] rounded-xl" />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        title="No Posts Yet"
        description="This user hasn't posted any content yet."
        icon="📝"
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};
