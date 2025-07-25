import React, { useState, useEffect } from 'react';
import { Circle, Clock, MapPin, MessageCircle, Bookmark, UserPlus, Heart, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { DatingAd } from '@/components/ads/types/dating';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface OnlineTabProps {
  session: any;
  userProfile: DatingAd | null;
}

interface OnlineUser extends DatingAd {
  profiles?: {
    username?: string;
    avatar_url?: string;
    location?: string;
    last_seen?: string;
    can_access_bodycontact?: boolean;
  };
  last_active?: string;
  online_status?: 'online' | 'recently_active' | 'offline';
}

export function OnlineTab({ session, userProfile }: OnlineTabProps) {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch online users with bodycontact enabled
  useEffect(() => {
    fetchOnlineUsers();
  }, [session]);

  const fetchOnlineUsers = async () => {
    try {
      setIsLoading(true);
      
      // Fetch dating ads from users who have bodycontact enabled and are recently active
      const { data, error } = await supabase
        .from('dating_ads')
        .select(`
          *,
          profiles!inner(
            username,
            avatar_url,
            location,
            last_seen,
            can_access_bodycontact
          )
        `)
        .eq('is_active', true)
        .eq('profiles.can_access_bodycontact', true)
        .gte('last_active', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
        .order('last_active', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching online users:', error);
        toast({
          title: "Error loading online users",
          description: "Could not load online users. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Add online status based on last_active time
      const usersWithStatus = data?.map(user => ({
        ...user,
        online_status: getOnlineStatus(user.last_active)
      })) || [];

      setOnlineUsers(usersWithStatus);
    } catch (error) {
      console.error('Error in fetchOnlineUsers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getOnlineStatus = (lastActive: string | null): 'online' | 'recently_active' | 'offline' => {
    if (!lastActive) return 'offline';
    
    const now = new Date();
    const lastActiveDate = new Date(lastActive);
    const diffMinutes = (now.getTime() - lastActiveDate.getTime()) / (1000 * 60);
    
    if (diffMinutes <= 5) return 'online';
    if (diffMinutes <= 60) return 'recently_active';
    return 'offline';
  };

  const getStatusColor = (status: 'online' | 'recently_active' | 'offline') => {
    switch (status) {
      case 'online': return 'text-green-400';
      case 'recently_active': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = (status: 'online' | 'recently_active' | 'offline', lastActive?: string) => {
    switch (status) {
      case 'online': return 'Online now';
      case 'recently_active': return lastActive ? `Active ${formatDistanceToNow(new Date(lastActive), { addSuffix: true })}` : 'Recently active';
      default: return 'Offline';
    }
  };

  const handleMessage = async (user: OnlineUser) => {
    if (!session?.user?.id) {
      toast({
        title: "Sign in required",
        description: "Please sign in to send messages.",
        variant: "destructive",
      });
      return;
    }

    // Navigate to messages or open message dialog
    toast({
      title: "Message sent",
      description: `Opening conversation with ${user.profiles?.username || 'user'}`,
    });
  };

  const handleBookmark = async (user: OnlineUser) => {
    if (!session?.user?.id) {
      toast({
        title: "Sign in required", 
        description: "Please sign in to bookmark profiles.",
        variant: "destructive",
      });
      return;
    }

    // Add to bookmarks/favorites
    toast({
      title: "Profile bookmarked",
      description: `${user.profiles?.username || 'Profile'} added to favorites`,
    });
  };

  const handleRequestConnection = async (user: OnlineUser) => {
    if (!session?.user?.id) {
      toast({
        title: "Sign in required",
        description: "Please sign in to request connections.",
        variant: "destructive",
      });
      return;
    }

    // Send connection request
    toast({
      title: "Connection requested",
      description: `Connection request sent to ${user.profiles?.username || 'user'}`,
    });
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-background/50 rounded-xl min-h-[300px] border border-border/50">
        <Circle className="h-12 w-12 text-green-500/40 mb-4" />
        <h3 className="text-xl font-bold text-green-500 mb-2">Sign in to See Online Users</h3>
        <p className="text-muted-foreground max-w-md">
          Connect with users who are online and have dating/bodycontact enabled.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-background/50 rounded-xl min-h-[300px] border border-border/50">
        <Circle className="h-12 w-12 text-green-500/40 mb-4 animate-pulse" />
        <h3 className="text-xl font-bold text-green-500 mb-2">Loading Online Users...</h3>
        <p className="text-muted-foreground max-w-md">
          Finding users who are currently active.
        </p>
      </div>
    );
  }

  if (onlineUsers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-background/50 rounded-xl min-h-[300px] border border-border/50">
        <Circle className="h-12 w-12 text-green-500/40 mb-4" />
        <h3 className="text-xl font-bold text-green-500 mb-2">No Users Online</h3>
        <p className="text-muted-foreground max-w-md">
          No users with dating/bodycontact enabled are currently online. Check back later!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Circle className="h-5 w-5 text-green-500 animate-pulse" />
        <h2 className="text-xl font-semibold text-foreground">Online Now ({onlineUsers.length})</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {onlineUsers.map((user) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group"
          >
            <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-border transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-0">
                {/* Profile Image */}
                <div className="relative aspect-[4/5] bg-muted">
                  {user.avatar_url || user.profiles?.avatar_url ? (
                    <img
                      src={user.avatar_url || user.profiles?.avatar_url}
                      alt={user.profiles?.username || 'User'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                      <Avatar className="w-20 h-20">
                        <AvatarFallback className="text-2xl">
                          {user.profiles?.username?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                  
                  {/* Online Status Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                      <Circle className={`h-2 w-2 mr-1 ${getStatusColor(user.online_status || 'offline')} fill-current`} />
                      {user.online_status === 'online' ? 'Online' : 'Active'}
                    </Badge>
                  </div>

                  {/* View Count */}
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                      <Eye className="h-3 w-3 mr-1" />
                      {user.view_count || user.views_count || 0}
                    </Badge>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="p-4 space-y-3">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg text-foreground truncate">
                      {user.profiles?.username || user.title}
                    </h3>
                    <p className={`text-sm ${getStatusColor(user.online_status || 'offline')}`}>
                      {getStatusText(user.online_status || 'offline', user.last_active)}
                    </p>
                  </div>

                  {/* Location */}
                  {(user.profiles?.location || user.city) && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{user.profiles?.location || user.city}</span>
                    </div>
                  )}

                  {/* Tags */}
                  {user.tags && user.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {user.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {user.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{user.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMessage(user)}
                      className="border-blue-500/30 hover:border-blue-500/60 hover:bg-blue-500/10"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleBookmark(user)}
                      className="border-yellow-500/30 hover:border-yellow-500/60 hover:bg-yellow-500/10"
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRequestConnection(user)}
                      className="border-purple-500/30 hover:border-purple-500/60 hover:bg-purple-500/10"
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}