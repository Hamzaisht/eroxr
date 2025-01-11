import { Button } from "@/components/ui/button";
import { Image, Video, Heart } from "lucide-react";

interface CreatePostAreaProps {
  isPayingCustomer: boolean | null;
  onOpenCreatePost?: () => void;
  onFileSelect?: (files: FileList | null) => void;
  onOpenGoLive?: () => void;
  onGoLive?: () => void;
}

export const CreatePostArea = ({
  isPayingCustomer,
  onOpenCreatePost,
  onFileSelect,
  onOpenGoLive,
  onGoLive
}: CreatePostAreaProps) => {
  return (
    <div className="p-4 space-y-4 glass-effect rounded-xl">
      <div className="flex items-center gap-4">
        <Button
          onClick={onOpenCreatePost}
          className="flex-1 flex items-center gap-2 bg-luxury-primary/10 hover:bg-luxury-primary/20"
        >
          <Image className="w-5 h-5" />
          <span>Create Post</span>
        </Button>
        
        <Button
          onClick={onOpenGoLive}
          className="flex-1 flex items-center gap-2 bg-luxury-primary/10 hover:bg-luxury-primary/20"
        >
          <Video className="w-5 h-5" />
          <span>Go Live</span>
        </Button>

        <Button
          onClick={onGoLive}
          className="flex-1 flex items-center gap-2 bg-luxury-primary/10 hover:bg-luxury-primary/20"
        >
          <Heart className="w-5 h-5" />
          <span>Dating</span>
        </Button>
      </div>
    </div>
  );
};