import { Button } from "@/components/ui/button";
import { Image, Video, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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
}: CreatePostAreaProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDatingClick = () => {
    navigate("/dating");
    toast({
      title: "Welcome to Dating",
      description: "Create your dating profile or browse matches",
    });
  };

  return (
    <div className="p-4 space-y-4 glass-effect rounded-xl">
      <div className="flex items-center gap-4">
        <Button
          onClick={onOpenCreatePost}
          className="flex-1 flex items-center gap-2 bg-gradient-to-r from-luxury-primary/10 to-luxury-accent/10 hover:bg-luxury-primary/20 transition-all duration-300"
        >
          <Image className="w-5 h-5" />
          <span>Create Post</span>
        </Button>
        
        <Button
          onClick={onOpenGoLive}
          className="flex-1 flex items-center gap-2 bg-gradient-to-r from-luxury-primary/10 to-luxury-accent/10 hover:bg-luxury-primary/20 transition-all duration-300"
        >
          <Video className="w-5 h-5" />
          <span>Go Live</span>
        </Button>

        <Button
          onClick={handleDatingClick}
          className="flex-1 flex items-center gap-2 bg-gradient-to-r from-luxury-primary/10 to-luxury-accent/10 hover:bg-luxury-primary/20 transition-all duration-300 group"
        >
          <Heart className="w-5 h-5 group-hover:text-pink-500 transition-colors" />
          <span>Create a BD</span>
        </Button>
      </div>
    </div>
  );
};