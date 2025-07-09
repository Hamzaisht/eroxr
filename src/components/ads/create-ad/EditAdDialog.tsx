import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DatingAd } from "@/types/dating";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { useInstantFeedback } from "@/hooks/useInstantFeedback";

interface EditAdDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ad: DatingAd;
  onSuccess: () => void;
}

export const EditAdDialog = ({ open, onOpenChange, ad, onSuccess }: EditAdDialogProps) => {
  const [title, setTitle] = useState(ad.title || "");
  const [description, setDescription] = useState(ad.description || "");
  const [interests, setInterests] = useState<string[]>(ad.tags || []);
  const [newInterest, setNewInterest] = useState("");
  const { withInstantFeedback, isProcessing } = useInstantFeedback();

  useEffect(() => {
    if (open) {
      setTitle(ad.title || "");
      setDescription(ad.description || "");
      setInterests(ad.tags || []);
      setNewInterest("");
    }
  }, [open, ad]);

  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await withInstantFeedback(
      async () => {
        const { error } = await supabase
          .from('dating_ads')
          .update({
            title: title.trim(),
            description: description.trim(),
            tags: interests,
            updated_at: new Date().toISOString()
          })
          .eq('id', ad.id);

        if (error) throw error;
        
        onSuccess();
      },
      {
        successMessage: "Your ad has been updated successfully",
        errorMessage: "Failed to update ad. Please try again.",
        showInstantSuccess: true,
        onSuccess: () => {
          onOpenChange(false);
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-luxury-darker border-luxury-primary/20">
        <DialogHeader>
          <DialogTitle className="text-xl text-luxury-neutral">Edit Ad</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-luxury-neutral mb-2">
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a catchy title..."
              className="bg-luxury-dark border-luxury-neutral/20 text-white"
              maxLength={100}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-luxury-neutral mb-2">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell others about yourself..."
              className="bg-luxury-dark border-luxury-neutral/20 text-white min-h-[100px]"
              maxLength={500}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-luxury-neutral mb-2">
              Interests
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Add an interest..."
                className="bg-luxury-dark border-luxury-neutral/20 text-white"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
              />
              <Button
                type="button"
                onClick={addInterest}
                size="icon"
                className="bg-luxury-primary hover:bg-luxury-primary/80"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <Badge
                  key={interest}
                  variant="secondary"
                  className="bg-luxury-primary/20 text-luxury-neutral hover:bg-luxury-primary/30 cursor-pointer"
                  onClick={() => removeInterest(interest)}
                >
                  {interest}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-luxury-neutral/30 text-luxury-neutral hover:bg-luxury-neutral/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isProcessing || !title.trim() || !description.trim()}
              className="bg-luxury-primary hover:bg-luxury-primary/80 text-white"
            >
              {isProcessing ? "Updating..." : "Update Ad"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};