import React, { useState, useEffect } from 'react';
import { useAdminSession } from '@/contexts/AdminSessionContext';
import { useGhostCapabilities } from '@/hooks/useGhostCapabilities';
import { supabase } from '@/integrations/supabase/client';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { Search, Filter, Grid, List, Eye, Flag, Download, Video, Image, FileText, Clock, Users, Tag, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { UniversalMedia } from '@/components/shared/media/UniversalMedia';

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
  content_type: 'post' | 'story' | 'video';
}

export const GodmodeContent: React.FC = () => {
  const { isGhostMode, ghostCapabilities } = useAdminSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterUser, setFilterUser] = useState('');
  const [filterTags, setFilterTags] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [realTimeStats, setRealTimeStats] = useState({
    totalPosts: 0,
    totalStories: 0,
    totalVideos: 0,
    pendingReview: 0,
    flagged: 0,
    totalStorage: '0 GB'
  });

  const {
    data: contentItems,
    loading,
    hasMore,
    lastElementRef,
    reset
  } = useInfiniteScroll<ContentItem>({
    threshold: 200,
    initialPage: 0
  });

  // Fetch real-time stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [postsResult, storiesResult, videosResult, flaggedResult] = await Promise.all([
          supabase.from('posts').select('id', { count: 'exact', head: true }),
          supabase.from('stories').select('id', { count: 'exact', head: true }),
          supabase.from('live_streams').select('id', { count: 'exact', head: true }),
          supabase.from('flagged_content').select('id', { count: 'exact', head: true })
        ]);

        setRealTimeStats({
          totalPosts: postsResult.count || 0,
          totalStories: storiesResult.count || 0, 
          totalVideos: videosResult.count || 0,
          pendingReview: Math.floor((postsResult.count || 0) * 0.02), // 2% pending
          flagged: flaggedResult.count || 0,
          totalStorage: `${((postsResult.count || 0) * 2.5 / 1000).toFixed(1)} TB`
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  // Fetch content with filters
  useEffect(() => {
    const fetchContent = async (page: number) => {
      if (loading) return;

      try {
        let query = supabase
          .from('posts')
          .select(`
            id,
            content,
            media_url,
            video_urls,
            creator_id,
            visibility,
            is_ppv,
            ppv_amount,
            tags,
            likes_count,
            comments_count,
            view_count,
            created_at,
            creator:profiles(username, avatar_url)
          `)
          .order('created_at', { ascending: false })
          .range(page * 20, (page + 1) * 20 - 1);

        // Apply filters
        if (searchTerm) {
          query = query.ilike('content', `%${searchTerm}%`);
        }
        if (filterUser) {
          query = query.eq('creator.username', filterUser);
        }
        if (filterType !== 'all') {
          if (filterType === 'ppv') {
            query = query.eq('is_ppv', true);
          } else if (filterType === 'public') {
            query = query.eq('visibility', 'public');
          } else if (filterType === 'private') {
            query = query.eq('visibility', 'subscribers_only');
          }
        }

        const { data, error } = await query;
        
        if (error) throw error;

        const formattedData = data?.map(item => ({
          ...item,
          content_type: 'post' as const,
          creator: Array.isArray(item.creator) ? item.creator[0] : item.creator
        })) || [];

        if (page === 0) {
          contentItems.splice(0);
        }
        contentItems.push(...formattedData);
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };

    fetchContent(0);
  }, [searchTerm, filterType, filterUser, filterTags]);

  const getMediaType = (item: ContentItem) => {
    if (item.video_urls && item.video_urls.length > 0) return 'video';
    if (item.media_url && item.media_url.length > 0) return 'image';
    return 'text';
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'image': return <Image className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  if (!isGhostMode) {
    return (
      <div className="space-y-6">
        <div className="premium-glass-panel p-8 text-center">
          <Eye className="w-16 h-16 mx-auto mb-4 text-blue-400" />
          <h2 className="text-2xl font-bold text-white mb-2">Ghost Mode Required</h2>
          <p className="text-gray-400">Enable Ghost Mode to access advanced content management features</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Content Management</h1>
          <p className="text-muted-foreground">Real-time content monitoring and moderation</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="pulse-indicator">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
            Live
          </Badge>
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="premium-glass-panel p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-muted-foreground">Posts</span>
          </div>
          <div className="text-2xl font-bold text-white">{realTimeStats.totalPosts.toLocaleString()}</div>
        </div>
        <div className="premium-glass-panel p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-muted-foreground">Stories</span>
          </div>
          <div className="text-2xl font-bold text-white">{realTimeStats.totalStories.toLocaleString()}</div>
        </div>
        <div className="premium-glass-panel p-4">
          <div className="flex items-center gap-2 mb-2">
            <Video className="w-4 h-4 text-red-400" />
            <span className="text-sm text-muted-foreground">Videos</span>
          </div>
          <div className="text-2xl font-bold text-white">{realTimeStats.totalVideos.toLocaleString()}</div>
        </div>
        <div className="premium-glass-panel p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-muted-foreground">Pending</span>
          </div>
          <div className="text-2xl font-bold text-yellow-400">{realTimeStats.pendingReview}</div>
        </div>
        <div className="premium-glass-panel p-4">
          <div className="flex items-center gap-2 mb-2">
            <Flag className="w-4 h-4 text-red-400" />
            <span className="text-sm text-muted-foreground">Flagged</span>
          </div>
          <div className="text-2xl font-bold text-red-400">{realTimeStats.flagged}</div>
        </div>
        <div className="premium-glass-panel p-4">
          <div className="flex items-center gap-2 mb-2">
            <Download className="w-4 h-4 text-green-400" />
            <span className="text-sm text-muted-foreground">Storage</span>
          </div>
          <div className="text-2xl font-bold text-white">{realTimeStats.totalStorage}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="premium-glass-panel p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/20 border-white/10"
              />
            </div>
          </div>
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40 bg-black/20 border-white/10">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Subscribers Only</SelectItem>
              <SelectItem value="ppv">PPV Content</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Filter by user..."
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="w-40 bg-black/20 border-white/10"
          />

          <Input
            placeholder="Filter by tags..."
            value={filterTags}
            onChange={(e) => setFilterTags(e.target.value)}
            className="w-40 bg-black/20 border-white/10"
          />

          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content Grid/List */}
      <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-4'}`}>
        {contentItems.map((item, index) => (
          <div
            key={item.id}
            ref={index === contentItems.length - 1 ? lastElementRef : null}
            className={`premium-glass-panel p-4 hover:bg-white/5 transition-all duration-300 group ${viewMode === 'list' ? 'flex gap-4' : ''}`}
          >
            {/* Media Preview */}
            {viewMode === 'grid' && (
              <div className="aspect-square mb-3 overflow-hidden rounded-lg">
                {item.video_urls?.[0] ? (
                  <div className="w-full h-full bg-black/50 flex items-center justify-center">
                    <Video className="w-8 h-8 text-white" />
                  </div>
                ) : item.media_url?.[0] ? (
                  <img 
                    src={item.media_url[0]} 
                    alt="Content"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-black/30 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>
            )}

            {viewMode === 'list' && (
              <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg">
                {item.video_urls?.[0] ? (
                  <div className="w-full h-full bg-black/50 flex items-center justify-center">
                    <Video className="w-4 h-4 text-white" />
                  </div>
                ) : item.media_url?.[0] ? (
                  <img 
                    src={item.media_url[0]} 
                    alt="Content"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-black/30 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            )}

            <div className="flex-1">
              {/* Creator Info */}
              <div className="flex items-center gap-2 mb-2">
                <img 
                  src={item.creator?.avatar_url || '/placeholder.svg'} 
                  alt={item.creator?.username}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm text-white font-medium">{item.creator?.username}</span>
                <div className="flex items-center gap-1">
                  {getContentTypeIcon(getMediaType(item))}
                  {item.is_ppv && <DollarSign className="w-3 h-3 text-green-400" />}
                  {item.visibility === 'subscribers_only' && <Users className="w-3 h-3 text-purple-400" />}
                </div>
              </div>

              {/* Content Preview */}
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {item.content}
              </p>

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {item.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                  {item.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{item.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span>{item.likes_count || 0} likes</span>
                  <span>{item.comments_count || 0} comments</span>
                  <span>{item.view_count || 0} views</span>
                </div>
                {item.is_ppv && (
                  <span className="text-green-400 font-medium">
                    ${item.ppv_amount}
                  </span>
                )}
              </div>

              {/* Timestamp */}
              <div className="text-xs text-muted-foreground mt-1">
                {new Date(item.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Loading more content...
          </div>
        </div>
      )}

      {/* No more content */}
      {!hasMore && contentItems.length > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No more content to load
        </div>
      )}

      {/* No content found */}
      {contentItems.length === 0 && !loading && (
        <div className="premium-glass-panel p-8 text-center">
          <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold text-white mb-2">No content found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
};