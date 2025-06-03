
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, MapPin, User, FileText, Save } from "lucide-react";
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

interface ProfileEditModalProps {
  profile: ProfileData;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ProfileEditModal = ({ profile, isOpen, onClose, onSuccess }: ProfileEditModalProps) => {
  const [formData, setFormData] = useState({
    username: profile.username || '',
    bio: profile.bio || '',
    location: profile.location || '',
    avatar_url: profile.avatar_url || '',
    banner_url: profile.banner_url || ''
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
          avatar_url: formData.avatar_url || null,
          banner_url: formData.banner_url || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
      onSuccess();
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
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-slate-700/50 bg-gradient-to-r from-slate-800 to-slate-900">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                Edit Profile
              </h2>
              <Button
                onClick={onClose}
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all duration-300"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
              {/* Avatar Section */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Camera className="w-4 h-4 inline mr-2" />
                  Profile Picture URL
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 p-0.5 flex-shrink-0">
                    <div className="w-full h-full rounded-full overflow-hidden bg-slate-800">
                      {formData.avatar_url ? (
                        <img 
                          src={formData.avatar_url} 
                          alt="Avatar preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-6 h-6 text-slate-400" />
                        </div>
                      )}
                    </div>
                  </div>
                  <Input
                    type="url"
                    value={formData.avatar_url}
                    onChange={(e) => handleChange('avatar_url', e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="flex-1 bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-400 rounded-xl"
                  />
                </div>
              </div>

              {/* Banner Section */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Camera className="w-4 h-4 inline mr-2" />
                  Banner URL
                </label>
                <Input
                  type="url"
                  value={formData.banner_url}
                  onChange={(e) => handleChange('banner_url', e.target.value)}
                  placeholder="https://example.com/banner.jpg"
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-400 rounded-xl"
                />
                <p className="text-xs text-slate-400">
                  Supports images and videos. Recommended size: 1500x500px
                </p>
              </div>

              {/* Username */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Username
                </label>
                <Input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  placeholder="Enter your username"
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-400 rounded-xl"
                  required
                />
              </div>

              {/* Bio */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Bio
                </label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  maxLength={500}
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-400 resize-none rounded-xl"
                />
                <p className="text-xs text-slate-400">
                  {formData.bio.length}/500 characters
                </p>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Location
                </label>
                <Input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="Where are you based?"
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-400 rounded-xl"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outline"
                  className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl h-12 font-semibold transition-all duration-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl h-12 font-semibold shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
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
