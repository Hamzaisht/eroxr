
import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storyId: string;
}

export const ShareDialog = ({ open, onOpenChange, storyId }: ShareDialogProps) => {
  const session = useSession();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: followers = [] } = useQuery({
    queryKey: ["followers", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('followers')
        .select(`
          following_id,
          following:profiles!following_id(id, username, avatar_url)
        `)
        .eq('follower_id', session?.user?.id);

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const handleShare = async (recipientId: string) => {
    try {
      // Create a direct message with the shared story
      await supabase.from('direct_messages').insert({
        sender_id: session?.user?.id,
        recipient_id: recipientId,
        content: `Shared a story with you`,
        message_type: 'story_share',
        message_source: 'story_share',
        original_content: storyId
      });

      // Register the share action
      await supabase.from('post_media_actions').insert({
        post_id: storyId,
        user_id: session?.user?.id,
        action_type: 'share'
      });

      toast({
        title: "Story shared",
        description: "Story has been shared successfully",
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error sharing story:', error);
      toast({
        title: "Error",
        description: "Failed to share story",
        variant: "destructive",
      });
    }
  };

  const filteredFollowers = followers.filter(follower => 
    follower.following.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Story</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4"
          />
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {filteredFollowers.map((follower) => (
                <div 
                  key={follower.following_id} 
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={follower.following.avatar_url || ""} />
                      <AvatarFallback>
                        {follower.following.username?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{follower.following.username}</span>
                  </div>
                  <Button 
                    variant="secondary"
                    onClick={() => handleShare(follower.following_id)}
                  >
                    Share
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
