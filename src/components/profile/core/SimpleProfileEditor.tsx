
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2 } from 'lucide-react';
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
  const { profile, updateProfile, loading } = useSimpleProfile(profileId);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState<Partial<SimpleProfile>>({
    username: profile?.username || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
    interests: profile?.interests || []
  });
  const [newInterest, setNewInterest] = useState('');
  const { toast } = useToast();

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-2xl mx-auto"
    >
      <div className="space-y-4">
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
  );
};
