
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CreateDatingAdDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdCreationSuccess?: () => void;
}

export function CreateDatingAdDialog({ isOpen, onClose, onAdCreationSuccess }: CreateDatingAdDialogProps) {
  const handleGetStarted = () => {
    // Navigate to the dating ad creation page/flow
    if (onAdCreationSuccess) {
      onAdCreationSuccess();
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-luxury-darker border-luxury-neutral/20">
        <DialogHeader>
          <DialogTitle className="text-luxury-neutral">
            Create New Dating Ad
          </DialogTitle>
          <DialogDescription>
            Share your profile and connect with others in the community.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-luxury-neutral">
            To create a dating ad, you'll need to complete your profile with information about yourself, 
            what you're looking for, and upload photos or videos.
          </p>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleGetStarted}>
            Get Started
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
