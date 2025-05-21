
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Facebook,
  Twitter,
  Instagram,
  Link as LinkIcon,
  Check,
  Copy,
} from "lucide-react";
import { useState } from "react";

interface ErosShareDialogProps {
  videoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShare?: (platform: string) => void;
}

export function ErosShareDialog({
  videoId,
  open,
  onOpenChange,
  onShare,
}: ErosShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  // Generate share URL (in a real app, use the actual domain)
  const shareUrl = `${window.location.origin}/eros/${videoId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        description: "Link copied to clipboard",
      });
      
      if (onShare) {
        onShare("copy");
      }
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Failed to copy link",
      });
    }
  };

  const handleSharePlatform = (platform: string) => {
    let shareLink = "";
    
    switch (platform) {
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`;
        break;
      case "whatsapp":
        shareLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareUrl)}`;
        break;
      default:
        return;
    }
    
    // Open share URL in new window
    window.open(shareLink, "_blank");
    
    if (onShare) {
      onShare(platform);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Video</DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 my-4">
          <Input value={shareUrl} readOnly className="flex-1" />
          <Button variant="outline" size="icon" onClick={handleCopyLink}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="flex flex-col gap-1 h-auto py-3"
            onClick={() => handleSharePlatform("facebook")}
          >
            <Facebook className="h-5 w-5" />
            <span className="text-xs">Facebook</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col gap-1 h-auto py-3"
            onClick={() => handleSharePlatform("twitter")}
          >
            <Twitter className="h-5 w-5" />
            <span className="text-xs">Twitter</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col gap-1 h-auto py-3"
            onClick={() => handleSharePlatform("instagram")}
          >
            <Instagram className="h-5 w-5" />
            <span className="text-xs">Instagram</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col gap-1 h-auto py-3"
            onClick={handleCopyLink}
          >
            <LinkIcon className="h-5 w-5" />
            <span className="text-xs">Copy Link</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
