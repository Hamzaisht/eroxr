import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { GlassmorphicCard } from '../components/GlassmorphicCard';
import { StepProps } from '../types';
import { Heart, Users, Star, Coffee, Music, Camera, Gamepad2, Book, Plane, Dumbbell } from 'lucide-react';

const LOOKING_FOR_OPTIONS = [
  'Female Looking for Male (F4M)',
  'Male Looking for Couple (M4MF)', 
  'Female Looking for Couple (F4MF)',
  'Looking for Female (F)',
  'Couple Looking for Threesome (MF4M)',
  'Couple Looking for Threesome (MF4F)',
  'Looking for Anyone (A)',
  'Couple looking for Couple (MF4MF)',
  'Couple looking for orgy (MF4MF+)',
  'Couple looking for Audience (MF4AU)',
  'Male looking for Male (M4M)',
  'Female looking for Female (F4F)',
  'Female looking for Massage',
  'Female looking for Audience (online/offline)',
  'Couple looking for Audience (Online/Offline)',
  'Male looking for Audience (online/offline)',
  'Other Looking for Other'
];

const INTEREST_OPTIONS = [
  { label: 'Movies', icon: Camera },
  { label: 'Music', icon: Music },
  { label: 'Gaming', icon: Gamepad2 },
  { label: 'Reading', icon: Book },
  { label: 'Travel', icon: Plane },
  { label: 'Fitness', icon: Dumbbell },
  { label: 'Coffee', icon: Coffee },
  { label: 'Photography', icon: Camera },
];

export const PreferencesStep = ({ data, updateData, onNext, onPrevious }: StepProps) => {
  const toggleLookingFor = (option: string) => {
    const updated = data.lookingFor.includes(option)
      ? data.lookingFor.filter(item => item !== option)
      : [...data.lookingFor, option];
    updateData({ lookingFor: updated });
  };

  const toggleInterest = (interest: string) => {
    const updated = data.interests.includes(interest)
      ? data.interests.filter(item => item !== interest)
      : [...data.interests, interest];
    updateData({ interests: updated });
  };

  const handleNext = () => {
    if (data.lookingFor.length > 0 && data.interests.length > 0) {
      onNext();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <motion.h2 
          className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          What are you looking for?
        </motion.h2>
        <motion.p 
          className="text-base text-white/70"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Help us match you with the right people
        </motion.p>
      </div>

      <div className="grid gap-4">
        {/* Looking For */}
        <GlassmorphicCard variant="gradient" hoverable>
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-5 h-5 text-pink-400" />
              <h3 className="text-white/90 font-medium">I'm looking for</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {LOOKING_FOR_OPTIONS.map((option) => (
                <Badge
                  key={option}
                  variant={data.lookingFor.includes(option) ? "default" : "outline"}
                  className={`cursor-pointer transition-all duration-300 ${
                    data.lookingFor.includes(option)
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent hover:shadow-lg'
                      : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20'
                  }`}
                  onClick={() => toggleLookingFor(option)}
                >
                  {option}
                </Badge>
              ))}
            </div>
          </div>
        </GlassmorphicCard>

        {/* Interests */}
        <GlassmorphicCard variant="gradient" hoverable>
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 text-yellow-400" />
              <h3 className="text-white/90 font-medium">My interests</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {INTEREST_OPTIONS.map((interest) => {
                const Icon = interest.icon;
                const isSelected = data.interests.includes(interest.label);
                return (
                  <motion.button
                    key={interest.label}
                    onClick={() => toggleInterest(interest.label)}
                    className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                      isSelected
                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400 text-white'
                        : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10 hover:border-white/30'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">{interest.label}</div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </GlassmorphicCard>

        {/* Tags Input */}
        <GlassmorphicCard variant="gradient" hoverable>
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-blue-400" />
              <h3 className="text-white/90 font-medium">Additional tags</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Adventurous', 'Creative', 'Romantic', 'Ambitious', 'Funny', 'Intellectual', 'Spiritual', 'Athletic'].map((tag) => (
                <Badge
                  key={tag}
                  variant={data.tags.includes(tag) ? "default" : "outline"}
                  className={`cursor-pointer transition-all duration-300 ${
                    data.tags.includes(tag)
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-transparent'
                      : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20'
                  }`}
                  onClick={() => {
                    const updated = data.tags.includes(tag)
                      ? data.tags.filter(t => t !== tag)
                      : [...data.tags, tag];
                    updateData({ tags: updated });
                  }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </GlassmorphicCard>
      </div>

      {/* Navigation */}
      <motion.div 
        className="flex justify-between pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          onClick={onPrevious}
          className="px-6 py-3 text-white/70 hover:text-white transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Back
        </motion.button>

        <motion.button
          onClick={handleNext}
          disabled={data.lookingFor.length === 0 || data.interests.length === 0}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:scale-105"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Continue to Media
        </motion.button>
      </motion.div>
    </motion.div>
  );
};