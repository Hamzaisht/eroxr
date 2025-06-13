
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, User, MapPin, MessageSquare, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-8 max-w-2xl mx-auto p-6"
    >
      {/* Username */}
      <div className="space-y-3">
        <Label htmlFor="username" className="text-luxury-neutral font-semibold flex items-center gap-2">
          <User className="w-4 h-4" />
          Username
        </Label>
        <Input
          id="username"
          value={formData.username}
          onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
          placeholder="Enter your username"
          className="bg-luxury-darker/50 border-luxury-primary/20 focus:border-luxury-primary/50 text-luxury-neutral"
        />
      </div>

      {/* Bio */}
      <div className="space-y-3">
        <Label htmlFor="bio" className="text-luxury-neutral font-semibold flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Bio
        </Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
          placeholder="Tell us about yourself..."
          rows={4}
          className="bg-luxury-darker/50 border-luxury-primary/20 focus:border-luxury-primary/50 text-luxury-neutral resize-none"
        />
      </div>

      {/* Location */}
      <div className="space-y-3">
        <Label htmlFor="location" className="text-luxury-neutral font-semibold flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Location
        </Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
          placeholder="Where are you located?"
          className="bg-luxury-darker/50 border-luxury-primary/20 focus:border-luxury-primary/50 text-luxury-neutral"
        />
      </div>

      {/* Interests */}
      <div className="space-y-3">
        <Label className="text-luxury-neutral font-semibold flex items-center gap-2">
          <Tag className="w-4 h-4" />
          Interests & Skills
        </Label>
        
        {/* Current Interests */}
        {formData.interests.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.interests.map((interest, index) => (
              <motion.div
                key={interest}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Badge
                  variant="secondary"
                  className="bg-luxury-primary/10 text-luxury-primary border-luxury-primary/20 px-3 py-1 cursor-pointer hover:bg-red-500/10 hover:text-red-400 hover:border-red-400/20 transition-colors"
                  onClick={() => removeInterest(interest)}
                >
                  {interest} ×
                </Badge>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add New Interest */}
        <div className="flex gap-2">
          <Input
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            placeholder="Add an interest..."
            className="bg-luxury-darker/50 border-luxury-primary/20 focus:border-luxury-primary/50 text-luxury-neutral"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
          />
          <Button
            type="button"
            onClick={addInterest}
            variant="outline"
            className="border-luxury-primary/30 text-luxury-primary hover:bg-luxury-primary/10"
          >
            Add
          </Button>
        </div>
      </div>

      {/* Submit Button */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="pt-6"
      >
        <Button
          type="submit"
          disabled={isUpdating}
          className="w-full bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-primary/90 hover:to-luxury-accent/90 text-white font-semibold py-3 rounded-2xl transition-all duration-300"
        >
          {isUpdating ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Updating Profile...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </div>
          )}
        </Button>
      </motion.div>
    </motion.form>
  );
};
