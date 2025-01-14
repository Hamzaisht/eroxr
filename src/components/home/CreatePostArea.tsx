import { useSession } from "@supabase/auth-helpers-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface CreatePostAreaProps {
  onOpenCreatePost: () => void;
  onFileSelect: (files: FileList | null) => void;
  isPayingCustomer: boolean | null;
}

export const CreatePostArea = ({
  onOpenCreatePost,
  onFileSelect,
  isPayingCustomer
}: CreatePostAreaProps) => {
  const session = useSession();

  if (!session) return null;

  return (
    <Card className="p-4 bg-background/50 backdrop-blur-sm border-luxury-neutral/10">
      <div className="flex items-center gap-4">
        <Avatar className="w-10 h-10 ring-2 ring-luxury-primary/20">
          <AvatarImage src={session.user.user_metadata.avatar_url} />
          <AvatarFallback>
            {session.user.email?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <Button
          variant="outline"
          className="w-full justify-start text-muted-foreground hover:text-primary bg-luxury-dark/30"
          onClick={onOpenCreatePost}
        >
          What's on your mind?
        </Button>
      </div>
    </Card>
  );
};