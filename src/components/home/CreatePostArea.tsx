import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CreatePostDialog } from "@/components/CreatePostDialog";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const session = useSession();

  if (!session) return null;

  return (
    <>
      <Card className="p-4 bg-background/50 backdrop-blur-sm border-gray-800">
        <div className="flex items-center gap-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={session.user.user_metadata.avatar_url} />
            <AvatarFallback>
              {session.user.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Button
            variant="outline"
            className="w-full justify-start text-muted-foreground hover:text-primary"
            onClick={() => setIsDialogOpen(true)}
          >
            What's on your mind?
          </Button>
        </div>
      </Card>

      <CreatePostDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedFiles={selectedFiles}
        onFileSelect={setSelectedFiles}
      />
    </>
  );
};