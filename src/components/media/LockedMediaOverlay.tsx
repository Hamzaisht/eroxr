
import { Button } from "@/components/ui/button";
import { Lock, Info } from "lucide-react";
import { MediaAccessLevel } from "@/utils/media/types";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  
  const handleUnlockContent = () => {
    switch (accessLevel) {
      case MediaAccessLevel.PRIVATE:
        toast({
          title: "Private Content",
          description: "This content is private and can only be viewed by the creator.",
          variant: "destructive"
        });
        break;
      case MediaAccessLevel.SUBSCRIBER:
        toast({
          title: "Subscribers Only",
          description: "Subscribe to this creator to view this content.",
        });
        // Here you would redirect to subscription page
        break;
      case MediaAccessLevel.PAID:
        toast({
          title: "Purchase Required",
          description: "Purchase this content to view it.",
        });
        // Here you would show purchase modal
        break;
      default:
        toast({
          title: "Content Locked",
          description: "You don't have permission to view this content.",
          variant: "destructive"
        });
    }
    
    if (onUnlock) {
      onUnlock();
    }
  };
  
  return (
    <div className="relative w-full h-full bg-black/80 flex flex-col items-center justify-center text-center p-4">
      {thumbnailUrl && (
        <div className="absolute inset-0 opacity-20">
          <img 
            src={thumbnailUrl} 
            alt="Content thumbnail" 
            className="w-full h-full object-cover blur-sm"
          />
        </div>
      )}
      
      <div className="z-10 flex flex-col items-center gap-4">
        <div className="p-3 rounded-full bg-primary/20 backdrop-blur-sm">
          <Lock className="w-8 h-8 text-primary" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-white">
            {accessLevel === MediaAccessLevel.PRIVATE && "Private Content"}
            {accessLevel === MediaAccessLevel.SUBSCRIBER && "Subscribers Only"}
            {accessLevel === MediaAccessLevel.PAID && "Premium Content"}
          </h3>
          
          <p className="text-sm text-gray-300 max-w-xs">
            {accessLevel === MediaAccessLevel.PRIVATE && "This content is only available to its creator."}
            {accessLevel === MediaAccessLevel.SUBSCRIBER && "Subscribe to view this exclusive content."}
            {accessLevel === MediaAccessLevel.PAID && "Purchase this content to unlock it."}
          </p>
        </div>
        
        <Button 
          onClick={handleUnlockContent} 
          variant="outline" 
          className="mt-2"
        >
          {accessLevel === MediaAccessLevel.SUBSCRIBER && "Subscribe"}
          {accessLevel === MediaAccessLevel.PAID && "Purchase"}
          {(accessLevel === MediaAccessLevel.PRIVATE) && "More Info"}
        </Button>
        
        <div className="flex items-center gap-1 text-xs text-gray-400 mt-4">
          <Info className="w-3 h-3" />
          <span>Content is protected</span>
        </div>
      </div>
    </div>
  );
};
