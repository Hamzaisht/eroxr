
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, User, MapPin, Heart, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import type { StudioProfile } from './types';

interface ProfileEditorProps {
  profile: StudioProfile;
  onUpdate: (updates: Partial<StudioProfile>) => void;
  isUpdating: boolean;
}

export const ProfileEditor = ({ profile, onUpdate, isUpdating }: ProfileEditorProps) => {
  const [formData, setFormData] = useState({
    username: profile.username || '',
    bio: profile.bio || '',
    location: profile.location || '',
    interests: profile.interests || []
  });
  
  const [newInterest, setNewInterest] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-8"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <User className="w-8 h-8 text-yellow-400" />
          <h2 className="text-3xl font-bold text-luxury-neutral">Edit Divine Profile</h2>
        </motion.div>
        <p className="text-luxury-muted text-lg">
          Craft your divine presence across the realm
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Username Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <label className="text-luxury-neutral font-semibold text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-yellow-400" />
            Divine Name
          </label>
          <Input
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            placeholder="Enter your divine name..."
            className="bg-luxury-darker/50 border-yellow-400/30 text-luxury-neutral placeholder:text-luxury-muted focus:border-yellow-400 text-lg py-3"
          />
        </motion.div>

        {/* Location Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <label className="text-luxury-neutral font-semibold text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-yellow-400" />
            Divine Realm
          </label>
          <Input
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Mount Olympus, Asgard, etc..."
            className="bg-luxury-darker/50 border-yellow-400/30 text-luxury-neutral placeholder:text-luxury-muted focus:border-yellow-400 text-lg py-3"
          />
        </motion.div>

        {/* Bio Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <label className="text-luxury-neutral font-semibold text-lg flex items-center gap-2">
            <Heart className="w-5 h-5 text-yellow-400" />
            Divine Biography
          </label>
          <Textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Share your divine story with mortals..."
            rows={4}
            className="bg-luxury-darker/50 border-yellow-400/30 text-luxury-neutral placeholder:text-luxury-muted focus:border-yellow-400 text-lg resize-none"
          />
        </motion.div>

        {/* Interests Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <label className="text-luxury-neutral font-semibold text-lg">
            Divine Skills & Interests
          </label>
          
          <div className="flex gap-2">
            <Input
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Add a skill or interest..."
              className="bg-luxury-darker/50 border-yellow-400/30 text-luxury-neutral placeholder:text-luxury-muted focus:border-yellow-400"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
            />
            <Button
              type="button"
              onClick={addInterest}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black px-6"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {formData.interests.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.interests.map((interest, index) => (
                <motion.div
                  key={interest}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Badge
                    variant="secondary"
                    className="bg-gradient-to-r from-yellow-400/20 to-luxury-primary/20 text-yellow-400 border-yellow-400/30 px-3 py-1 text-sm relative group"
                  >
                    {interest}
                    <button
                      type="button"
                      onClick={() => removeInterest(interest)}
                      className="ml-2 text-yellow-400/60 hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center pt-6"
        >
          <Button
            type="submit"
            disabled={isUpdating}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black px-12 py-4 text-lg font-semibold rounded-2xl shadow-2xl"
          >
            {isUpdating ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                Updating Divine Profile...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Divine Changes
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
};
