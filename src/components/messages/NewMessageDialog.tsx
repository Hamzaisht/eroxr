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

export const NewMessageDialog = ({ onSelectUser }: NewMessageDialogProps) => {
  const session = useSession();
  const [open, setOpen] = useState(false);

  const { data: mutualFollowers } = useQuery({
    queryKey: ["mutual-followers", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      // Get users who follow me AND I follow them back
      const { data, error } = await supabase
        .from('followers')
        .select(`
          following:following_id(
            id,
            username,
            avatar_url
          )
        `)
        .eq('follower_id', session.user.id)
        .filter('following_id', 'in', (
          supabase
            .from('followers')
            .select('follower_id')
            .eq('following_id', session.user.id)
        ));

      if (error) {
        console.error('Error fetching mutual followers:', error);
        throw error;
      }

      return data?.map(f => f.following) || [];
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
            {mutualFollowers?.map((user) => (
              <button
                key={user.id}
                onClick={() => handleSelectUser(user.id)}
                className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-secondary transition-colors"
              >
                <Avatar>
                  <AvatarImage src={user.avatar_url} />
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