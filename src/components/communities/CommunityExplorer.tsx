import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, Plus, Crown, Hash, MapPin, Calendar, Star, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Community {
  id: string;
  name: string;
  description: string;
  created_by: string;
  avatar_url?: string;
  banner_url?: string;
  is_private: boolean;
  member_count: number;
  rules: any[];
  tags: string[];
  created_at: string;
  creator?: {
    username: string;
    avatar_url?: string;
  };
  is_member?: boolean;
}

export const CommunityExplorer = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Fetch communities
  const { data: communities = [], isLoading } = useQuery({
    queryKey: ['communities', searchQuery, selectedTag],
    queryFn: async () => {
      let query = supabase
        .from('communities')
        .select(`
          *,
          profiles!communities_created_by_fkey(username, avatar_url)
        `);

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      if (selectedTag) {
        query = query.contains('tags', [selectedTag]);
      }

      query = query.order('member_count', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      // Check membership for each community
      if (user && data) {
        const { data: memberships } = await supabase
          .from('community_members')
          .select('community_id')
          .eq('user_id', user.id);

        const membershipMap = new Set(memberships?.map(m => m.community_id) || []);

        return data.map(community => ({
          ...community,
          creator: community.profiles,
          is_member: membershipMap.has(community.id)
        })) as Community[];
      }

      return data as Community[];
    },
  });

  // Get popular tags
  const { data: popularTags = [] } = useQuery({
    queryKey: ['community-tags'],
    queryFn: async () => {
      const { data } = await supabase
        .from('communities')
        .select('tags')
        .not('tags', 'is', null);

      if (!data) return [];

      const tagCounts: Record<string, number> = {};
      data.forEach(community => {
        community.tags?.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      });

      return Object.entries(tagCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 20)
        .map(([tag, count]) => ({ tag, count }));
    },
  });

  // Join community mutation
  const joinCommunityMutation = useMutation({
    mutationFn: async (communityId: string) => {
      const { error } = await supabase
        .from('community_members')
        .insert({
          community_id: communityId,
          user_id: user!.id,
        });
      
      if (error) throw error;

      // Update member count
      await supabase.rpc('increment', {
        table_name: 'communities',
        row_id: communityId,
        counter_name: 'member_count'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      toast({
        title: 'Joined Community',
        description: 'Welcome to your new community!',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to Join',
        description: 'Could not join the community. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Leave community mutation
  const leaveCommunityMutation = useMutation({
    mutationFn: async (communityId: string) => {
      const { error } = await supabase
        .from('community_members')
        .delete()
        .match({
          community_id: communityId,
          user_id: user!.id,
        });
      
      if (error) throw error;

      // Update member count
      await supabase.rpc('decrement', {
        table_name: 'communities',
        row_id: communityId,
        counter_name: 'member_count'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      toast({
        title: 'Left Community',
        description: 'You have left the community.',
      });
    },
  });

  const handleJoinLeave = (community: Community) => {
    if (!user) return;

    if (community.is_member) {
      leaveCommunityMutation.mutate(community.id);
    } else {
      joinCommunityMutation.mutate(community.id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Communities</h1>
          <p className="text-muted-foreground">Discover and join amazing communities</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Community
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search communities..."
            className="pl-10"
          />
        </div>

        {/* Popular Tags */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedTag === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTag(null)}
          >
            All
          </Button>
          {popularTags.slice(0, 10).map(({ tag, count }) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTag(tag)}
              className="gap-1"
            >
              <Hash className="w-3 h-3" />
              {tag}
              <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                {count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="discover" className="space-y-6">
        <TabsList>
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="joined">My Communities</TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded" />
                      <div className="h-3 bg-muted rounded w-2/3" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communities.map((community, index) => (
                <motion.div
                  key={community.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                    {/* Banner */}
                    {community.banner_url && (
                      <div className="h-32 overflow-hidden rounded-t-lg">
                        <img
                          src={community.banner_url}
                          alt={community.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <CardHeader className="flex-1">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={community.avatar_url} />
                          <AvatarFallback>
                            {community.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">{community.name}</CardTitle>
                            {community.is_private && (
                              <Badge variant="outline" className="h-5 px-1 text-xs">
                                Private
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="line-clamp-2">
                            {community.description}
                          </CardDescription>
                        </div>
                      </div>

                      {/* Tags */}
                      {community.tags && community.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {community.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                          {community.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{community.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {community.member_count.toLocaleString()} members
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(community.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Creator */}
                      {community.creator && (
                        <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                          <Crown className="w-4 h-4" />
                          <span>Created by {community.creator.username}</span>
                        </div>
                      )}
                    </CardHeader>

                    <CardContent>
                      <Button
                        onClick={() => handleJoinLeave(community)}
                        disabled={!user || joinCommunityMutation.isLoading || leaveCommunityMutation.isLoading}
                        variant={community.is_member ? 'outline' : 'default'}
                        className="w-full"
                      >
                        {community.is_member ? 'Leave' : 'Join'} Community
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {communities.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No communities found</h3>
              <p className="text-muted-foreground">Try adjusting your search or create a new community</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="trending">
          <div className="text-center py-12">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Trending Communities</h3>
            <p className="text-muted-foreground">Coming soon - discover the hottest communities</p>
          </div>
        </TabsContent>

        <TabsContent value="joined">
          <div className="text-center py-12">
            <Star className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Your Communities</h3>
            <p className="text-muted-foreground">Communities you've joined will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};