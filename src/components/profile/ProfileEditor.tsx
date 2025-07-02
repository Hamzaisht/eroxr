
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from './hooks/useProfile';
import { MediaUploader } from './MediaUploader';

interface ProfileEditorProps {
  profileId: string;
  onClose: () => void;
}

export const ProfileEditor = ({ profileId, onClose }: ProfileEditorProps) => {
  const { profile, updateProfile, loading } = useProfile(profileId);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    location: '',
    interests: [] as string[]
  });
  const [newInterest, setNewInterest] = useState('');
  const { toast } = useToast();

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        bio: profile.bio || '',
        location: profile.location || '',
        interests: profile.interests || []
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      setIsUpdating(true);
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
      setIsUpdating(false);
    }
  };

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests?.includes(newInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...(prev.interests || []), newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests?.filter(i => i !== interest) || []
    }));
  };

  const handleMediaUploadSuccess = (url: string, type: 'avatar' | 'banner') => {
    updateProfile({ [type === 'avatar' ? 'avatar_url' : 'banner_url']: url });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Edit Profile</h1>
            <p className="text-slate-400">Update your profile information</p>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </Button>
        </motion.div>

        {/* Media Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/30">
            <h3 className="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Profile Avatar
            </h3>
            <MediaUploader
              type="avatar"
              userId={profileId}
              currentUrl={profile?.avatar_url}
              onUploadSuccess={(url) => handleMediaUploadSuccess(url, 'avatar')}
            />
          </div>

          <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/30">
            <h3 className="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Profile Banner
            </h3>
            <MediaUploader
              type="banner"
              userId={profileId}
              currentUrl={profile?.banner_url}
              onUploadSuccess={(url) => handleMediaUploadSuccess(url, 'banner')}
            />
          </div>
        </motion.div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/30 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Username
            </label>
            <Input
              value={formData.username || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              placeholder="Enter your username"
              className="bg-slate-800/50 border-slate-600/30 text-slate-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Bio
            </label>
            <Textarea
              value={formData.bio || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell us about yourself..."
              rows={4}
              className="bg-slate-800/50 border-slate-600/30 text-slate-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Location
            </label>
            <Input
              value={formData.location || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Where are you located?"
              className="bg-slate-800/50 border-slate-600/30 text-slate-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Interests & Skills
            </label>
            <div className="flex gap-2 mb-3">
              <Input
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Add an interest..."
                className="bg-slate-800/50 border-slate-600/30 text-slate-200"
                onKeyPress={(e) => e.key === 'Enter' && addInterest()}
              />
              <Button
                onClick={addInterest}
                variant="outline"
                className="border-slate-600/30 text-slate-200"
              >
                Add
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {formData.interests?.map((interest, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-slate-700/50 text-slate-300 border-slate-600/20 cursor-pointer"
                  onClick={() => removeInterest(interest)}
                >
                  {interest} ×
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/30">
            <Button
              onClick={onClose}
              variant="outline"
              className="border-slate-600/30 text-slate-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isUpdating}
              className="bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
        </motion.div>
      </div>
    </div>
  );
};
