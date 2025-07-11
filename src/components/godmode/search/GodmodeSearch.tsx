import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdminSession } from '@/contexts/AdminSessionContext';
import { Search, User, FileImage, MessageSquare, Video, Filter, Eye, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SearchResult {
  id: string;
  type: 'user' | 'post' | 'message' | 'stream';
  title: string;
  content?: string;
  username?: string;
  avatar_url?: string;
  created_at: string;
  metadata?: any;
}

interface SearchStats {
  total_users: number;
  total_posts: number;
  total_messages: number;
  total_streams: number;
  search_queries_today: number;
  flagged_results: number;
}

export const GodmodeSearch: React.FC = () => {
  const { isGhostMode, logGhostAction } = useAdminSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchType, setSearchType] = useState<'all' | 'user' | 'post' | 'message' | 'stream'>('all');
  const [stats, setStats] = useState<SearchStats>({
    total_users: 0,
    total_posts: 0,
    total_messages: 0,
    total_streams: 0,
    search_queries_today: 0,
    flagged_results: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchStats = async () => {
    try {
      const [
        { count: userCount },
        { count: postCount },
        { count: messageCount },
        { count: streamCount }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase.from('direct_messages').select('*', { count: 'exact', head: true }),
        supabase.from('live_streams').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        total_users: userCount || 0,
        total_posts: postCount || 0,
        total_messages: messageCount || 0,
        total_streams: streamCount || 0,
        search_queries_today: Math.floor(Math.random() * 1000), // Mock data
        flagged_results: Math.floor(Math.random() * 50) // Mock data
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const performSearch = async () => {
    if (!searchTerm.trim()) return;

    if (isGhostMode) {
      await logGhostAction('Global search', 'search', '', { query: searchTerm, type: searchType, timestamp: new Date().toISOString() });
    }

    setIsLoading(true);
    const results: SearchResult[] = [];

    try {
      // Search users
      if (searchType === 'all' || searchType === 'user') {
        const { data: users } = await supabase
          .from('profiles')
          .select('id, username, avatar_url, created_at')
          .ilike('username', `%${searchTerm}%`)
          .limit(10);

        users?.forEach(user => {
          results.push({
            id: user.id,
            type: 'user',
            title: user.username || 'Unknown User',
            username: user.username,
            avatar_url: user.avatar_url,
            created_at: user.created_at
          });
        });
      }

      // Search posts
      if (searchType === 'all' || searchType === 'post') {
        const { data: posts } = await supabase
          .from('posts')
          .select(`
            id,
            content,
            created_at,
            creator_id,
            profiles:creator_id (username, avatar_url)
          `)
          .ilike('content', `%${searchTerm}%`)
          .limit(10);

        posts?.forEach(post => {
          results.push({
            id: post.id,
            type: 'post',
            title: 'Post',
            content: post.content,
            username: (post.profiles as any)?.username,
            avatar_url: (post.profiles as any)?.avatar_url,
            created_at: post.created_at
          });
        });
      }

      // Search messages
      if (searchType === 'all' || searchType === 'message') {
        const { data: messages } = await supabase
          .from('direct_messages')
          .select(`
            id,
            content,
            created_at,
            sender_id,
            profiles:sender_id (username, avatar_url)
          `)
          .ilike('content', `%${searchTerm}%`)
          .limit(10);

        messages?.forEach(message => {
          results.push({
            id: message.id,
            type: 'message',
            title: 'Message',
            content: message.content,
            username: (message.profiles as any)?.username,
            avatar_url: (message.profiles as any)?.avatar_url,
            created_at: message.created_at
          });
        });
      }

      // Search streams
      if (searchType === 'all' || searchType === 'stream') {
        const { data: streams } = await supabase
          .from('live_streams')
          .select(`
            id,
            title,
            description,
            created_at,
            creator_id,
            profiles:creator_id (username, avatar_url)
          `)
          .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
          .limit(10);

        streams?.forEach(stream => {
          results.push({
            id: stream.id,
            type: 'stream',
            title: stream.title,
            content: stream.description,
            username: (stream.profiles as any)?.username,
            avatar_url: (stream.profiles as any)?.avatar_url,
            created_at: stream.created_at
          });
        });
      }

      setSearchResults(results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    } catch (error) {
      console.error('Error performing search:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'user': return <User className="h-4 w-4" />;
      case 'post': return <FileImage className="h-4 w-4" />;
      case 'message': return <MessageSquare className="h-4 w-4" />;
      case 'stream': return <Video className="h-4 w-4" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'user': return 'bg-blue-500';
      case 'post': return 'bg-green-500';
      case 'message': return 'bg-purple-500';
      case 'stream': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Global Search</h1>
          <p className="text-gray-400">Search across all platform content and users</p>
        </div>
        {isGhostMode && (
          <div className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg">
            <Eye className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-purple-300">Ghost Mode Active</span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-blue-400">{stats.total_users.toLocaleString()}</p>
              </div>
              <User className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Posts</p>
                <p className="text-2xl font-bold text-green-400">{stats.total_posts.toLocaleString()}</p>
              </div>
              <FileImage className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Messages</p>
                <p className="text-2xl font-bold text-purple-400">{stats.total_messages.toLocaleString()}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Streams</p>
                <p className="text-2xl font-bold text-red-400">{stats.total_streams.toLocaleString()}</p>
              </div>
              <Video className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Queries Today</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.search_queries_today.toLocaleString()}</p>
              </div>
              <Search className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Flagged Results</p>
                <p className="text-2xl font-bold text-orange-400">{stats.flagged_results.toLocaleString()}</p>
              </div>
              <Filter className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Interface */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Advanced Search</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users, posts, messages, streams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && performSearch()}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
              />
            </div>
            <Button onClick={performSearch} disabled={isLoading || !searchTerm.trim()}>
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>

          <div className="flex gap-2">
            {['all', 'user', 'post', 'message', 'stream'].map(type => (
              <Button
                key={type}
                variant={searchType === type ? 'default' : 'outline'}
                onClick={() => setSearchType(type as any)}
                size="sm"
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Search Results ({searchResults.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-white/10">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Type</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Content</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">User</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Created</th>
                    <th className="text-right p-4 text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((result) => (
                    <tr key={`${result.type}-${result.id}`} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-4">
                        <Badge className={`${getTypeColor(result.type)} text-white border-none`}>
                          <div className="flex items-center gap-1">
                            {getTypeIcon(result.type)}
                            {result.type.toUpperCase()}
                          </div>
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-white font-medium">{result.title}</p>
                          {result.content && (
                            <p className="text-xs text-gray-400 truncate max-w-[300px]">{result.content}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        {result.username && (
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={result.avatar_url} />
                              <AvatarFallback className="bg-purple-500 text-white text-xs">
                                {result.username[0]?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-white text-sm">{result.username}</span>
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="text-gray-400 text-sm">
                          {new Date(result.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};