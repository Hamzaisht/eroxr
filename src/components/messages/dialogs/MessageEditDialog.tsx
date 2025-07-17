import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface MessageEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  message: {
    id: string;
    content: string;
  } | null;
  onSave: (messageId: string, newContent: string) => Promise<void>;
}

export const MessageEditDialog = ({
  isOpen,
  onClose,
  message,
  onSave
}: MessageEditDialogProps) => {
  const [editedContent, setEditedContent] = useState(message?.content || '');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!message || !editedContent.trim()) return;

    setIsLoading(true);
    try {
      await onSave(message.id, editedContent.trim());
      toast({
        title: "Message updated",
        description: "Your message has been updated successfully",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      setEditedContent(message?.content || '');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-black/90 border-white/20 backdrop-blur-xl text-white">
        <DialogHeader>
          <DialogTitle>Edit Message</DialogTitle>
          <DialogDescription className="text-white/60">
            Make changes to your message below.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            placeholder="Type your message..."
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 resize-none"
            rows={4}
          />
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => handleOpenChange(false)}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!editedContent.trim() || isLoading}
            className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};