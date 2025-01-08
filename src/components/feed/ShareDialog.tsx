import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Share, Link, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string;
}

export const ShareDialog = ({ open, onOpenChange, postId }: ShareDialogProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const postUrl = `${window.location.origin}/post/${postId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      toast({
        title: "Link copied",
        description: "Post link has been copied to your clipboard",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this post on Eroxr",
          text: "I found this interesting post on Eroxr",
          url: postUrl,
        });
        onOpenChange(false);
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          toast({
            title: "Failed to share",
            description: "Please try copying the link instead",
            variant: "destructive",
          });
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleMessageShare = () => {
    navigate(`/messages/new?content=${encodeURIComponent(postUrl)}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share post</DialogTitle>
          <DialogDescription>
            Share this post with other Eroxr users
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleCopyLink}
          >
            <Link className="mr-2 h-4 w-4" />
            Copy link
          </Button>
          {navigator.share && (
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleShare}
            >
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
          )}
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleMessageShare}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Send as message
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};