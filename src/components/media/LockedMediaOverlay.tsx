
import { Button } from "@/components/ui/button";
import { MediaAccessLevel } from "@/utils/media/types";
import { motion } from "framer-motion";
import { LockIcon, UserPlus, Heart, CreditCard } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";

interface LockedMediaOverlayProps {
  accessLevel: MediaAccessLevel;
  creatorId: string;
  postId?: string;
  thumbnailUrl?: string;
  onUnlock?: () => void;
}

export function LockedMediaOverlay({
  accessLevel,
  creatorId,
  postId,
  thumbnailUrl,
  onUnlock
}: LockedMediaOverlayProps) {
  const { toast } = useToast();
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async () => {
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "You need to sign in to access this content",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      let actionType = "";
      let successMessage = "";
      
      switch (accessLevel) {
        case MediaAccessLevel.FOLLOWERS:
          actionType = "follow";
          successMessage = "You are now following this creator";
          // Implement follow API call here
          break;
        case MediaAccessLevel.SUBSCRIBERS:
          actionType = "subscribe";
          successMessage = "Successfully subscribed to this creator";
          // Implement subscription API call here
          break;
        case MediaAccessLevel.PPV:
          actionType = "purchase";
          successMessage = "Content purchased successfully";
          // Implement purchase API call here
          break;
      }
      
      toast({
        title: "Success",
        description: successMessage
      });
      
      if (onUnlock) {
        onUnlock();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to complete action",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getActionInfo = () => {
    switch (accessLevel) {
      case MediaAccessLevel.FOLLOWERS:
        return {
          title: "Followers Only Content",
          description: "Follow this creator to view this content",
          buttonText: "Follow Creator",
          icon: <UserPlus className="h-6 w-6" />
        };
      case MediaAccessLevel.SUBSCRIBERS:
        return {
          title: "Subscribers Only Content",
          description: "Subscribe to this creator to view this content",
          buttonText: "Subscribe",
          icon: <Heart className="h-6 w-6" />
        };
      case MediaAccessLevel.PPV:
        return {
          title: "Premium Content",
          description: "Purchase this content to view it",
          buttonText: "Purchase",
          icon: <CreditCard className="h-6 w-6" />
        };
      case MediaAccessLevel.PRIVATE:
      default:
        return {
          title: "Private Content",
          description: "This content is private",
          buttonText: "",
          icon: <LockIcon className="h-6 w-6" />
        };
    }
  };

  const actionInfo = getActionInfo();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm text-white text-center p-6"
      style={{
        backgroundImage: thumbnailUrl ? `url(${thumbnailUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay'
      }}
    >
      <div className="absolute inset-0 bg-black/60" />
      
      <div className="relative z-10 flex flex-col items-center gap-4 max-w-sm">
        <div className="p-4 rounded-full bg-black/30">
          {actionInfo.icon}
        </div>
        
        <h3 className="text-xl font-bold">{actionInfo.title}</h3>
        <p className="text-sm text-gray-300">{actionInfo.description}</p>
        
        {actionInfo.buttonText && accessLevel !== MediaAccessLevel.PRIVATE && (
          <Button 
            onClick={handleAction} 
            disabled={isLoading}
            className="mt-4"
            variant="luxury"
          >
            {isLoading ? "Processing..." : actionInfo.buttonText}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
