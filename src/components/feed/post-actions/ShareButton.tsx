import { Share, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const ShareButton = () => {
  const { toast } = useToast();

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Share Post",
          text: "Check out this post",
          url: window.location.href,
        });
      } else {
        try {
          await navigator.clipboard.writeText(window.location.href);
          toast({
            title: "Link copied",
            description: "Post link has been copied to your clipboard",
          });
        } catch (clipboardError) {
          console.error('Clipboard error:', clipboardError);
          toast({
            title: "Manual copy required",
            description: "Please manually copy this link: " + window.location.href,
            duration: 5000,
          });
        }
      }
    } catch (error) {
      console.error('Share error:', error);
      if (error instanceof Error && error.name !== "AbortError") {
        toast({
          title: "Could not share post",
          description: "Please try copying the link instead",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center gap-2"
      onClick={handleShare}
    >
      {navigator.share ? <Share className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
      {navigator.share ? "Share" : "Copy Link"}
    </Button>
  );
};