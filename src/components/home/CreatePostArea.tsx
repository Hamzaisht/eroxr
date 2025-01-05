import { ImagePlus, Video, Radio } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface CreatePostAreaProps {
  onOpenCreatePost: () => void;
  onFileSelect: (files: FileList | null) => void;
  onOpenGoLive: () => void;
  isPayingCustomer: boolean | null;
}

export const CreatePostArea = ({
  onOpenCreatePost,
  onFileSelect,
  onOpenGoLive,
  isPayingCustomer,
}: CreatePostAreaProps) => {
  const session = useSession();
  const { toast } = useToast();

  const handleGoLive = () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to start streaming",
        variant: "destructive",
      });
      return;
    }

    if (!isPayingCustomer) {
      toast({
        title: "Premium feature",
        description: "Only paying customers can go live",
        variant: "destructive",
      });
      return;
    }

    onOpenGoLive();
  };

  if (!session) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-luxury-neutral/10 bg-luxury-dark/50 p-4 shadow-lg backdrop-blur-lg"
    >
      <div className="flex items-center gap-4">
        <Link to={`/profile/${session.user.id}`}>
          <Avatar className="h-10 w-10 ring-2 ring-luxury-primary/20">
            <AvatarImage src={session.user.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-luxury-primary/20">
              {session.user.email?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        <Input
          placeholder="Share something with your followers..."
          className="flex-1 bg-luxury-dark/30 border-luxury-neutral/10 text-luxury-neutral placeholder:text-luxury-neutral/40"
          onClick={onOpenCreatePost}
        />
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-luxury-neutral/60 hover:text-luxury-primary hover:bg-luxury-primary/10"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <ImagePlus className="h-5 w-5" />
            <input
              type="file"
              id="file-upload"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => onFileSelect(e.target.files)}
              disabled={!isPayingCustomer}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-luxury-neutral/60 hover:text-luxury-primary hover:bg-luxury-primary/10"
            onClick={onOpenCreatePost}
          >
            <Video className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-luxury-neutral/60 hover:text-luxury-primary hover:bg-luxury-primary/10"
            onClick={handleGoLive}
          >
            <Radio className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};