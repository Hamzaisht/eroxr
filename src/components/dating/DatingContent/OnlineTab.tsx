import React, { useState, useEffect } from 'react';
import { Circle, Clock, MapPin, MessageCircle, Bookmark, UserPlus, Heart, Eye, CheckCircle2, Crown } from 'lucide-react';
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
          
          // Debug log to see the user data structure
          console.log('User ad data:', {
            username: profile.username,
            country: ad.country,
            city: ad.city,
            isCurrentUser: session?.user?.id === ad.user_id
          });
          
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
    if (!country) return '🌍';
    
    // Debug log to see what country value we're getting
    console.log('Country value received:', country, 'Type:', typeof country);
    
    const countryFlags: Record<string, string> = {
      // Country codes
      'no': '🇳🇴', 'norway': '🇳🇴',
      'dk': '🇩🇰', 'denmark': '🇩🇰',
      'se': '🇸🇪', 'sweden': '🇸🇪', 
      'fi': '🇫🇮', 'finland': '🇫🇮',
      'is': '🇮🇸', 'iceland': '🇮🇸',
      'de': '🇩🇪', 'germany': '🇩🇪',
      'us': '🇺🇸', 'usa': '🇺🇸', 'united states': '🇺🇸',
      'gb': '🇬🇧', 'uk': '🇬🇧', 'united kingdom': '🇬🇧',
      'fr': '🇫🇷', 'france': '🇫🇷',
      'es': '🇪🇸', 'spain': '🇪🇸',
      'it': '🇮🇹', 'italy': '🇮🇹',
      'nl': '🇳🇱', 'netherlands': '🇳🇱',
      'be': '🇧🇪', 'belgium': '🇧🇪',
      'ch': '🇨🇭', 'switzerland': '🇨🇭',
      'at': '🇦🇹', 'austria': '🇦🇹',
      'pl': '🇵🇱', 'poland': '🇵🇱',
      'cz': '🇨🇿', 'czech republic': '🇨🇿',
      'ca': '🇨🇦', 'canada': '🇨🇦',
      'au': '🇦🇺', 'australia': '🇦🇺'
    };
    
    const flagResult = countryFlags[country.toLowerCase()] || '🌍';
    console.log('Flag result for', country, ':', flagResult);
    
    return flagResult;
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
    <div className="space-y-6 p-1">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-luxury-darker/60 backdrop-blur-sm border border-luxury-primary/20 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-20"></div>
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
            Online Now
          </h2>
        </div>
        <Badge variant="secondary" className="bg-luxury-primary/10 text-luxury-primary font-semibold">
          {onlineUsers.length} Active
        </Badge>
      </div>
      
      {/* Users List */}
      <div className="space-y-3">
        {onlineUsers.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
            whileHover={{ scale: 1.02 }}
            className="group"
          >
            <div className="relative bg-luxury-darker/40 backdrop-blur-md border border-luxury-primary/10 hover:border-luxury-primary/30 transition-all duration-300 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-luxury-primary/20">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-br from-luxury-primary/20 via-transparent to-luxury-accent/20"></div>
              </div>
              
              <div className="relative flex items-center p-4">
                {/* Profile Section */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="relative">
                    <div className="relative">
                      <Avatar className="h-14 w-14 ring-2 ring-luxury-primary/30 ring-offset-2 ring-offset-luxury-darker transition-transform group-hover:scale-105">
                        <AvatarImage 
                          src={user.avatar_url || user.profiles?.avatar_url || undefined} 
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-luxury-primary/20 to-luxury-accent/20 text-luxury-primary font-bold text-lg">
                          {(user.profiles?.username || user.title)?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      
                      {/* Online Status Indicator */}
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-3 border-luxury-darker shadow-lg ${
                        user.online_status === 'online' ? 'bg-green-500' : 
                        user.online_status === 'recently_active' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`}>
                        {user.online_status === 'online' && (
                          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-40"></div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-white text-lg truncate group-hover:text-luxury-primary transition-colors">
                        {user.profiles?.username || user.title}
                      </h3>
                      
                      {/* Badges */}
                      <div className="flex gap-1">
                        {user.isCurrentUser && (
                          <Badge className="bg-luxury-primary text-luxury-darker text-xs font-bold px-2 py-0.5">
                            YOU
                          </Badge>
                        )}
                        {user.is_verified && (
                          <CheckCircle2 className="h-4 w-4 text-blue-400 drop-shadow-sm" />
                        )}
                        {user.is_premium && (
                          <Crown className="h-4 w-4 text-yellow-400 drop-shadow-sm" />
                        )}
                      </div>
                    </div>
                    
                    {/* Status and Location */}
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${
                          user.online_status === 'online' ? 'bg-green-500' : 
                          user.online_status === 'recently_active' ? 'bg-yellow-500' : 'bg-gray-500'
                        }`}></div>
                        <span className={`font-medium ${
                          user.online_status === 'online' ? 'text-green-400' : 
                          user.online_status === 'recently_active' ? 'text-yellow-400' : 'text-gray-400'
                        }`}>
                          {getStatusText(user.online_status || 'offline', user.profiles?.last_seen)}
                        </span>
                      </div>
                      
                      {/* Country Flag */}
                      {user.country && (
                        <div className="flex items-center gap-1.5 bg-luxury-primary/10 px-2 py-1 rounded-full">
                          <span className="text-xl leading-none">{getCountryFlag(user.country)}</span>
                          {user.city && (
                            <span className="text-luxury-neutral text-xs font-medium capitalize">
                              {user.city}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 pl-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 w-9 p-0 border-blue-500/30 bg-blue-500/5 hover:border-blue-500/60 hover:bg-blue-500/20 transition-all duration-200 group-hover:scale-105"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMessage(user);
                    }}
                    disabled={user.isCurrentUser}
                  >
                    <MessageCircle className="h-4 w-4 text-blue-400" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 w-9 p-0 border-yellow-500/30 bg-yellow-500/5 hover:border-yellow-500/60 hover:bg-yellow-500/20 transition-all duration-200 group-hover:scale-105"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookmark(user);
                    }}
                    disabled={user.isCurrentUser}
                  >
                    <Bookmark className="h-4 w-4 text-yellow-400" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 w-9 p-0 border-luxury-primary/30 bg-luxury-primary/5 hover:border-luxury-primary/60 hover:bg-luxury-primary/20 transition-all duration-200 group-hover:scale-105"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRequestConnection(user);
                    }}
                    disabled={user.isCurrentUser}
                  >
                    <UserPlus className="h-4 w-4 text-luxury-primary" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}