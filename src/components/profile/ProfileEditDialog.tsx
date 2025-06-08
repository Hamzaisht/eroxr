
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, MapPin, User, FileText, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProfileData {
  id: string;
  username: string;
  bio?: string;
  avatar_url?: string;
  banner_url?: string;
  location?: string;
}

interface ProfileEditDialogProps {
  profile: ProfileData;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ProfileEditDialog = ({ profile, isOpen, onClose, onSuccess }: ProfileEditDialogProps) => {
  const [formData, setFormData] = useState({
    username: profile.username || '',
    bio: profile.bio || '',
    location: profile.location || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          bio: formData.bio || null,
          location: formData.location || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-luxury-dark border border-luxury-primary/20 rounded-3xl shadow-luxury overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-luxury-primary/20 bg-gradient-to-r from-luxury-dark to-luxury-primary/10">
              <h2 className="text-3xl font-bold text-luxury-neutral flex items-center gap-3">
                <div className="w-8 h-8 bg-luxury-primary/20 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-luxury-primary" />
                </div>
                Edit Profile
              </h2>
              <Button
                onClick={onClose}
                variant="ghost"
                size="icon"
                className="text-luxury-muted hover:text-luxury-neutral hover:bg-luxury-primary/10 rounded-full transition-all duration-300"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
              {/* Username */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-luxury-neutral mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Username
                </label>
                <Input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  placeholder="Enter your username"
                  className="bg-luxury-dark/50 border-luxury-primary/30 text-luxury-neutral placeholder:text-luxury-muted focus:border-luxury-primary rounded-xl h-12"
                  required
                />
              </div>

              {/* Bio */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-luxury-neutral mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Bio
                </label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  maxLength={500}
                  className="bg-luxury-dark/50 border-luxury-primary/30 text-luxury-neutral placeholder:text-luxury-muted focus:border-luxury-primary resize-none rounded-xl"
                />
                <p className="text-xs text-luxury-muted">
                  {formData.bio.length}/500 characters
                </p>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-luxury-neutral mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Location
                </label>
                <Input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="Where are you based?"
                  className="bg-luxury-dark/50 border-luxury-primary/30 text-luxury-neutral placeholder:text-luxury-muted focus:border-luxury-primary rounded-xl h-12"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outline"
                  className="flex-1 border-luxury-primary/30 text-luxury-muted hover:bg-luxury-primary/10 hover:text-luxury-neutral rounded-xl h-12 font-semibold transition-all duration-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-button-gradient hover:bg-hover-gradient text-white rounded-xl h-12 font-semibold shadow-button hover:shadow-button-hover transition-all duration-300 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
