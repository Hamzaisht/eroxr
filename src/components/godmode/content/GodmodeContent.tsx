import React, { useState, useEffect } from 'react';
import { useAdminSession } from '@/contexts/AdminSessionContext';
import { useGhostCapabilities } from '@/hooks/useGhostCapabilities';
import { supabase } from '@/integrations/supabase/client';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { Search, Filter, Grid, List, Eye, Flag, Download, Video, Image, FileText, Clock, Users, Tag, DollarSign, Play, Maximize2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { UniversalMedia } from '@/components/shared/media/UniversalMedia';
import { FullscreenMediaViewer } from '@/components/media/FullscreenMediaViewer';

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
  content_type: 'post' | 'story' | 'video' | 'message' | 'media' | 'profile_photo';
  // Additional fields for different content types
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

export const GodmodeContent: React.FC = () => {
  const { isGhostMode, ghostCapabilities } = useAdminSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterUser, setFilterUser] = useState('');
  const [filterTags, setFilterTags] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [hoveredMedia, setHoveredMedia] = useState<string | null>(null);
  const [fullscreenMedia, setFullscreenMedia] = useState<{
    url: string;
    type: 'image' | 'video';
    alt: string;
  } | null>(null);
  const [realTimeStats, setRealTimeStats] = useState({
    totalPosts: 0,
    totalStories: 0,
    totalMessages: 0,
    totalMedia: 0,
    totalProfiles: 0,
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
        const [postsResult, storiesResult, messagesResult, mediaResult, profilesResult, flaggedResult] = await Promise.all([
          supabase.from('posts').select('id', { count: 'exact', head: true }),
          supabase.from('stories').select('id', { count: 'exact', head: true }),
          supabase.from('direct_messages').select('id', { count: 'exact', head: true }),
          supabase.from('media_assets').select('id', { count: 'exact', head: true }),
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('flagged_content').select('id', { count: 'exact', head: true })
        ]);

        setRealTimeStats({
          totalPosts: postsResult.count || 0,
          totalStories: storiesResult.count || 0, 
          totalMessages: messagesResult.count || 0,
          totalMedia: mediaResult.count || 0,
          totalProfiles: profilesResult.count || 0,
          flagged: flaggedResult.count || 0,
          totalStorage: `${(((postsResult.count || 0) + (mediaResult.count || 0)) * 2.5 / 1000).toFixed(1)} TB`
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  // Fetch content with filters - ALL CONTENT TYPES
  useEffect(() => {
    const fetchAllContent = async () => {
      if (loading) return;

      try {
        // Fetch all content types in parallel
        const contentPromises = [];

        // Skip certain content types based on filter
        const shouldFetchPosts = filterType === 'all' || filterType === 'posts' || filterType === 'ppv' || filterType === 'public' || filterType === 'private' || filterType === 'videos' || filterType === 'images';
        const shouldFetchStories = filterType === 'all' || filterType === 'stories' || filterType === 'videos' || filterType === 'images';
        const shouldFetchMessages = filterType === 'all' || filterType === 'messages' || filterType === 'private';
        const shouldFetchMedia = filterType === 'all' || filterType === 'media' || filterType === 'videos' || filterType === 'images';
        const shouldFetchProfiles = filterType === 'all' || filterType === 'profile_photos' || filterType === 'images';

        // 1. Posts - Fix relationship query
        if (shouldFetchPosts) {
          let postsQuery = supabase
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
              profiles!fk_posts_creator_id(username, avatar_url)
            `)
            .order('created_at', { ascending: false })
            .limit(50);

          if (searchTerm) postsQuery = postsQuery.ilike('content', `%${searchTerm}%`);
          if (filterUser) postsQuery = postsQuery.eq('profiles.username', filterUser);
          
          contentPromises.push(
            postsQuery.then(({ data, error }) => {
              if (error) {
                console.error('Posts error:', error);
                return [];
              }
              return data?.map(item => ({
                ...item,
                content_type: 'post' as const,
                creator: item.profiles || { username: 'Unknown', avatar_url: '' }
              })) || [];
            })
          );
        }

        // 2. Stories - with user filtering
        if (shouldFetchStories) {
          let storiesQuery = supabase
            .from('stories')
            .select(`
              id,
              media_url,
              video_url,
              creator_id,
              view_count,
              created_at,
              expires_at,
              is_active
            `)
            .order('created_at', { ascending: false })
            .limit(50);
          
          contentPromises.push(
            storiesQuery.then(async ({ data, error }) => {
              if (error) {
                console.error('Stories error:', error);
                return [];
              }
              
              // Get creator info separately
              const creatorIds = data?.map(s => s.creator_id).filter(Boolean) || [];
              const { data: creators } = await supabase
                .from('profiles')
                .select('id, username, avatar_url')
                .in('id', creatorIds);
              
              // Apply user filter
              let filteredData = data || [];
              if (filterUser) {
                const matchingCreators = creators?.filter(c => 
                  c.username.toLowerCase().includes(filterUser.toLowerCase())
                );
                const matchingIds = matchingCreators?.map(c => c.id) || [];
                filteredData = filteredData.filter(item => matchingIds.includes(item.creator_id));
              }
              
              return filteredData.map(item => {
                const creator = creators?.find(c => c.id === item.creator_id);
                return {
                  ...item,
                  content: 'Story content',
                  content_type: 'story' as const,
                  media_url: item.media_url ? [item.media_url] : null,
                  video_urls: item.video_url ? [item.video_url] : null,
                  visibility: 'public',
                  is_ppv: false,
                  ppv_amount: null,
                  tags: null,
                  likes_count: 0,
                  comments_count: 0,
                  creator: creator || { username: 'Unknown', avatar_url: '' }
                };
              });
            })
          );
        }

        // 3. Direct Messages (with media attachments)
        if (shouldFetchMessages) {
          let messagesQuery = supabase
            .from('direct_messages')
            .select(`
              id,
              content,
              message_type,
              sender_id,
              recipient_id,
              duration,
              expires_at,
              is_expired,
              created_at
            `)
            .order('created_at', { ascending: false })
            .limit(50);

          if (searchTerm) messagesQuery = messagesQuery.ilike('content', `%${searchTerm}%`);
          
          contentPromises.push(
            messagesQuery.then(async ({ data, error }) => {
              if (error) {
                console.error('Messages error:', error);
                return [];
              }
              
              // Get sender info separately
              const senderIds = data?.map(m => m.sender_id).filter(Boolean) || [];
              const { data: senders } = await supabase
                .from('profiles')
                .select('id, username, avatar_url')
                .in('id', senderIds);
              
              // Apply user filter
              let filteredData = data || [];
              if (filterUser) {
                const matchingSenders = senders?.filter(s => 
                  s.username.toLowerCase().includes(filterUser.toLowerCase())
                );
                const matchingIds = matchingSenders?.map(s => s.id) || [];
                filteredData = filteredData.filter(item => matchingIds.includes(item.sender_id));
              }
              
              return filteredData.map(item => {
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
                  view_count: 0
                };
              });
            })
          );
        }

        // 4. Media Assets (profile photos, uploads, etc.)
        if (shouldFetchMedia) {
          let mediaQuery = supabase
            .from('media_assets')
            .select(`
              id,
              original_name,
              storage_path,
              user_id,
              media_type,
              mime_type,
              file_size,
              access_level,
              post_id,
              created_at
            `)
            .order('created_at', { ascending: false })
            .limit(50);

          if (searchTerm) mediaQuery = mediaQuery.ilike('original_name', `%${searchTerm}%`);
          
          contentPromises.push(
            mediaQuery.then(async ({ data, error }) => {
              if (error) {
                console.error('Media error:', error);
                return [];
              }
              
              // Get user info separately
              const userIds = data?.map(m => m.user_id).filter(Boolean) || [];
              const { data: users } = await supabase
                .from('profiles')
                .select('id, username, avatar_url')
                .in('id', userIds);
              
              // Apply user filter
              let filteredData = data || [];
              if (filterUser) {
                const matchingUsers = users?.filter(u => 
                  u.username.toLowerCase().includes(filterUser.toLowerCase())
                );
                const matchingIds = matchingUsers?.map(u => u.id) || [];
                filteredData = filteredData.filter(item => matchingIds.includes(item.user_id));
              }
              
              return filteredData.map(item => {
                const user = users?.find(u => u.id === item.user_id);
                return {
                  ...item,
                  content_type: 'media' as const,
                  content: item.original_name,
                  creator_id: item.user_id,
                  creator: user || { username: 'Unknown', avatar_url: '' },
                  media_url: item.media_type === 'image' ? [item.storage_path] : null,
                  video_urls: item.media_type === 'video' ? [item.storage_path] : null,
                  visibility: item.access_level,
                  is_ppv: false,
                  ppv_amount: null,
                  tags: null,
                  likes_count: 0,
                  comments_count: 0,
                  view_count: 0
                };
              });
            })
          );
        }

        // 5. Profile Photos (from profiles table)
        if (shouldFetchProfiles) {
          let profilesQuery = supabase
            .from('profiles')
            .select(`
              id,
              username,
              avatar_url,
              banner_url,
              bio,
              created_at,
              updated_at
            `)
            .order('updated_at', { ascending: false })
            .limit(50);

          if (searchTerm) profilesQuery = profilesQuery.ilike('username', `%${searchTerm}%`);
          if (filterUser) profilesQuery = profilesQuery.ilike('username', `%${filterUser}%`);
          
          contentPromises.push(
            profilesQuery.then(({ data, error }) => {
              if (error) {
                console.error('Profiles error:', error);
                return [];
              }
              const profileContent = [];
              data?.forEach(profile => {
                // Add avatar as content
                if (profile.avatar_url) {
                  profileContent.push({
                    id: `${profile.id}_avatar`,
                    content_type: 'profile_photo' as const,
                    content: `${profile.username}'s profile photo`,
                    creator_id: profile.id,
                    creator: { username: profile.username, avatar_url: profile.avatar_url },
                    media_url: [profile.avatar_url],
                    video_urls: null,
                    visibility: 'public',
                    is_ppv: false,
                    ppv_amount: null,
                    tags: null,
                    likes_count: 0,
                    comments_count: 0,
                    view_count: 0,
                    created_at: profile.updated_at
                  });
                }
                // Add banner as content
                if (profile.banner_url) {
                  profileContent.push({
                    id: `${profile.id}_banner`,
                    content_type: 'profile_photo' as const,
                    content: `${profile.username}'s banner photo`,
                    creator_id: profile.id,
                    creator: { username: profile.username, avatar_url: profile.avatar_url },
                    media_url: [profile.banner_url],
                    video_urls: null,
                    visibility: 'public',
                    is_ppv: false,
                    ppv_amount: null,
                    tags: null,
                    likes_count: 0,
                    comments_count: 0,
                    view_count: 0,
                    created_at: profile.updated_at
                  });
                }
              });
              return profileContent;
            })
          );
        }

        // Execute all queries and combine results
        const allResults = await Promise.all(contentPromises);
        const allContent = allResults.flat();

        // Apply additional filters
        let filteredContent = allContent;

        if (filterType !== 'all') {
          filteredContent = allContent.filter(item => {
            switch (filterType) {
              case 'posts': return item.content_type === 'post';
              case 'stories': return item.content_type === 'story';
              case 'messages': return item.content_type === 'message';
              case 'media': return item.content_type === 'media';
              case 'profile_photos': return item.content_type === 'profile_photo';
              case 'ppv': return item.is_ppv;
              case 'public': return item.visibility === 'public';
              case 'private': return item.visibility === 'private' || item.visibility === 'subscribers_only';
              case 'videos': return item.video_urls && item.video_urls.length > 0;
              case 'images': return item.media_url && item.media_url.length > 0;
              default: return true;
            }
          });
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

        // Update state
        contentItems.splice(0);
        contentItems.push(...filteredContent);

      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };

    fetchAllContent();
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

  const openFullscreenMedia = (item: ContentItem) => {
    const mediaUrl = item.video_urls?.[0] || item.media_url?.[0];
    if (!mediaUrl) return;

    const mediaType = item.video_urls?.[0] ? 'video' : 'image';
    setFullscreenMedia({
      url: mediaUrl,
      type: mediaType,
      alt: `${item.creator?.username}'s ${item.content_type}`
    });
  };

  const MediaPreview = ({ item, className = "" }: { item: ContentItem, className?: string }) => {
    const mediaUrl = item.video_urls?.[0] || item.media_url?.[0];
    const isHovered = hoveredMedia === item.id;
    
    if (!mediaUrl) {
      return (
        <div className={`bg-black/30 flex items-center justify-center ${className}`}>
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
      );
    }

    return (
      <div 
        className={`relative group cursor-pointer overflow-hidden ${className} transition-all duration-300 ease-out`}
        onMouseEnter={() => setHoveredMedia(item.id)}
        onMouseLeave={() => setHoveredMedia(null)}
        onClick={() => openFullscreenMedia(item)}
      >
        {/* Media Content */}
        <div className={`w-full h-full transition-transform duration-300 ease-out ${isHovered ? 'scale-105' : 'scale-100'}`}>
          {item.video_urls?.[0] ? (
            <div className="w-full h-full bg-black/50 flex items-center justify-center relative">
              <video 
                src={item.video_urls[0]}
                className="w-full h-full object-cover"
                muted
                preload="metadata"
                poster=""
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className={`bg-white/90 rounded-full flex items-center justify-center transition-all duration-300 ${isHovered ? 'w-10 h-10' : 'w-8 h-8'}`}>
                  <Play className={`text-gray-800 ml-0.5 transition-all duration-300 ${isHovered ? 'w-5 h-5' : 'w-4 h-4'}`} />
                </div>
              </div>
            </div>
          ) : (
            <img 
              src={item.media_url![0]} 
              alt="Content"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        {/* Smooth Hover Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className={`absolute bottom-4 left-4 right-4 transform transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  {getContentTypeIcon(getMediaType(item))}
                </div>
                <div className="text-white text-xs">
                  <div className="font-medium">{item.creator?.username}</div>
                  <div className="opacity-75">{item.content_type}</div>
                </div>
              </div>
              <div className="flex gap-1">
                <button 
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    openFullscreenMedia(item);
                  }}
                >
                  <Maximize2 className="w-3 h-3 text-white" />
                </button>
                <button 
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    const link = document.createElement('a');
                    link.href = mediaUrl;
                    link.download = `content-${item.id}`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  <Download className="w-3 h-3 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
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
            <span className="text-sm text-muted-foreground">Messages</span>
          </div>
          <div className="text-2xl font-bold text-white">{realTimeStats.totalMessages.toLocaleString()}</div>
        </div>
        <div className="premium-glass-panel p-4">
          <div className="flex items-center gap-2 mb-2">
            <Image className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-muted-foreground">Media</span>
          </div>
          <div className="text-2xl font-bold text-yellow-400">{realTimeStats.totalMedia.toLocaleString()}</div>
        </div>
        <div className="premium-glass-panel p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-muted-foreground">Profiles</span>
          </div>
          <div className="text-2xl font-bold text-cyan-400">{realTimeStats.totalProfiles.toLocaleString()}</div>
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
            <SelectTrigger className="w-48 bg-black/20 border-white/10">
              <SelectValue placeholder="Content Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Content</SelectItem>
              <SelectItem value="posts">Posts</SelectItem>
              <SelectItem value="stories">Stories</SelectItem>
              <SelectItem value="messages">Messages</SelectItem>
              <SelectItem value="media">Media Assets</SelectItem>
              <SelectItem value="profile_photos">Profile Photos</SelectItem>
              <SelectItem value="videos">Videos</SelectItem>
              <SelectItem value="images">Images</SelectItem>
              <SelectItem value="ppv">PPV Content</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
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
      <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}`}>
        {contentItems.map((item, index) => (
          <div
            key={item.id}
            ref={index === contentItems.length - 1 ? lastElementRef : null}
            className={`premium-glass-panel hover:border-white/20 transition-all duration-300 group ${
              viewMode === 'list' ? 'flex gap-4 p-4' : 'flex flex-col'
            }`}
            style={viewMode === 'grid' ? { height: '400px' } : undefined}
          >
            {/* Media Preview */}
            {viewMode === 'grid' && (
              <div className="aspect-square rounded-lg overflow-hidden flex-shrink-0 relative">
                <MediaPreview item={item} className="w-full h-full" />
              </div>
            )}

            {viewMode === 'list' && (
              <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                <MediaPreview item={item} className="w-full h-full" />
              </div>
            )}

            <div className={`${viewMode === 'grid' ? 'p-4 flex-1 flex flex-col' : 'flex-1'}`}>
              {/* Creator Info */}
              <div className="flex items-center gap-2 mb-2">
                <img 
                  src={item.creator?.avatar_url || '/placeholder.svg'} 
                  alt={item.creator?.username}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm text-white font-medium truncate">{item.creator?.username}</span>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    item.content_type === 'post' ? 'border-blue-400 text-blue-400' :
                    item.content_type === 'story' ? 'border-purple-400 text-purple-400' :
                    item.content_type === 'message' ? 'border-orange-400 text-orange-400' :
                    item.content_type === 'media' ? 'border-green-400 text-green-400' :
                    item.content_type === 'profile_photo' ? 'border-pink-400 text-pink-400' :
                    'border-gray-400 text-gray-400'
                  }`}
                >
                  {item.content_type.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>

              {/* Icons row */}
              <div className="flex items-center gap-1 mb-2">
                {getContentTypeIcon(getMediaType(item))}
                {item.is_ppv && <DollarSign className="w-3 h-3 text-green-400" />}
                {item.visibility === 'subscribers_only' && <Users className="w-3 h-3 text-purple-400" />}
                {item.visibility === 'private' && <Eye className="w-3 h-3 text-red-400" />}
                {item.expires_at && <Clock className="w-3 h-3 text-yellow-400" />}
              </div>

              {/* Content Preview */}
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2 flex-1">
                {item.content}
              </p>

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {item.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                  {item.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{item.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}

              {/* Bottom section */}
              <div className="mt-auto space-y-1">
                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span>{item.likes_count || 0}</span>
                    <span>{item.comments_count || 0}</span>
                    <span>{item.view_count || 0}</span>
                  </div>
                  {item.is_ppv && (
                    <span className="text-green-400 font-medium">
                      ${item.ppv_amount}
                    </span>
                  )}
                </div>

                {/* Timestamp */}
                <div className="text-xs text-muted-foreground">
                  {new Date(item.created_at).toLocaleDateString()}
                </div>
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

      {/* Fullscreen Media Viewer */}
      {fullscreenMedia && (
        <FullscreenMediaViewer
          isOpen={!!fullscreenMedia}
          onClose={() => setFullscreenMedia(null)}
          mediaUrl={fullscreenMedia.url}
          mediaType={fullscreenMedia.type}
          alt={fullscreenMedia.alt}
        />
      )}
    </div>
  );
};