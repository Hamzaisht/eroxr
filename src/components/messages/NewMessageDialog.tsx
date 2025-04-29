
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface NewMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectUser: (userId: string) => void;
}

interface FollowerData {
  following: {
    id: string;
    username: string | null;
    avatar_url: string | null;
  };
  following_id: string;
}

export const NewMessageDialog = ({ open, onOpenChange, onSelectUser }: NewMessageDialogProps) => {
  const session = useSession();

  const { data: mutualFollowers = [] } = useQuery({
    queryKey: ["mutual-followers", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("followers")
        .select(`
          following_id,
          following:profiles!following_id(id, username, avatar_url)
        `)
        .eq("follower_id", session?.user?.id);

      if (error) throw error;

      return data as unknown as FollowerData[];
    },
    enabled: !!session?.user?.id,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="grid gap-4 py-4">
          <h2 className="text-lg font-semibold">Send a Message</h2>
          <div className="flex flex-col gap-2">
            {mutualFollowers.map((follower) => (
              <div key={follower.following_id} className="flex items-center gap-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={follower.following.avatar_url || ""} />
                  <AvatarFallback>{follower.following.username?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{follower.following.username}</span>
                <Button 
                  variant="outline" 
                  className="ml-auto"
                  onClick={() => onSelectUser(follower.following_id)}
                >
                  Message
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewMessageDialog;
