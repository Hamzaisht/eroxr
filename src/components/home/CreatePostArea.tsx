import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "@supabase/auth-helpers-react";
import { motion } from "framer-motion";
import { ImagePlus, Video, Radio, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  onGoLive,
}: CreatePostAreaProps) => {
  const session = useSession();
  const navigate = useNavigate();

  if (!session) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6 space-y-4"
    >
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12 ring-2 ring-luxury-primary/20">
          <AvatarImage src={session.user.user_metadata.avatar_url} />
          <AvatarFallback>
            {session.user.email?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <Button
          onClick={onOpenCreatePost}
          variant="outline"
          className="flex-1 h-12 justify-start text-luxury-neutral/60 bg-luxury-dark/30 hover:bg-luxury-dark/50 border-luxury-neutral/10"
        >
          What's on your mind?
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          onClick={onOpenCreatePost}
          variant="ghost"
          className="flex-1 min-w-[120px] bg-luxury-dark/20 hover:bg-luxury-dark/40 group"
        >
          <ImagePlus className="w-5 h-5 mr-2 text-luxury-primary group-hover:scale-110 transition-transform" />
          Share
        </Button>

        <Button
          onClick={onOpenGoLive}
          variant="ghost"
          className="flex-1 min-w-[120px] bg-luxury-dark/20 hover:bg-luxury-dark/40 group"
        >
          <Radio className="w-5 h-5 mr-2 text-luxury-accent group-hover:scale-110 transition-transform" />
          Go Live
        </Button>

        <Button
          onClick={() => navigate('/dating')}
          variant="ghost"
          className="flex-1 min-w-[120px] bg-luxury-dark/20 hover:bg-luxury-dark/40 group"
        >
          <Heart className="w-5 h-5 mr-2 text-red-400 group-hover:scale-110 transition-transform" />
          Create a BD
        </Button>
      </div>
    </motion.div>
  );
};