
import { Eye, MessageCircle, MousePointer } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ProfileStatsProps {
  viewCount: number;
  messageCount: number;
  clickCount: number;
  userId?: string | null;
}

export const ProfileStats = ({ 
  viewCount, 
  messageCount, 
  clickCount,
  userId 
}: ProfileStatsProps) => {
  // Fetch real stats if userId is provided and no counts are passed
  const { data: stats } = useQuery({
    queryKey: ['profile-stats', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      // If stats are already provided, use those
      if (viewCount > 0 || messageCount > 0 || clickCount > 0) {
        return { viewCount, messageCount, clickCount };
      }
      
      try {
        // Get ad views
        const { data: adData, error: adError } = await supabase
          .from('dating_ads')
          .select('view_count, message_count, click_count')
          .eq('user_id', userId)
          .single();
        
        if (adError) throw adError;
        
        return {
          viewCount: adData?.view_count || 0,
          messageCount: adData?.message_count || 0,
          clickCount: adData?.click_count || 0
        };
      } catch (error) {
        console.error('Error fetching profile stats:', error);
        return null;
      }
    },
    enabled: !!userId && (viewCount === 0 && messageCount === 0 && clickCount === 0),
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  const displayStats = stats || { viewCount, messageCount, clickCount };

  return (
    <div className="absolute top-6 right-6 flex items-center gap-4 px-4 py-2 rounded-full bg-luxury-dark/40 backdrop-blur-sm border border-luxury-primary/20">
      <div className="flex items-center gap-2 text-sm text-luxury-neutral">
        <Eye className="w-4 h-4 text-luxury-primary" />
        <span>{displayStats.viewCount}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-luxury-neutral">
        <MessageCircle className="w-4 h-4 text-luxury-primary" />
        <span>{displayStats.messageCount}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-luxury-neutral">
        <MousePointer className="w-4 h-4 text-luxury-primary" />
        <span>{displayStats.clickCount}</span>
      </div>
    </div>
  );
};
