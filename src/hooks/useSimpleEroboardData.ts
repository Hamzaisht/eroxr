import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

export function useSimpleEroboardData() {
  const session = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState({
    totalEarnings: 0,
    totalSubscribers: 0,
    totalViews: 0,
    engagementRate: 0,
    followers: 0,
    totalContent: 0,
    newSubscribers: 0,
    vipFans: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log('🚀 Fetching simple dashboard data...');

        // Fetch basic post data
        const { data: posts, error: postsError } = await supabase
          .from('posts')
          .select('id, view_count, likes_count, comments_count')
          .eq('creator_id', session.user.id);

        if (postsError) {
          console.error('Posts error:', postsError);
          throw postsError;
        }

        // Fetch followers
        const { count: followerCount } = await supabase
          .from("followers")
          .select("*", { count: 'exact', head: true })
          .eq("following_id", session.user.id);

        // Calculate totals
        const totalViews = (posts || []).reduce((sum, post) => sum + (post.view_count || 0), 0);
        const totalLikes = (posts || []).reduce((sum, post) => sum + (post.likes_count || 0), 0);
        const totalComments = (posts || []).reduce((sum, post) => sum + (post.comments_count || 0), 0);
        const engagementRate = totalViews > 0 ? ((totalLikes + totalComments) / totalViews) * 100 : 0;

        setData({
          totalEarnings: Math.floor(Math.random() * 5000), // Sample data
          totalSubscribers: Math.floor(Math.random() * 100),
          totalViews,
          engagementRate,
          followers: followerCount || 0,
          totalContent: (posts || []).length,
          newSubscribers: Math.floor(Math.random() * 20),
          vipFans: Math.floor(Math.random() * 15)
        });

        console.log('✅ Simple dashboard data loaded');
      } catch (err: any) {
        console.error('❌ Error loading data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session?.user?.id]);

  return { loading, error, data };
}