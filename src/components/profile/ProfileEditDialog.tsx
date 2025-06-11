
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProfileEditDialogProps {
  profile: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ProfileEditDialog = ({ profile, isOpen, onClose, onSuccess }: ProfileEditDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: profile?.username || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          bio: formData.bio,
          location: formData.location,
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-luxury-dark border border-luxury-primary/20">
        <DialogHeader>
          <DialogTitle className="text-luxury-neutral">Edit Profile</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-luxury-neutral">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className="bg-luxury-darker border-luxury-primary/20 text-luxury-neutral"
              placeholder="Enter your username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-luxury-neutral">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              className="bg-luxury-darker border-luxury-primary/20 text-luxury-neutral min-h-[100px]"
              placeholder="Tell us about yourself..."
              maxLength={500}
            />
            <div className="text-xs text-luxury-muted text-right">
              {formData.bio.length}/500 characters
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-luxury-neutral">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="bg-luxury-darker border-luxury-primary/20 text-luxury-neutral"
              placeholder="Where are you located?"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-luxury-primary/30 text-luxury-primary hover:bg-luxury-primary/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-luxury-primary hover:bg-luxury-primary/90 text-white"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
