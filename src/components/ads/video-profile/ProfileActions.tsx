import { useState } from 'react';
import { Eye, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface ProfileActionsProps {
  userId: string | null;
  onShare: () => Promise<void>;
}

export const ProfileActions = ({ userId, onShare }: ProfileActionsProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLike = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Check if user is authenticated
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to like profiles",
          variant: "destructive",
        });
        return;
      }

      // Check if we have a valid userId to like
      if (!userId) {
        toast({
          title: "Error",
          description: "Invalid profile",
          variant: "destructive",
        });
        return;
      }

      // First check if the like already exists
      const { data: existingLike } = await supabase
        .from('creator_likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('creator_id', userId)
        .single();

      if (existingLike) {
        // Unlike if already liked
        const { error: deleteError } = await supabase
          .from('creator_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('creator_id', userId);

        if (deleteError) throw deleteError;

        setIsLiked(false);
        toast({
          title: "Profile unliked",
          description: "This profile has been removed from your likes",
        });
      } else {
        // Create new like
        const { error } = await supabase
          .from('creator_likes')
          .insert([
            { 
              user_id: user.id, 
              creator_id: userId 
            }
          ]);

        if (error) throw error;

        setIsLiked(true);
        toast({
          title: "Profile liked",
          description: "This profile has been added to your likes",
        });
      }
    } catch (error: any) {
      console.error('Like error:', error);
      toast({
        title: "Error",
        description: error.message || "Could not process like action",
        variant: "destructive",
      });
    }
  };

  const handleContact = () => {
    navigate(`/messages?recipient=${userId}`);
  };

  return (
    <div className="flex items-center justify-between pt-4">
      <div className="flex gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          className="text-luxury-primary hover:text-luxury-primary/80 hover:bg-luxury-primary/10"
          onClick={onShare}
        >
          <Eye className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className={`${isLiked ? 'text-red-500' : 'text-luxury-primary'} hover:text-luxury-primary/80 hover:bg-luxury-primary/10`}
          onClick={handleLike}
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
      </div>
      <Button 
        variant="default"
        className="bg-gradient-to-r from-luxury-primary to-luxury-secondary hover:from-luxury-secondary hover:to-luxury-primary text-white"
        onClick={handleContact}
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        Contact
      </Button>
    </div>
  );
};