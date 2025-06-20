
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, User, MapPin, Heart, Plus, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useSimpleProfile, SimpleProfile } from './SimpleProfileData';

interface SimpleProfileEditorProps {
  profileId: string;
  onClose: () => void;
}

export const SimpleProfileEditor = ({ profileId, onClose }: SimpleProfileEditorProps) => {
  const { profile, loading, updateProfile } = useSimpleProfile(profileId);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newInterest, setNewInterest] = useState('');
  
  const [formData, setFormData] = useState({
    username: profile?.username || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
    interests: profile?.interests || []
  });

  // Update form when profile loads
  useState(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        bio: profile.bio || '',
        location: profile.location || '',
        interests: profile.interests || []
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await updateProfile(formData);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully!",
      });
      
      onClose();
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData({
        ...formData,
        interests: [...formData.interests, newInterest.trim()]
      });
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter(i => i !== interest)
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-slate-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-100 mb-2">Edit Profile</h2>
        <p className="text-slate-400 text-lg">Update your profile information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Username Field */}
        <div className="space-y-2">
          <label className="text-slate-200 font-semibold flex items-center gap-2">
            <User className="w-4 h-4" />
            Username
          </label>
          <Input
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            placeholder="Enter your username..."
            className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-slate-500"
          />
        </div>

        {/* Location Field */}
        <div className="space-y-2">
          <label className="text-slate-200 font-semibold flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Location
          </label>
          <Input
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Where are you located?"
            className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-slate-500"
          />
        </div>

        {/* Bio Field */}
        <div className="space-y-2">
          <label className="text-slate-200 font-semibold flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Bio
          </label>
          <Textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Tell us about yourself..."
            rows={4}
            className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-slate-500 resize-none"
          />
        </div>

        {/* Interests Field */}
        <div className="space-y-4">
          <label className="text-slate-200 font-semibold">Interests</label>
          
          <div className="flex gap-2">
            <Input
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Add an interest..."
              className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-slate-500"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
            />
            <Button
              type="button"
              onClick={addInterest}
              className="bg-slate-600 hover:bg-slate-700 text-white px-4"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {formData.interests.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.interests.map((interest, index) => (
                <Badge
                  key={interest}
                  variant="secondary"
                  className="bg-slate-700/20 text-slate-300 border-slate-600/30 px-3 py-1 text-sm"
                >
                  {interest}
                  <button
                    type="button"
                    onClick={() => removeInterest(interest)}
                    className="ml-2 text-slate-400/60 hover:text-red-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};
