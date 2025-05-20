
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SurveillanceContentItem } from "@/types/surveillance";
import { formatDistanceToNow } from "date-fns";

interface ContentDetailDialogProps {
  item: SurveillanceContentItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContentDetailDialog({ item, open, onOpenChange }: ContentDetailDialogProps) {
  const [actionNotes, setActionNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!item) return null;
  
  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "Unknown time";
    }
  };
  
  // Handle action submission
  const handleSubmitAction = async (action: string) => {
    setIsSubmitting(true);
    
    try {
      // Mock action handling
      console.log(`Taking action "${action}" on content ${item.id}:`, {
        notes: actionNotes,
        itemId: item.id,
        action
      });
      
      // In a real app, you would make an API call here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Close dialog after successful submission
      onOpenChange(false);
    } catch (error) {
      console.error("Error taking action:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Render media preview based on content type
  const renderMediaPreview = () => {
    switch (item.type) {
      case "image":
        return item.media_url && item.media_url[0] ? (
          <img 
            src={item.media_url[0]} 
            alt={item.title} 
            className="w-full h-64 object-contain bg-black/50 rounded-md"
          />
        ) : null;
      case "video":
        return item.video_url ? (
          <video 
            src={item.video_url} 
            controls 
            className="w-full h-64 object-contain bg-black/50 rounded-md"
          />
        ) : null;
      case "audio":
        return item.media_url && item.media_url[0] ? (
          <audio 
            src={item.media_url[0]} 
            controls 
            className="w-full mt-4"
          />
        ) : null;
      case "text":
        return (
          <div className="border rounded-md p-4 mt-2 bg-muted/20">
            <p className="whitespace-pre-wrap">{item.description}</p>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{item.title}</span>
            {item.flagged && <Badge variant="destructive">Flagged</Badge>}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Media Preview */}
          {renderMediaPreview()}
          
          {/* Content Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Creator</Label>
              <p>{item.creator_username || "Anonymous"}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Created</Label>
              <p>{formatRelativeTime(item.created_at)}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Content Type</Label>
              <p className="capitalize">{item.type}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Status</Label>
              <p className="capitalize">{item.status || "Pending"}</p>
            </div>
          </div>
          
          {/* Flag Reason */}
          {item.flagged && item.reason && (
            <div>
              <Label className="text-sm text-muted-foreground">Flag Reason</Label>
              <div className="border border-destructive/30 bg-destructive/10 rounded-md p-3 mt-1">
                {item.reason}
              </div>
            </div>
          )}
          
          {/* Action Notes */}
          <div>
            <Label htmlFor="action-notes">Notes</Label>
            <Textarea
              id="action-notes"
              placeholder="Add notes about this content..."
              value={actionNotes}
              onChange={(e) => setActionNotes(e.target.value)}
              className="mt-1"
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <div className="space-x-2">
              <Button 
                variant="destructive" 
                onClick={() => handleSubmitAction("remove")}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Remove Content"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleSubmitAction("warn")}
                disabled={isSubmitting}
              >
                Warn Creator
              </Button>
            </div>
            <div>
              <Button 
                variant="outline" 
                onClick={() => handleSubmitAction("approve")}
                disabled={isSubmitting}
              >
                Mark as Reviewed
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
