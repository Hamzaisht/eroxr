
import React from 'react';
import { Shield, Users, Crown, Lock, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MediaAccessLevel } from '@/utils/media/types';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";

interface LockedMediaOverlayProps {
  accessLevel: MediaAccessLevel;
  creatorId: string;
  postId?: string;
  thumbnailUrl?: string;
  onUnlock?: () => void;
}

export const LockedMediaOverlay = ({
  accessLevel,
  creatorId,
  postId,
  thumbnailUrl,
  onUnlock
}: LockedMediaOverlayProps) => {
  const session = useSession();
  const { toast } = useToast();
  
  // Lock icon and message based on access level
  const getLockInfo = () => {
    switch (accessLevel) {
      case MediaAccessLevel.FOLLOWERS:
        return {
          icon: <Users className="h-8 w-8 text-blue-400" />,
          message: "This content is for followers only",
          actionLabel: "Follow"
        };
      case MediaAccessLevel.SUBSCRIBERS:
        return {
          icon: <Crown className="h-8 w-8 text-amber-400" />,
          message: "This content is for subscribers only",
          actionLabel: "Subscribe"
        };
      case MediaAccessLevel.PPV:
        return {
          icon: <CreditCard className="h-8 w-8 text-green-400" />,
          message: "This content requires a one-time purchase",
          actionLabel: "Buy Access"
        };
      case MediaAccessLevel.PRIVATE:
      default:
        return {
          icon: <Lock className="h-8 w-8 text-red-400" />,
          message: "This content is private",
          actionLabel: ""
        };
    }
  };
  
  const { icon, message, actionLabel } = getLockInfo();
  
  // Handle unlock action based on access level
  const handleUnlockAction = async () => {
    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access this content",
        variant: "destructive"
      });
      return;
    }
    
    try {
      switch (accessLevel) {
        case MediaAccessLevel.FOLLOWERS:
          // Follow the creator
          await supabase.from("followers").insert({
            follower_id: session.user.id,
            following_id: creatorId
          });
          toast({
            title: "Success!",
            description: "You are now following this creator"
          });
          break;
          
        case MediaAccessLevel.SUBSCRIBERS:
          // Redirect to subscription page
          toast({
            title: "Subscription Required",
            description: "You will be redirected to the subscription page"
          });
          // In a real app, redirect to subscription page or open subscription modal
          break;
          
        case MediaAccessLevel.PPV:
          if (!postId) {
            toast({
              title: "Error",
              description: "Cannot purchase content without post ID",
              variant: "destructive"
            });
            return;
          }
          
          // In a real app, open payment modal or redirect to payment page
          toast({
            title: "Purchase Required",
            description: "You will be redirected to purchase this content"
          });
          break;
          
        default:
          return;
      }
      
      // Notify parent component that unlock action was performed
      if (onUnlock) onUnlock();
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process your request",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 backdrop-blur-sm text-white rounded-lg">
      {thumbnailUrl && (
        <div className="absolute inset-0 z-0 opacity-20">
          <img 
            src={thumbnailUrl} 
            alt="Content thumbnail" 
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      )}
      
      <div className="z-10 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-black/50 p-4 rounded-full mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{message}</h3>
        <p className="text-sm text-gray-300 mb-4">
          You need additional access to view this content
        </p>
        
        {actionLabel && (
          <Button 
            onClick={handleUnlockAction}
            variant="default"
            className="bg-primary hover:bg-primary/90"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};
