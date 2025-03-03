
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { Profile } from "@/integrations/supabase/types/profile";

interface UserListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileId: string;
  type: 'followers' | 'subscribers';
}

type UserData = {
  id: string;
  username: string | null;
  avatar_url: string | null;
};

export const UserListModal = ({ open, onOpenChange, profileId, type }: UserListModalProps) => {
  const { data: users, isLoading } = useQuery({
    queryKey: [type, profileId],
    queryFn: async () => {
      try {
        if (type === 'followers') {
          const { data, error } = await supabase
            .from('followers')
            .select(`
              follower:follower_id(
                id,
                username,
                avatar_url
              )
            `)
            .eq('following_id', profileId);

          if (error) throw error;
          return data?.map(item => item.follower) as UserData[] || [];
        } else {
          const { data, error } = await supabase
            .from('creator_subscriptions')
            .select(`
              subscriber:user_id(
                id,
                username,
                avatar_url
              )
            `)
            .eq('creator_id', profileId);

          if (error) throw error;
          return data?.map(item => item.subscriber) as UserData[] || [];
        }
      } catch (error) {
        console.error(`Error fetching ${type}:`, error);
        throw error;
      }
    },
    enabled: open
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-luxury-darker border-luxury-primary/20 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {type === 'followers' ? 'Followers' : 'Subscribers'}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] px-1">
          {isLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-luxury-primary" />
            </div>
          ) : !users?.length ? (
            <p className="text-center text-luxury-neutral py-8">
              No {type} yet
            </p>
          ) : (
            <div className="space-y-4 py-4">
              {users.map((user) => (
                <Link
                  key={user.id}
                  to={`/profile/${user.id}`}
                  className="flex items-center gap-4 p-2 rounded-lg hover:bg-luxury-primary/10 transition-colors"
                  onClick={() => onOpenChange(false)}
                >
                  <Avatar>
                    <AvatarImage src={user.avatar_url || ''} alt={user.username || 'User'} />
                    <AvatarFallback>
                      {(user.username || 'U')[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">@{user.username || 'Anonymous'}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
