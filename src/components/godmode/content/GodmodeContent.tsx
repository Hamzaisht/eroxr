import React, { useState, useEffect } from 'react';
import { useAdminSession } from '@/contexts/AdminSessionContext';
import { useRealtimeContent } from '@/hooks/useRealtimeContent';
import { Search, Grid, List, Eye, Flag, Download, Video, Image, FileText, Clock, Users, DollarSign, Play, Maximize2, Trash2, AlertTriangle } from 'lucide-react';
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
  content_type: 'post' | 'story' | 'video' | 'message' | 'media' | 'comment' | 'deleted';
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
  is_deleted?: boolean;
  deleted_at?: string;
}

export const GodmodeContent: React.FC = () => {
  const { isGhostMode } = useAdminSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterUser, setFilterUser] = useState('');
  const [filterTags, setFilterTags] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showDeleted, setShowDeleted] = useState(false);
  const [fullscreenMedia, setFullscreenMedia] = useState<{
    url: string;
    type: 'image' | 'video';
    alt: string;
  } | null>(null);

  const { content: contentItems, stats: realTimeStats, loading, fetchContent } = useRealtimeContent();

  // Fetch content when filters change
  useEffect(() => {
    fetchContent({
      searchTerm,
      filterType,
      filterUser,
      filterTags,
      includeDeleted: showDeleted
    });
  }, [searchTerm, filterType, filterUser, filterTags, showDeleted, fetchContent]);

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
    
    if (!mediaUrl) {
      return (
        <div className={`bg-black/30 flex items-center justify-center ${className}`}>
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
      );
    }

    return (
      <div 
        className={`relative group cursor-pointer overflow-hidden ${className}`}
        onClick={() => openFullscreenMedia(item)}
      >
        {/* Media Content - No conditional rendering to prevent video re-render */}
        <div className="w-full h-full transform transition-transform duration-300 ease-out group-hover:scale-105">
          {item.video_urls?.[0] ? (
            <div className="w-full h-full bg-black/50 flex items-center justify-center relative">
              <video 
                src={item.video_urls[0]}
                className="w-full h-full object-cover"
                muted
                preload="metadata"
                poster=""
                key={item.id} // Stable key to prevent re-mounting
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="bg-white/90 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-300 group-hover:w-10 group-hover:h-10">
                  <Play className="text-gray-800 ml-0.5 w-4 h-4 transition-all duration-300 group-hover:w-5 group-hover:h-5" />
                </div>
              </div>
            </div>
          ) : (
            <img 
              src={item.media_url![0]} 
              alt="Content"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          )}
        </div>
        
        {/* Smooth Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute bottom-4 left-4 right-4 transform transition-all duration-300 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
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
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <div className="premium-glass-panel p-4 transition-all duration-200 hover:scale-105">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-muted-foreground">Posts</span>
          </div>
          <div className="text-2xl font-bold text-white">{realTimeStats.totalPosts.toLocaleString()}</div>
        </div>
        <div className="premium-glass-panel p-4 transition-all duration-200 hover:scale-105">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-muted-foreground">Stories</span>
          </div>
          <div className="text-2xl font-bold text-white">{realTimeStats.totalStories.toLocaleString()}</div>
        </div>
        <div className="premium-glass-panel p-4 transition-all duration-200 hover:scale-105">
          <div className="flex items-center gap-2 mb-2">
            <Video className="w-4 h-4 text-red-400" />
            <span className="text-sm text-muted-foreground">Messages</span>
          </div>
          <div className="text-2xl font-bold text-white">{realTimeStats.totalMessages.toLocaleString()}</div>
        </div>
        <div className="premium-glass-panel p-4 transition-all duration-200 hover:scale-105">
          <div className="flex items-center gap-2 mb-2">
            <Image className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-muted-foreground">Media</span>
          </div>
          <div className="text-2xl font-bold text-yellow-400">{realTimeStats.totalMedia.toLocaleString()}</div>
        </div>
        <div className="premium-glass-panel p-4 transition-all duration-200 hover:scale-105">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-muted-foreground">Profiles</span>
          </div>
          <div className="text-2xl font-bold text-cyan-400">{realTimeStats.totalProfiles.toLocaleString()}</div>
        </div>
        <div className="premium-glass-panel p-4 transition-all duration-200 hover:scale-105">
          <div className="flex items-center gap-2 mb-2">
            <Flag className="w-4 h-4 text-red-400" />
            <span className="text-sm text-muted-foreground">Flagged</span>
          </div>
          <div className="text-2xl font-bold text-red-400">{realTimeStats.flagged}</div>
        </div>
        {isGhostMode && (
          <div className="premium-glass-panel p-4 transition-all duration-200 hover:scale-105 border-red-400/20">
            <div className="flex items-center gap-2 mb-2">
              <Trash2 className="w-4 h-4 text-red-400" />
              <span className="text-sm text-muted-foreground">Deleted</span>
            </div>
            <div className="text-2xl font-bold text-red-400">{realTimeStats.deletedContent}</div>
          </div>
        )}
        <div className="premium-glass-panel p-4 transition-all duration-200 hover:scale-105">
          <div className="flex items-center gap-2 mb-2">
            <Download className="w-4 h-4 text-green-400" />
            <span className="text-sm text-muted-foreground">Storage</span>
          </div>
          <div className="text-2xl font-bold text-white">{realTimeStats.totalStorage}</div>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="premium-glass-panel p-6">
        <div className="space-y-4">
          {/* Main Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="🔍 Search across all content types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg bg-black/20 border-white/10 rounded-xl focus:ring-2 focus:ring-blue-400/50 transition-all duration-200"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Content Type Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white/80">Content Type:</span>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-52 bg-black/30 border-white/20 rounded-lg hover:bg-black/40 transition-all duration-200">
                  <SelectValue placeholder="All Content Types" />
                </SelectTrigger>
                <SelectContent className="bg-black/95 backdrop-blur-xl border-white/10 rounded-xl z-50">
                  <SelectItem value="all" className="hover:bg-white/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      All Content
                    </div>
                  </SelectItem>
                  
                  {/* Content Types */}
                  <SelectItem value="posts" className="hover:bg-blue-500/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-400" />
                      Posts
                    </div>
                  </SelectItem>
                  <SelectItem value="stories" className="hover:bg-purple-500/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-400" />
                      Stories
                    </div>
                  </SelectItem>
                  <SelectItem value="messages" className="hover:bg-orange-500/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-orange-400" />
                      Messages
                    </div>
                  </SelectItem>
                  <SelectItem value="media" className="hover:bg-green-500/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Image className="w-4 h-4 text-green-400" />
                      Media Assets
                    </div>
                  </SelectItem>
                  <SelectItem value="profile_photos" className="hover:bg-pink-500/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-pink-400" />
                      Profile Photos
                    </div>
                  </SelectItem>
                  
                  {/* Media Types */}
                  <div className="border-t border-white/10 my-2"></div>
                  <SelectItem value="videos" className="hover:bg-red-500/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Play className="w-4 h-4 text-red-400" />
                      Videos Only
                    </div>
                  </SelectItem>
                  <SelectItem value="images" className="hover:bg-yellow-500/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Image className="w-4 h-4 text-yellow-400" />
                      Images Only
                    </div>
                  </SelectItem>
                  
                  {/* Access Types */}
                  <div className="border-t border-white/10 my-2"></div>
                  <SelectItem value="ppv" className="hover:bg-emerald-500/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      PPV Content
                    </div>
                  </SelectItem>
                  <SelectItem value="public" className="hover:bg-cyan-500/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-cyan-400" />
                      Public
                    </div>
                  </SelectItem>
                  <SelectItem value="private" className="hover:bg-indigo-500/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-indigo-400" />
                      Private
                    </div>
                  </SelectItem>
                  
                  {/* Ghost Mode Exclusive */}
                  {isGhostMode && (
                    <>
                      <div className="border-t border-red-500/20 my-2"></div>
                      <SelectItem value="deleted" className="hover:bg-red-500/20 rounded-lg border border-red-500/30">
                        <div className="flex items-center gap-2">
                          <Trash2 className="w-4 h-4 text-red-400 animate-pulse" />
                          <span className="text-red-400 font-medium">🗑️ Deleted Content</span>
                          <div className="ml-auto px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded-full">GHOST</div>
                        </div>
                      </SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* User Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white/80">User:</span>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Filter by username..."
                  value={filterUser}
                  onChange={(e) => setFilterUser(e.target.value)}
                  className="pl-10 w-44 bg-black/20 border-white/10 rounded-lg"
                />
              </div>
            </div>

            {/* Tags Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white/80">Tags:</span>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">#</span>
                <Input
                  placeholder="Filter by tags..."
                  value={filterTags}
                  onChange={(e) => setFilterTags(e.target.value)}
                  className="pl-8 w-40 bg-black/20 border-white/10 rounded-lg"
                />
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm font-medium text-white/80">View:</span>
              <div className="flex gap-1 p-1 bg-black/30 rounded-lg border border-white/10">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`${viewMode === 'grid' ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-white/10'} transition-all duration-200`}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`${viewMode === 'list' ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-white/10'} transition-all duration-200`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {(filterType !== 'all' || filterUser || filterTags || showDeleted) && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
              <span className="text-sm text-white/60">Active filters:</span>
              
              {filterType !== 'all' && (
                <div className="flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30">
                  Type: {filterType}
                  <button onClick={() => setFilterType('all')} className="ml-1 hover:text-white">✕</button>
                </div>
              )}
              
              {filterUser && (
                <div className="flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30">
                  User: {filterUser}
                  <button onClick={() => setFilterUser('')} className="ml-1 hover:text-white">✕</button>
                </div>
              )}
              
              {filterTags && (
                <div className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm border border-green-500/30">
                  Tags: #{filterTags}
                  <button onClick={() => setFilterTags('')} className="ml-1 hover:text-white">✕</button>
                </div>
              )}
              
              {showDeleted && isGhostMode && (
                <div className="flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm border border-red-500/30 animate-pulse">
                  <Trash2 className="w-3 h-3" />
                  Showing Deleted
                  <button onClick={() => setShowDeleted(false)} className="ml-1 hover:text-white">✕</button>
                </div>
              )}
              
              <button 
                onClick={() => {
                  setFilterType('all');
                  setFilterUser('');
                  setFilterTags('');
                  setShowDeleted(false);
                }}
                className="px-3 py-1 bg-white/10 text-white/60 hover:text-white rounded-full text-sm transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>


      {/* Content Grid/List */}
      <div className={`${
        viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4' 
          : 'space-y-4'
      }`}>
        {contentItems.map((item, index) => (
          <div
            key={item.id}
            className={`premium-glass-panel hover:border-white/20 transition-all duration-300 group animate-fade-in ${
              viewMode === 'list' ? 'flex gap-4 p-4' : 'flex flex-col overflow-hidden'
            } ${item.is_deleted || item.content_type === 'deleted' ? 'border-red-500/20 bg-red-500/5' : ''}`}
            style={viewMode === 'grid' ? { height: '320px' } : undefined}
          >
            {/* Media Preview */}
            {viewMode === 'grid' && (
              <div className="relative w-full h-48 overflow-hidden rounded-t-lg bg-black/20">
                <MediaPreview item={item} className="w-full h-full object-cover" />
              </div>
            )}

            {viewMode === 'list' && (
              <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-black/20">
                <MediaPreview item={item} className="w-full h-full object-cover" />
              </div>
            )}

            <div className={`${viewMode === 'grid' ? 'p-3 flex-1 flex flex-col justify-between' : 'flex-1'}`}>
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
                    item.content_type === 'comment' ? 'border-pink-400 text-pink-400' :
                    item.content_type === 'deleted' ? 'border-red-500 text-red-500 animate-pulse' :
                    'border-gray-400 text-gray-400'
                  }`}
                >
                  {item.content_type === 'deleted' ? '🗑️ DELETED' : item.content_type.replace('_', ' ').toUpperCase()}
                </Badge>
                
                {item.is_deleted && (
                  <Badge variant="outline" className="text-xs border-red-500 text-red-500 animate-pulse">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    DELETED
                  </Badge>
                )}
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
            <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-lg font-medium">Loading content...</span>
          </div>
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