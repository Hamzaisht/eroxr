
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Copy, Facebook, Twitter, Instagram, Link, MessageSquare } from "lucide-react";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  erosId: string;
}

export const ShareDialog = ({
  open,
  onOpenChange,
  erosId
}: ShareDialogProps) => {
  const { toast } = useToast();
  const shareUrl = `https://app.com/eros/${erosId}`;
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied",
        description: "Share link copied to clipboard"
      });
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };
  
  const handleShare = (platform: string) => {
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://app.com/eros/${erosId}`)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://app.com/eros/${erosId}`)}&text=Check%20out%20this%20amazing%20content!`;
        break;
      case 'instagram':
        // Instagram doesn't have a web sharing API, so we'll just show a toast
        toast({
          title: "Instagram sharing",
          description: "To share on Instagram, copy the link and paste it in the app"
        });
        return;
      case 'message':
        if (navigator.share) {
          navigator.share({
            title: 'Check out this content!',
            url: `https://app.com/eros/${erosId}`
          }).catch(console.error);
        } else {
          toast({
            title: "Direct messaging",
            description: "Copy the link to share via direct message"
          });
        }
        return;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank');
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share this content</DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center space-x-2">
          <Input
            readOnly
            value={shareUrl}
            className="flex-1"
          />
          <Button variant="outline" size="icon" onClick={handleCopyLink}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-4 gap-4 mt-4">
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center h-20"
            onClick={() => handleShare('facebook')}
          >
            <Facebook className="h-8 w-8 mb-1" />
            <span className="text-xs">Facebook</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center h-20"
            onClick={() => handleShare('twitter')}
          >
            <Twitter className="h-8 w-8 mb-1" />
            <span className="text-xs">Twitter</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center h-20"
            onClick={() => handleShare('instagram')}
          >
            <Instagram className="h-8 w-8 mb-1" />
            <span className="text-xs">Instagram</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center h-20"
            onClick={() => handleShare('message')}
          >
            <MessageSquare className="h-8 w-8 mb-1" />
            <span className="text-xs">Message</span>
          </Button>
        </div>
        
        <div className="mt-4">
          <Button className="w-full" onClick={handleCopyLink}>
            <Link className="mr-2 h-4 w-4" />
            Copy Link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
