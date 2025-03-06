
import { useState, useEffect } from 'react';
import { User, MapPin, Calendar, MessageCircle, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProfileQuickPreviewProps {
  userId: string;
  avatarUrl?: string | null;
  username?: string;
  location?: string;
  relationshipStatus?: string;
  isVisible: boolean;
  onClose: () => void;
}

export const ProfileQuickPreview = ({
  userId,
  avatarUrl,
  username = 'User',
  location = 'Unknown',
  relationshipStatus = 'Unknown',
  isVisible,
  onClose
}: ProfileQuickPreviewProps) => {
  const [adCount, setAdCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const session = useSession();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Fetch the number of dating ads this user has posted
  useEffect(() => {
    if (isVisible && userId) {
      const fetchAdCount = async () => {
        setIsLoading(true);
        try {
          const { data, error, count } = await supabase
            .from('dating_ads')
            .select('*', { count: 'exact' })
            .eq('user_id', userId)
            .eq('is_active', true);
            
          if (!error && count !== null) {
            setAdCount(count);
          }
        } catch (error) {
          console.error('Error fetching ad count:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchAdCount();
    }
  }, [userId, isVisible]);
  
  // Handle message button click
  const handleMessageClick = () => {
    if (!session) {
      toast({
        title: "Login Required",
        description: "Please sign in to message users",
        variant: "destructive",
      });
      return;
    }
    
    // Check if user is premium (this will need to be implemented)
    const isPremium = session?.user?.email && ["hamzaishtiaq242@gmail.com"].includes(session.user.email.toLowerCase());
    
    if (!isPremium) {
      toast({
        title: "Premium Feature",
        description: "Messaging is a premium feature. Upgrade for 59 SEK/month to unlock messaging & more.",
        duration: 5000,
      });
      return;
    }
    
    // Navigate to messages with this user
    navigate(`/messages?user=${userId}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute z-50 w-64 bg-luxury-dark/90 backdrop-blur-md rounded-xl shadow-xl p-4 border border-luxury-primary/20"
          onMouseLeave={onClose}
        >
          <div className="flex items-center gap-3 mb-3">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={username} 
                className="w-12 h-12 rounded-full object-cover border-2 border-luxury-primary"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-luxury-darker flex items-center justify-center">
                <User className="w-6 h-6 text-luxury-neutral" />
              </div>
            )}
            
            <div>
              <h3 className="font-semibold text-white">{username}</h3>
              <p className="text-xs text-luxury-neutral flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {location}
              </p>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-luxury-neutral flex items-center gap-1">
                <Calendar className="w-4 h-4" /> Status
              </span>
              <span className="text-white">{relationshipStatus}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-luxury-neutral flex items-center gap-1">
                <Video className="w-4 h-4" /> BD Ads
              </span>
              <span className="text-white">
                {isLoading ? '...' : adCount}
              </span>
            </div>
          </div>
          
          <Button 
            onClick={handleMessageClick}
            className="w-full bg-gradient-to-r from-luxury-primary to-luxury-secondary hover:from-luxury-secondary hover:to-luxury-primary"
            size="sm"
          >
            <MessageCircle className="mr-1 h-3 w-3" />
            Message
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
