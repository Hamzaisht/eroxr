import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdminSession } from '@/contexts/AdminSessionContext';

export interface GhostQuery {
  bypass_rls?: boolean;
  show_deleted?: boolean;
  include_private?: boolean;
  no_analytics?: boolean;
  invisible_mode?: boolean;
}

export const useGhostCapabilities = () => {
  const { isGhostMode, logGhostAction } = useAdminSession();
  const [loading, setLoading] = useState(false);

  // Ghost-enabled queries that bypass normal RLS
  const ghostQuery = async (
    tableName: string, 
    filters: any = {}, 
    options: GhostQuery = {}
  ) => {
    if (!isGhostMode) {
      throw new Error('Ghost capabilities only available in Ghost Mode');
    }

    setLoading(true);
    try {
      // Add ghost mode flag to query
      const ghostOptions = {
        ...options,
        ghost_mode: true,
        admin_override: true
      };

      let query = supabase.from(tableName).select('*');
      
      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });

      // Log the ghost access
      await logGhostAction(`ghost_query_${tableName}`, 'database', tableName, {
        filters,
        options: ghostOptions,
        timestamp: new Date().toISOString()
      });

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } finally {
      setLoading(false);
    }
  };

  // View user profile invisibly
  const viewProfileInvisible = async (userId: string) => {
    if (!isGhostMode) return null;

    const profile = await ghostQuery('profiles', { id: userId }, {
      bypass_rls: true,
      no_analytics: true,
      invisible_mode: true
    });

    await logGhostAction('view_profile_invisible', 'profile', userId, {
      no_visitor_log: true,
      no_analytics_tracking: true
    });

    return profile?.[0];
  };

  // Access premium content without payment
  const accessPremiumContent = async (contentId: string, contentType: 'post' | 'video' | 'stream') => {
    if (!isGhostMode) return null;

    const content = await ghostQuery(contentType === 'post' ? 'posts' : 
                                   contentType === 'video' ? 'videos' : 'live_streams', 
                                   { id: contentId }, {
      bypass_rls: true,
      include_private: true,
      no_analytics: true
    });

    await logGhostAction('access_premium_content', contentType, contentId, {
      no_payment_required: true,
      no_earnings_triggered: true,
      premium_access_granted: true
    });

    return content?.[0];
  };

  // View deleted content
  const viewDeletedContent = async (contentId: string, contentType: string) => {
    if (!isGhostMode) return null;

    const content = await ghostQuery(contentType, { id: contentId }, {
      show_deleted: true,
      bypass_rls: true
    });

    await logGhostAction('view_deleted_content', contentType, contentId, {
      forensic_access: true,
      deleted_content_recovery: true
    });

    return content?.[0];
  };

  // Join live stream invisibly
  const joinStreamInvisible = async (streamId: string) => {
    if (!isGhostMode) return null;

    const stream = await ghostQuery('live_streams', { id: streamId }, {
      bypass_rls: true,
      invisible_mode: true,
      no_analytics: true
    });

    await logGhostAction('join_stream_invisible', 'live_stream', streamId, {
      no_viewer_count_increment: true,
      no_name_display: true,
      invisible_join: true
    });

    return stream?.[0];
  };

  // View private messages without marking as read
  const viewMessagesInvisible = async (threadId: string) => {
    if (!isGhostMode) return null;

    const messages = await ghostQuery('direct_messages', { 
      $or: [
        { sender_id: threadId },
        { recipient_id: threadId }
      ]
    }, {
      bypass_rls: true,
      show_deleted: true,
      no_analytics: true
    });

    await logGhostAction('view_messages_invisible', 'message_thread', threadId, {
      no_read_receipts: true,
      include_deleted_messages: true,
      surveillance_access: true
    });

    return messages;
  };

  // Forensic search across all content
  const forensicSearch = async (query: string, filters: any = {}) => {
    if (!isGhostMode) return [];

    const searches = await Promise.all([
      ghostQuery('posts', { content: `%${query}%` }, { 
        show_deleted: true, 
        include_private: true 
      }),
      ghostQuery('direct_messages', { content: `%${query}%` }, { 
        show_deleted: true, 
        bypass_rls: true 
      }),
      ghostQuery('profiles', { 
        $or: [
          { username: `%${query}%` },
          { bio: `%${query}%` }
        ]
      }, { bypass_rls: true })
    ]);

    await logGhostAction('forensic_search', 'global_search', 'all', {
      search_query: query,
      filters,
      deep_search: true,
      includes_deleted: true
    });

    return {
      posts: searches[0] || [],
      messages: searches[1] || [],
      profiles: searches[2] || []
    };
  };

  // View user earnings data
  const viewUserEarnings = async (userId: string) => {
    if (!isGhostMode) return null;

    const earnings = await ghostQuery('post_purchases', { 
      post_id: { 
        $in: await ghostQuery('posts', { creator_id: userId }).then(posts => 
          posts?.map(p => p.id) || []
        )
      }
    }, { bypass_rls: true });

    await logGhostAction('view_user_earnings', 'financial_data', userId, {
      earnings_audit: true,
      financial_investigation: true
    });

    return earnings;
  };

  return {
    loading,
    viewProfileInvisible,
    accessPremiumContent,
    viewDeletedContent,
    joinStreamInvisible,
    viewMessagesInvisible,
    forensicSearch,
    viewUserEarnings,
    ghostQuery
  };
};