import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdminSession } from '@/contexts/AdminSessionContext';

interface ContentItem {
  id: string;
  content: string;
  media_url: string[] | null;
  video_urls: string[] | null;
  creator_id: string;
  creator: {
    username: string;
    avatar_url: string;
  };
  visibility: string;
  is_ppv: boolean;
  ppv_amount: number | null;
  tags: string[] | null;
  likes_count: number;
  comments_count: number;
  view_count: number;
  created_at: string;
  content_type: 'post' | 'story' | 'video' | 'message' | 'media' | 'comment' | 'deleted';
  deleted_at?: string;
  is_deleted?: boolean;
  message_type?: string;
  sender_id?: string;
  recipient_id?: string;
  duration?: number;
  expires_at?: string;
  is_expired?: boolean;
  file_size?: number;
  media_type?: string;
  mime_type?: string;
  access_level?: string;
}

interface RealtimeStats {
  totalPosts: number;
  totalStories: number;
  totalMessages: number;
  totalMedia: number;
  totalComments: number;
  totalProfiles: number;
  flagged: number;
  deletedContent: number;
  totalStorage: string;
}

export const useRealtimeContent = () => {
  const { isGhostMode } = useAdminSession();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [stats, setStats] = useState<RealtimeStats>({
    totalPosts: 0,
    totalStories: 0,
    totalMessages: 0,
    totalMedia: 0,
    totalComments: 0,
    totalProfiles: 0,
    flagged: 0,
    deletedContent: 0,
    totalStorage: '0 TB'
  });
  const [loading, setLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    if (!isGhostMode) return;
    
    try {
      const [postsResult, storiesResult, messagesResult, mediaResult, commentsResult, profilesResult, flaggedResult] = await Promise.all([
        supabase.from('posts').select('id', { count: 'exact', head: true }),
        supabase.from('stories').select('id', { count: 'exact', head: true }),
        supabase.from('direct_messages').select('id', { count: 'exact', head: true }),
        supabase.from('media_assets').select('id', { count: 'exact', head: true }),
        supabase.from('comments').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('flagged_content').select('id', { count: 'exact', head: true })
      ]);

      // Calculate deleted content in ghost mode
      let deletedCount = 0;
      if (isGhostMode) {
        const [deletedPosts, deletedStories, deletedMedia] = await Promise.all([
          supabase.from('posts').select('id', { count: 'exact', head: true }).not('deleted_at', 'is', null),
          supabase.from('stories').select('id', { count: 'exact', head: true }).not('deleted_at', 'is', null),
          supabase.from('media_assets').select('id', { count: 'exact', head: true }).not('deleted_at', 'is', null)
        ]);
        deletedCount = (deletedPosts.count || 0) + (deletedStories.count || 0) + (deletedMedia.count || 0);
      }

      setStats({
        totalPosts: postsResult.count || 0,
        totalStories: storiesResult.count || 0,
        totalMessages: messagesResult.count || 0,
        totalMedia: mediaResult.count || 0,
        totalComments: commentsResult.count || 0,
        totalProfiles: profilesResult.count || 0,
        flagged: flaggedResult.count || 0,
        deletedContent: deletedCount,
        totalStorage: `${(((postsResult.count || 0) + (mediaResult.count || 0)) * 2.5 / 1000).toFixed(1)} TB`
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, [isGhostMode]);

  const fetchContent = useCallback(async (filters: {
    searchTerm?: string;
    filterType?: string;
    filterUser?: string;
    filterTags?: string;
    includeDeleted?: boolean;
  } = {}) => {
    if (!isGhostMode) return;
    
    setLoading(true);
    try {
      const contentPromises = [];
      const { searchTerm, filterType, filterUser, filterTags, includeDeleted } = filters;

      // Determine which content types to fetch
      const shouldFetchPosts = !filterType || filterType === 'all' || filterType === 'posts' || filterType === 'ppv' || filterType === 'public' || filterType === 'private' || filterType === 'videos' || filterType === 'images';
      const shouldFetchStories = !filterType || filterType === 'all' || filterType === 'stories' || filterType === 'videos' || filterType === 'images';
      const shouldFetchMessages = !filterType || filterType === 'all' || filterType === 'messages' || filterType === 'private';
      const shouldFetchMedia = !filterType || filterType === 'all' || filterType === 'media' || filterType === 'videos' || filterType === 'images';
      const shouldFetchVideos = !filterType || filterType === 'all' || filterType === 'videos';
      const shouldFetchComments = !filterType || filterType === 'all' || filterType === 'comments';
      const shouldFetchDeleted = includeDeleted && (filterType === 'all' || filterType === 'deleted');

      // 1. Posts
      if (shouldFetchPosts) {
        let postsQuery = supabase
          .from('posts')
          .select(`
            id, content, media_url, video_urls, creator_id, visibility, is_ppv,
            ppv_amount, tags, likes_count, comments_count, view_count, created_at,
            deleted_at, profiles!posts_creator_id_fkey(username, avatar_url)
          `)
          .order('created_at', { ascending: false })
          .limit(100);

        if (!includeDeleted) postsQuery = postsQuery.is('deleted_at', null);
        if (searchTerm) postsQuery = postsQuery.ilike('content', `%${searchTerm}%`);

        contentPromises.push(
          postsQuery.then(({ data, error }) => {
            if (error) {
              console.error('Posts error:', error);
              return [];
            }
            return data?.map(item => ({
              ...item,
              content_type: item.deleted_at ? 'deleted' as const : 'post' as const,
              creator: item.profiles || { username: 'Unknown', avatar_url: '' },
              is_deleted: !!item.deleted_at
            })) || [];
          })
        );
      }

      // 2. Stories
      if (shouldFetchStories) {
        let storiesQuery = supabase
          .from('stories')
          .select(`
            id, media_url, video_url, creator_id, view_count, created_at,
            expires_at, is_active, deleted_at
          `)
          .order('created_at', { ascending: false })
          .limit(100);

        if (!includeDeleted) storiesQuery = storiesQuery.is('deleted_at', null);

        contentPromises.push(
          storiesQuery.then(async ({ data, error }) => {
            if (error) {
              console.error('Stories error:', error);
              return [];
            }

            const creatorIds = data?.map(s => s.creator_id).filter(Boolean) || [];
            const { data: creators } = await supabase
              .from('profiles')
              .select('id, username, avatar_url')
              .in('id', creatorIds);

            return data?.map(item => {
              const creator = creators?.find(c => c.id === item.creator_id);
              return {
                ...item,
                content: 'Story content',
                content_type: item.deleted_at ? 'deleted' as const : 'story' as const,
                media_url: item.media_url ? [item.media_url] : null,
                video_urls: item.video_url ? [item.video_url] : null,
                visibility: 'public',
                is_ppv: false,
                ppv_amount: null,
                tags: null,
                likes_count: 0,
                comments_count: 0,
                creator: creator || { username: 'Unknown', avatar_url: '' },
                is_deleted: !!item.deleted_at
              };
            }) || [];
          })
        );
      }

      // 3. Messages
      if (shouldFetchMessages) {
        let messagesQuery = supabase
          .from('direct_messages')
          .select(`
            id, content, message_type, sender_id, recipient_id, duration,
            expires_at, is_expired, created_at
          `)
          .order('created_at', { ascending: false })
          .limit(100);

        // Note: direct_messages table doesn't have deleted_at column
        if (searchTerm) messagesQuery = messagesQuery.ilike('content', `%${searchTerm}%`);

        contentPromises.push(
          messagesQuery.then(async ({ data, error }) => {
            if (error) {
              console.error('Messages error:', error);
              return [];
            }

            const senderIds = data?.map(m => m.sender_id).filter(Boolean) || [];
            const { data: senders } = await supabase
              .from('profiles')
              .select('id, username, avatar_url')
              .in('id', senderIds);

            return data?.map(item => {
              const sender = senders?.find(s => s.id === item.sender_id);
              return {
                ...item,
                content_type: 'message' as const,
                creator_id: item.sender_id,
                creator: sender || { username: 'Unknown', avatar_url: '' },
                media_url: null,
                video_urls: null,
                visibility: 'private',
                is_ppv: false,
                ppv_amount: null,
                tags: null,
                likes_count: 0,
                comments_count: 0,
                view_count: 0,
                is_deleted: false
              };
            }) || [];
          })
        );
      }

      // 4. Media Assets (including videos)
      if (shouldFetchMedia) {
        let mediaQuery = supabase
          .from('media_assets')
          .select(`
            id, storage_path, mime_type, media_type, access_level, alt_text,
            post_id, created_at, updated_at, original_name, file_size, deleted_at
          `)
          .order('created_at', { ascending: false })
          .limit(100);

        if (!includeDeleted) mediaQuery = mediaQuery.is('deleted_at', null);

        contentPromises.push(
          mediaQuery.then(({ data, error }) => {
            if (error) {
              console.error('Media error:', error);
              return [];
            }

            return data?.map(item => ({
              ...item,
              content: item.alt_text || item.original_name || 'Media asset',
              content_type: item.deleted_at ? 'deleted' as const : 'media' as const,
              creator_id: '',
              creator: { username: 'System', avatar_url: '' },
              media_url: item.media_type === 'image' ? [item.storage_path] : null,
              video_urls: item.media_type === 'video' ? [item.storage_path] : null,
              visibility: item.access_level || 'public',
              is_ppv: false,
              ppv_amount: null,
              tags: null,
              likes_count: 0,
              comments_count: 0,
              view_count: 0,
              is_deleted: !!item.deleted_at
            })) || [];
          })
        );
      }

      // 5. Comments
      if (shouldFetchComments) {
        let commentsQuery = supabase
          .from('comments')
          .select(`
            id, content, user_id, post_id, created_at, updated_at
          `)
          .order('created_at', { ascending: false })
          .limit(100);

        if (searchTerm) commentsQuery = commentsQuery.ilike('content', `%${searchTerm}%`);

        contentPromises.push(
          commentsQuery.then(async ({ data, error }) => {
            if (error) {
              console.error('Comments error:', error);
              return [];
            }

            const creatorIds = data?.map(c => c.user_id).filter(Boolean) || [];
            const { data: creators } = await supabase
              .from('profiles')
              .select('id, username, avatar_url')
              .in('id', creatorIds);

            return data?.map(item => {
              const creator = creators?.find(c => c.id === item.user_id);
              return {
                ...item,
                content_type: 'comment' as const,
                creator_id: item.user_id,
                creator: creator || { username: 'Unknown', avatar_url: '' },
                media_url: null,
                video_urls: null,
                visibility: 'public',
                is_ppv: false,
                ppv_amount: null,
                tags: null,
                likes_count: 0,
                comments_count: 0,
                view_count: 0,
                is_deleted: false
              };
            }) || [];
          })
        );
      }

      // Execute all queries

      // Execute all queries
      const allResults = await Promise.all(contentPromises);
      const allContent = allResults.flat();

      // Apply filters
      let filteredContent = allContent;

      if (filterType && filterType !== 'all') {
        filteredContent = allContent.filter(item => {
          switch (filterType) {
            case 'posts': return item.content_type === 'post';
            case 'stories': return item.content_type === 'story';
            case 'messages': return item.content_type === 'message';
            case 'videos': return item.content_type === 'video' || (item.video_urls && item.video_urls.length > 0);
            case 'comments': return item.content_type === 'comment';
            case 'media': return item.content_type === 'media';
            case 'deleted': return item.content_type === 'deleted' || item.is_deleted;
            case 'ppv': return item.is_ppv;
            case 'public': return item.visibility === 'public';
            case 'private': return item.visibility === 'private' || item.visibility === 'subscribers_only';
            case 'images': return item.media_url && item.media_url.length > 0;
            default: return true;
          }
        });
      }

      if (filterUser) {
        filteredContent = filteredContent.filter(item =>
          item.creator?.username?.toLowerCase().includes(filterUser.toLowerCase())
        );
      }

      if (filterTags) {
        filteredContent = filteredContent.filter(item =>
          item.tags && item.tags.some(tag =>
            tag.toLowerCase().includes(filterTags.toLowerCase())
          )
        );
      }

      // Sort by creation date (most recent first)
      filteredContent.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setContent(filteredContent);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  }, [isGhostMode]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!isGhostMode) return;

    fetchStats();
    const statsInterval = setInterval(fetchStats, 10000); // Update every 10s

    // Real-time subscriptions for instant updates
    const channels = [
      supabase
        .channel('posts_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
          fetchStats();
        })
        .subscribe(),

      supabase
        .channel('stories_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'stories' }, () => {
          fetchStats();
        })
        .subscribe(),

      supabase
        .channel('messages_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'direct_messages' }, () => {
          fetchStats();
        })
        .subscribe(),

      supabase
        .channel('media_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'media_assets' }, () => {
          fetchStats();
        })
        .subscribe(),


      supabase
        .channel('comments_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, () => {
          fetchStats();
        })
        .subscribe()
    ];

    return () => {
      clearInterval(statsInterval);
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [isGhostMode, fetchStats]);

  return {
    content,
    stats,
    loading,
    fetchContent,
    fetchStats
  };
};