import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';

export interface ProfileActionsProps {
  userId?: string | null;
  onShare?: () => Promise<void>;
  source?: string;
  isOwnProfile?: boolean;
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
}

export const ProfileActions = ({ 
  userId, 
  onShare, 
  source = 'regular',
  isOwnProfile = false,
  isEditing = false,
  onEdit,
  onSave,
  onCancel 
}: ProfileActionsProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLike = async () => {
    try {
      if (!userId) return;

      const { error } = await supabase
        .from('creator_likes')
        .upsert({ 
          user_id: userId,
          creator_id: userId 
        });

      if (error) throw error;

      setIsLiked(!isLiked);
      toast({
        title: isLiked ? "Unliked" : "Liked!",
        description: isLiked ? "Creator removed from favorites" : "Creator added to favorites",
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not process your request",
      });
    }
  };

  const handleContact = async () => {
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not find user information",
      });
      return;
    }
    navigate(`/messages?recipient=${userId}&source=${source}`);
  };

  if (isOwnProfile) {
    return (
      <div className="flex items-center justify-end gap-2 pt-4">
        {isEditing ? (
          <>
            <Button 
              variant="default" 
              onClick={onSave}
              className="bg-luxury-primary hover:bg-luxury-primary/80"
            >
              Save Changes
            </Button>
            <Button 
              variant="outline" 
              onClick={onCancel}
              className="border-luxury-primary text-luxury-primary hover:bg-luxury-primary/10"
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button 
            variant="default"
            onClick={onEdit}
            className="bg-luxury-primary hover:bg-luxury-primary/80"
          >
            Edit Profile
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between pt-4">
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLike}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-luxury-primary/10 text-luxury-primary hover:bg-luxury-primary/20 transition-colors"
        >
          <span className="text-sm font-medium">
            {isLiked ? 'Unlike' : 'Like'}
          </span>
        </motion.button>

        {onShare && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onShare}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-luxury-neutral/10 text-luxury-neutral hover:bg-luxury-neutral/20 transition-colors"
          >
            <span className="text-sm font-medium">Share</span>
          </motion.button>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleContact}
        className="px-6 py-2 rounded-lg bg-luxury-primary text-white hover:bg-luxury-primary/90 transition-colors"
      >
        Contact
      </motion.button>
    </div>
  );
};