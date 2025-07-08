import { motion } from 'framer-motion';
import { GlassmorphicCard } from '../components/GlassmorphicCard';
import { StepProps } from '../types';
import { User, MapPin, Heart, Camera, Video, Check, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const ReviewStep = ({ data, onPrevious, isSubmitting, onSubmit }: StepProps & { 
  isSubmitting?: boolean; 
  onSubmit?: () => void; 
}) => {
  const handlePublish = () => {
    if (onSubmit) {
      onSubmit();
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
          Ready to go live?
        </motion.h2>
        <motion.p 
          className="text-base text-white/70"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Review your profile before publishing
        </motion.p>
      </div>

      <div className="grid gap-4">
        {/* Profile Preview */}
        <GlassmorphicCard variant="glow" hoverable>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              {data.profileImage && (
                <img
                  src={URL.createObjectURL(data.profileImage)}
                  alt="Profile"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-purple-400/50"
                />
              )}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">{data.title}</h3>
                <div className="flex items-center gap-2 text-white/70 text-sm mb-2">
                  <User className="w-4 h-4" />
                  <span>{data.age} years old • {data.gender}</span>
                </div>
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{data.location}</span>
                </div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-2">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <p className="text-xs text-white/60">Premium Profile</p>
              </div>
            </div>

            <p className="text-white/80 mb-4 leading-relaxed">{data.description}</p>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="text-white/90 font-medium mb-2 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-400" />
                  Looking for
                </h4>
                <div className="flex flex-wrap gap-1">
                  {data.lookingFor.map((item) => (
                    <Badge key={item} variant="outline" className="bg-white/10 text-white/80 border-white/20 text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-white/90 font-medium mb-2">Interests</h4>
                <div className="flex flex-wrap gap-1">
                  {data.interests.slice(0, 4).map((interest) => (
                    <Badge key={interest} variant="outline" className="bg-white/10 text-white/80 border-white/20 text-xs">
                      {interest}
                    </Badge>
                  ))}
                  {data.interests.length > 4 && (
                    <Badge variant="outline" className="bg-white/10 text-white/80 border-white/20 text-xs">
                      +{data.interests.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {data.tags.length > 0 && (
              <div className="mb-4">
                <h4 className="text-white/90 font-medium mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1">
                  {data.tags.map((tag) => (
                    <Badge key={tag} className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-200 border-blue-400/30 text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 text-sm text-white/60">
              {data.profileImage && (
                <div className="flex items-center gap-1">
                  <Camera className="w-4 h-4" />
                  <span>{1 + data.additionalImages.length} photos</span>
                </div>
              )}
              {data.profileVideo && (
                <div className="flex items-center gap-1">
                  <Video className="w-4 h-4" />
                  <span>Video included</span>
                </div>
              )}
            </div>
          </div>
        </GlassmorphicCard>

        {/* Profile Completion */}
        <GlassmorphicCard variant="gradient" hoverable>
          <div className="p-4">
            <h3 className="text-white/90 font-medium mb-3">Profile Completion</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">Basic Information</span>
                <Check className="w-4 h-4 text-green-400" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">Preferences</span>
                <Check className="w-4 h-4 text-green-400" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">Profile Photo</span>
                <Check className="w-4 h-4 text-green-400" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">Additional Media</span>
                {data.additionalImages.length > 0 || data.profileVideo ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <span className="text-yellow-400 text-xs">Optional</span>
                )}
              </div>
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
          disabled={isSubmitting}
          className="px-6 py-3 text-white/70 hover:text-white disabled:opacity-50 transition-all duration-300"
          whileHover={!isSubmitting ? { scale: 1.05 } : undefined}
          whileTap={!isSubmitting ? { scale: 0.95 } : undefined}
        >
          ← Back
        </motion.button>

        <motion.button
          onClick={handlePublish}
          disabled={isSubmitting}
          className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:scale-105"
          whileHover={!isSubmitting ? { scale: 1.05 } : undefined}
          whileTap={!isSubmitting ? { scale: 0.95 } : undefined}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Publishing...
            </div>
          ) : (
            'Publish Profile'
          )}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};