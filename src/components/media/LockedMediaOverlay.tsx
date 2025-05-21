
// Create this component if it doesn't exist
import { useState } from 'react';
import { Lock, CreditCard, Users } from 'lucide-react';
import { MediaAccessLevel } from '@/utils/media/types';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';

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
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();
  const { toast } = useToast();
  
  // Handle subscription action
  const handleSubscribe = async () => {
    if (!session?.user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to subscribe",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    toast({
      title: "Subscription required",
      description: "Please subscribe to access this content",
    });
    setIsLoading(false);
  };
  
  // Handle purchase action
  const handlePurchase = async () => {
    if (!session?.user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to purchase",
        variant: "destructive"
      });
      return;
    }
    
    if (!postId) {
      toast({
        title: "Cannot complete purchase",
        description: "Post information is missing",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    toast({
      title: "Purchase required",
      description: "Please purchase to access this content",
    });
    setIsLoading(false);
  };
  
  // Determine overlay message and action based on access level
  const renderOverlayContent = () => {
    switch (accessLevel) {
      case MediaAccessLevel.SUBSCRIBERS:
        return (
          <div className="text-center">
            <Users className="w-12 h-12 mx-auto mb-3 text-primary" />
            <h3 className="font-medium text-lg mb-2">Subscribers Only</h3>
            <p className="mb-4 text-sm text-gray-300">Subscribe to unlock this content</p>
            <button
              onClick={handleSubscribe}
              disabled={isLoading}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md flex items-center justify-center gap-2 w-full"
            >
              {isLoading ? (
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>Subscribe</>
              )}
            </button>
          </div>
        );
        
      case MediaAccessLevel.PPV:
        return (
          <div className="text-center">
            <CreditCard className="w-12 h-12 mx-auto mb-3 text-primary" />
            <h3 className="font-medium text-lg mb-2">Premium Content</h3>
            <p className="mb-4 text-sm text-gray-300">Purchase to unlock this content</p>
            <button
              onClick={handlePurchase}
              disabled={isLoading}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md flex items-center justify-center gap-2 w-full"
            >
              {isLoading ? (
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>Purchase</>
              )}
            </button>
          </div>
        );
        
      case MediaAccessLevel.PRIVATE:
      default:
        return (
          <div className="text-center">
            <Lock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <h3 className="font-medium text-lg mb-2">Private Content</h3>
            <p className="text-sm text-gray-300">This content is not available</p>
          </div>
        );
    }
  };
  
  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
      {thumbnailUrl && (
        <div 
          className="absolute inset-0 opacity-20 blur-md"
          style={{
            backgroundImage: `url(${thumbnailUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}
      
      <div className="relative z-10 p-6 max-w-xs mx-auto">
        {renderOverlayContent()}
      </div>
    </div>
  );
};
