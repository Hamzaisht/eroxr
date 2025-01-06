import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCirclePlus } from "lucide-react";

interface NewMessageDialogProps {
  onSelectUser: (userId: string) => void;
}

interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
}

interface MutualFollower {
  following_id: string;
  following: Profile;
}

export const NewMessageDialog = ({ onSelectUser }: NewMessageDialogProps) => {
  const session = useSession();
  const [open, setOpen] = useState(false);

  const { data: mutualFollowers } = useQuery({
    queryKey: ["mutual-followers", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      // First, get the list of users who follow me
      const { data: followersData, error: followersError } = await supabase
        .from('followers')
        .select('follower_id')
        .eq('following_id', session.user.id);

      if (followersError) {
        console.error('Error fetching followers:', followersError);
        return [];
      }

      if (!followersData?.length) return [];

      // Then get the profiles of users I follow who also follow me back
      const { data: mutualData, error: mutualError } = await supabase
        .from('followers')
        .select(`
          following_id,
          following:profiles(
            id,
            username,
            avatar_url
          )
        `)
        .eq('follower_id', session.user.id)
        .in('following_id', followersData.map(f => f.follower_id));

      if (mutualError) {
        console.error('Error fetching mutual followers:', mutualError);
        return [];
      }

      return (mutualData as MutualFollower[])?.map(item => item.following) || [];
    },
    enabled: !!session?.user?.id,
  });

  const handleSelectUser = (userId: string) => {
    onSelectUser(userId);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <MessageCirclePlus className="mr-2 h-4 w-4" />
          New Message
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {mutualFollowers?.map((user: Profile) => (
              <button
                key={user.id}
                onClick={() => handleSelectUser(user.id)}
                className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-secondary transition-colors"
              >
                <Avatar>
                  <AvatarImage src={user.avatar_url || undefined} />
                  <AvatarFallback>
                    {user.username?.[0]?.toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{user.username}</span>
              </button>
            ))}
            {!mutualFollowers?.length && (
              <p className="text-center text-muted-foreground py-8">
                No mutual followers found. Follow some users to start messaging!
              </p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};