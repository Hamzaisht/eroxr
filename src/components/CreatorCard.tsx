
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, User } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { asUUID } from "@/utils/supabase/helpers";

interface CreatorCardProps {
  id: string;
  username: string;
  avatarUrl?: string;
  banner?: string;
  bio?: string;
  isVerified?: boolean;
  isPremium?: boolean;
  followerCount?: number;
  postCount?: number;
  // For backward compatibility with FeaturedCreators
  name?: string;
  image?: string;
  creatorId?: string;
  description?: string;
  subscribers?: number;
}

export const CreatorCard = ({
  id,
  username,
  avatarUrl,
  banner,
  bio,
  isVerified = false,
  isPremium = false,
  followerCount = 0,
  postCount = 0,
  // Map legacy props to new props
  name,
  image,
  creatorId,
  description,
  subscribers,
}: CreatorCardProps) => {
  // Use new props or fall back to legacy props
  const displayId = id || creatorId || "";
  const displayUsername = username || name || "";
  const displayAvatar = avatarUrl || image;
  const displayBio = bio || description;
  const displayFollowerCount = followerCount || subscribers || 0;
  
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const session = useSession();

  // Check if user is already following this creator
  const checkFollowStatus = async () => {
    if (!session?.user?.id) return;
    
    try {
      const { data } = await supabase
        .from("followers")
        .select()
        .eq("follower_id", asUUID(session.user.id))
        .eq("following_id", asUUID(displayId))
        .maybeSingle();
      
      setIsFollowing(!!data);
    } catch (error) {
      console.error("Error checking follow status:", error);
    }
  };
  
  // Check if user is subscribed to this creator
  const checkSubscriptionStatus = async () => {
    if (!session?.user?.id) return;
    
    try {
      const { data } = await supabase
        .from("creator_subscriptions")
        .select()
        .eq("user_id", asUUID(session.user.id))
        .eq("creator_id", asUUID(displayId))
        .maybeSingle();
      
      setIsSubscribed(!!data);
    } catch (error) {
      console.error("Error checking subscription status:", error);
    }
  };

  const handleFollowClick = async () => {
    if (!session) {
      navigate("/login");
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from("followers")
          .delete()
          .eq("follower_id", asUUID(session.user.id))
          .eq("following_id", asUUID(displayId));
        
        if (error) throw error;
        
        toast({
          title: "Unfollowed",
          description: `You are no longer following ${displayUsername}`,
        });
      } else {
        // Follow
        // Creating an object with the correct column names
        const followData = {
          follower_id: asUUID(session.user.id), 
          following_id: asUUID(displayId),
        };
        
        const { error } = await supabase
          .from("followers")
          .insert(followData);
        
        if (error) throw error;
        
        toast({
          title: "Following",
          description: `You are now following ${displayUsername}`,
        });
      }
      
      setIsFollowing(!isFollowing);
    } catch (error: any) {
      console.error("Error toggling follow status:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update follow status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribeClick = () => {
    if (!session) {
      navigate("/login");
      return;
    }

    // Navigate to subscription page
    navigate(`/subscribe/${id}`);
  };

  const handleViewProfile = () => {
    navigate(`/profile/${id}`);
  };

  return (
    <Card className="w-full max-w-sm bg-card/50 backdrop-blur border-primary/20 overflow-hidden transition-all hover:shadow-md hover:border-primary/40">
      <div 
        className="h-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" 
        style={banner ? { backgroundImage: `url(${banner})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      />
      
      <CardContent className="-mt-8 space-y-4">
        <div className="flex justify-between">
          <Avatar className="h-16 w-16 border-4 border-background">
            <AvatarImage src={displayAvatar} alt={displayUsername} />
            <AvatarFallback>{displayUsername.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="space-x-1 mt-8">
            {isVerified && (
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30">
                Verified
              </Badge>
            )}
            {isPremium && (
              <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/30">
                Premium
              </Badge>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium">{displayUsername}</h3>
          {displayBio && <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{displayBio}</p>}
        </div>
        
        <div className="flex gap-4 text-sm">
          <div>
            <span className="font-medium">{displayFollowerCount}</span>
            <span className="text-muted-foreground ml-1">followers</span>
          </div>
          <div>
            <span className="font-medium">{postCount}</span>
            <span className="text-muted-foreground ml-1">posts</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 pb-4 gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={handleFollowClick}
          disabled={isLoading}
        >
          <Heart className={`h-4 w-4 mr-1 ${isFollowing ? 'fill-red-500 text-red-500' : ''}`} />
          {isFollowing ? 'Following' : 'Follow'}
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={handleSubscribeClick}
          disabled={isLoading || isSubscribed}
        >
          {isSubscribed ? (
            <>
              <User className="h-4 w-4 mr-1" />
              Subscribed
            </>
          ) : (
            <>
              <User className="h-4 w-4 mr-1" />
              Subscribe
            </>
          )}
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex-none"
          onClick={handleViewProfile}
        >
          <MessageCircle className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
