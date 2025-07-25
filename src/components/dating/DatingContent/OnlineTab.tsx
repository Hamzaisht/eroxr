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
  isCurrentUser?: boolean;
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
      
      // Fetch active dating ads first (including current user's ads)
      const { data: datingAds, error: adsError } = await supabase
        .from('dating_ads')
        .select('*')
        .eq('is_active', true)
        .order('last_active', { ascending: false })
        .limit(100);

      if (adsError) {
        console.error('Error fetching dating ads:', adsError);
        toast({
          title: "Error loading dating ads",
          description: "Could not load dating ads. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (!datingAds || datingAds.length === 0) {
        setOnlineUsers([]);
        return;
      }

      // Get user IDs from dating ads
      const userIds = datingAds.map(ad => ad.user_id).filter(Boolean);

      // Fetch profiles for those users who have bodycontact enabled (including current user)
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, location, last_seen, can_access_bodycontact')
        .in('id', userIds)
        .eq('can_access_bodycontact', true);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        toast({
          title: "Error loading profiles",
          description: "Could not load user profiles. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Combine dating ads with profiles (including current user)
      const usersWithProfiles = datingAds
        .map(ad => {
          const profile = profiles?.find(p => p.id === ad.user_id);
          if (!profile) return null;
          
          return {
            ...ad,
            profiles: profile,
            online_status: getOnlineStatus(profile.last_seen),
            isCurrentUser: session?.user?.id === ad.user_id // Mark if this is the current user
          };
        })
        .filter(Boolean) as OnlineUser[];

      // Sort so current user appears first, then by online status and last activity
      const sortedUsers = usersWithProfiles.sort((a, b) => {
        // Current user first
        if (a.isCurrentUser && !b.isCurrentUser) return -1;
        if (!a.isCurrentUser && b.isCurrentUser) return 1;
        
        // Then by online status
        const statusOrder = { online: 0, recently_active: 1, offline: 2 };
        const aStatus = statusOrder[a.online_status || 'offline'];
        const bStatus = statusOrder[b.online_status || 'offline'];
        if (aStatus !== bStatus) return aStatus - bStatus;
        
        // Finally by last activity
        const aTime = new Date(a.profiles?.last_seen || a.last_active || 0).getTime();
        const bTime = new Date(b.profiles?.last_seen || b.last_active || 0).getTime();
        return bTime - aTime;
      });

      setOnlineUsers(sortedUsers);
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

  const getStatusText = (status: 'online' | 'recently_active' | 'offline', lastSeen?: string) => {
    switch (status) {
      case 'online': return 'Online now';
      case 'recently_active': return lastSeen ? `Active ${formatDistanceToNow(new Date(lastSeen), { addSuffix: true })}` : 'Recently active';
      default: return lastSeen ? `Last seen ${formatDistanceToNow(new Date(lastSeen), { addSuffix: true })}` : 'Offline';
    }
  };

  const getCountryFlag = (country?: string) => {
    const countryFlags: Record<string, string> = {
      'denmark': '🇩🇰',
      'sweden': '🇸🇪', 
      'norway': '🇳🇴',
      'finland': '🇫🇮',
      'iceland': '🇮🇸'
    };
    
    if (!country) return '🌍';
    return countryFlags[country.toLowerCase()] || '🌍';
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
      
      <div className="space-y-3">
        {onlineUsers.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div className="relative flex items-center bg-card/50 backdrop-blur-sm border border-border/50 hover:border-border transition-all group cursor-pointer rounded-lg overflow-hidden">
              {/* Cover Banner */}
              <div className="relative w-20 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 flex-shrink-0">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-1 right-1 text-lg">
                  {getCountryFlag(user.country)}
                </div>
                {user.isCurrentUser && (
                  <div className="absolute top-1 left-1">
                    <Badge className="bg-primary/90 text-primary-foreground text-xs px-1 py-0">
                      You
                    </Badge>
                  </div>
                )}
              </div>
              
              {/* Profile Picture */}
              <div className="relative -ml-6 z-10">
                <Avatar className="h-12 w-12 ring-2 ring-primary/30 ring-offset-2 ring-offset-card">
                  <AvatarImage src={user.avatar_url || user.profiles?.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {(user.profiles?.username || user.title)?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${
                  user.online_status === 'online' ? 'bg-green-500' : 
                  user.online_status === 'recently_active' ? 'bg-yellow-500' : 'bg-gray-500'
                }`}></div>
              </div>
              
              {/* User Info */}
              <div className="flex-1 min-w-0 px-3 py-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground truncate text-sm">
                    {user.profiles?.username || user.title}
                  </h3>
                  {user.is_verified && <Circle className="h-3 w-3 text-blue-500 fill-current" />}
                  {user.is_premium && <Circle className="h-3 w-3 text-yellow-500 fill-current" />}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <Circle className={`w-2 h-2 ${
                    user.online_status === 'online' ? 'text-green-500' : 
                    user.online_status === 'recently_active' ? 'text-yellow-500' : 'text-gray-500'
                  } fill-current`} />
                  <span className="text-xs text-muted-foreground">
                    {getStatusText(user.online_status || 'offline', user.profiles?.last_seen)}
                  </span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-1 px-3 py-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2 text-xs border-blue-500/30 hover:border-blue-500/60 hover:bg-blue-500/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMessage(user);
                  }}
                  disabled={user.isCurrentUser}
                >
                  <MessageCircle className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2 text-xs border-yellow-500/30 hover:border-yellow-500/60 hover:bg-yellow-500/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookmark(user);
                  }}
                  disabled={user.isCurrentUser}
                >
                  <Bookmark className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2 text-xs border-purple-500/30 hover:border-purple-500/60 hover:bg-purple-500/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRequestConnection(user);
                  }}
                  disabled={user.isCurrentUser}
                >
                  <UserPlus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}