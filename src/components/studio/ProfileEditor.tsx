
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { User, FileText, MapPin, Tag, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import type { StudioProfile } from './types';

const profileSchema = z.object({
  username: z.string().min(1, "Username is required").max(50, "Username too long"),
  bio: z.string().max(500, "Bio must be 500 characters or less").optional(),
  location: z.string().max(100, "Location must be 100 characters or less").optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileEditorProps {
  profile: StudioProfile;
  onUpdate: (updates: Partial<StudioProfile>) => void;
  isUpdating: boolean;
}

export const ProfileEditor = ({ profile, onUpdate, isUpdating }: ProfileEditorProps) => {
  const [interests, setInterests] = useState<string[]>(profile.interests || []);
  const [newInterest, setNewInterest] = useState('');

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile.username || '',
      bio: profile.bio || '',
      location: profile.location || '',
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    onUpdate({
      ...data,
      interests,
    });
  };

  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim()) && interests.length < 10) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Username */}
        <div className="space-y-2">
          <Label htmlFor="username" className="text-luxury-neutral flex items-center gap-2">
            <User className="w-4 h-4" />
            Username
          </Label>
          <Input
            id="username"
            {...form.register("username")}
            className="bg-luxury-darker/50 border-luxury-primary/20 text-luxury-neutral rounded-xl h-12 focus:border-luxury-primary/40"
            placeholder="Enter your username"
            disabled={isUpdating}
          />
          {form.formState.errors.username && (
            <p className="text-red-400 text-sm">{form.formState.errors.username.message}</p>
          )}
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio" className="text-luxury-neutral flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Bio
          </Label>
          <Textarea
            id="bio"
            {...form.register("bio")}
            className="bg-luxury-darker/50 border-luxury-primary/20 text-luxury-neutral min-h-[120px] rounded-xl focus:border-luxury-primary/40"
            placeholder="Tell the world about yourself..."
            maxLength={500}
            disabled={isUpdating}
          />
          <div className="text-xs text-luxury-muted text-right">
            {form.watch("bio")?.length || 0}/500 characters
          </div>
          {form.formState.errors.bio && (
            <p className="text-red-400 text-sm">{form.formState.errors.bio.message}</p>
          )}
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location" className="text-luxury-neutral flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Location
          </Label>
          <Input
            id="location"
            {...form.register("location")}
            className="bg-luxury-darker/50 border-luxury-primary/20 text-luxury-neutral rounded-xl h-12 focus:border-luxury-primary/40"
            placeholder="Where are you based?"
            disabled={isUpdating}
          />
          {form.formState.errors.location && (
            <p className="text-red-400 text-sm">{form.formState.errors.location.message}</p>
          )}
        </div>

        {/* Interests */}
        <div className="space-y-4">
          <Label className="text-luxury-neutral flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Interests & Skills
          </Label>
          
          <div className="flex gap-2">
            <Input
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
              placeholder="Add an interest..."
              className="bg-luxury-darker/50 border-luxury-primary/20 text-luxury-neutral rounded-xl h-10 focus:border-luxury-primary/40"
              disabled={isUpdating || interests.length >= 10}
            />
            <Button
              type="button"
              onClick={addInterest}
              disabled={!newInterest.trim() || interests.length >= 10}
              className="px-4 h-10 bg-luxury-primary/20 hover:bg-luxury-primary/30 text-luxury-primary rounded-xl"
            >
              Add
            </Button>
          </div>

          {interests.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, index) => (
                <motion.div
                  key={interest}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Badge
                    variant="secondary"
                    className="bg-luxury-primary/10 text-luxury-primary border-luxury-primary/20 px-3 py-1 cursor-pointer hover:bg-luxury-primary/20"
                    onClick={() => removeInterest(interest)}
                  >
                    {interest} ×
                  </Badge>
                </motion.div>
              ))}
            </div>
          )}
          
          <p className="text-xs text-luxury-muted">
            {interests.length}/10 interests • Click to remove
          </p>
        </div>

        {/* Submit Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            type="submit"
            disabled={isUpdating}
            className="w-full bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-primary/90 hover:to-luxury-accent/90 text-white rounded-xl h-12 font-semibold"
          >
            {isUpdating ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mr-2"
              >
                <Save className="w-4 h-4" />
              </motion.div>
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
};
