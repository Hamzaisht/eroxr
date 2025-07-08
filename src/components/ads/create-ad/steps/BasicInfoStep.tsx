import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GlassmorphicCard } from '../components/GlassmorphicCard';
import { StepProps } from '../types';
import { MapPin, User, Calendar } from 'lucide-react';

export const BasicInfoStep = ({ data, updateData, onNext }: StepProps) => {
  const handleNext = () => {
    if (data.title && data.description && data.location && data.age) {
      onNext();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center space-y-4">
        <motion.h2 
          className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Tell us about yourself
        </motion.h2>
        <motion.p 
          className="text-lg text-white/70"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Let's start with the basics to create your amazing profile
        </motion.p>
      </div>

      <div className="grid gap-6">
        {/* Title Field */}
        <GlassmorphicCard variant="gradient" hoverable>
          <div className="p-6 space-y-3">
            <Label htmlFor="title" className="text-white/90 font-medium flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile Title
            </Label>
            <Input
              id="title"
              value={data.title}
              onChange={(e) => updateData({ title: e.target.value })}
              placeholder="e.g., Adventurous soul seeking connection..."
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400/30 transition-all duration-300"
            />
          </div>
        </GlassmorphicCard>

        {/* Description Field */}
        <GlassmorphicCard variant="gradient" hoverable>
          <div className="p-6 space-y-3">
            <Label htmlFor="description" className="text-white/90 font-medium">
              About You
            </Label>
            <Textarea
              id="description"
              value={data.description}
              onChange={(e) => updateData({ description: e.target.value })}
              placeholder="Share what makes you unique and what you're looking for..."
              rows={4}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400/30 transition-all duration-300 resize-none"
            />
          </div>
        </GlassmorphicCard>

        {/* Location and Age Row */}
        <div className="grid md:grid-cols-2 gap-6">
          <GlassmorphicCard variant="gradient" hoverable>
            <div className="p-6 space-y-3">
              <Label htmlFor="location" className="text-white/90 font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </Label>
              <Input
                id="location"
                value={data.location}
                onChange={(e) => updateData({ location: e.target.value })}
                placeholder="e.g., Copenhagen, Denmark"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400/30 transition-all duration-300"
              />
            </div>
          </GlassmorphicCard>

          <GlassmorphicCard variant="gradient" hoverable>
            <div className="p-6 space-y-3">
              <Label htmlFor="age" className="text-white/90 font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Age
              </Label>
              <Select value={data.age.toString()} onValueChange={(value) => updateData({ age: parseInt(value) })}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400/30">
                  <SelectValue placeholder="Select your age" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/20 backdrop-blur-xl">
                  {Array.from({ length: 65 }, (_, i) => i + 18).map((age) => (
                    <SelectItem key={age} value={age.toString()} className="text-white hover:bg-white/10">
                      {age} years old
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </GlassmorphicCard>
        </div>

        {/* Personal Details Row */}
        <div className="grid md:grid-cols-3 gap-6">
          <GlassmorphicCard variant="gradient" hoverable>
            <div className="p-6 space-y-3">
              <Label className="text-white/90 font-medium">Gender</Label>
              <Select value={data.gender} onValueChange={(value: any) => updateData({ gender: value })}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/20 backdrop-blur-xl">
                  <SelectItem value="male" className="text-white hover:bg-white/10">Male</SelectItem>
                  <SelectItem value="female" className="text-white hover:bg-white/10">Female</SelectItem>
                  <SelectItem value="non-binary" className="text-white hover:bg-white/10">Non-binary</SelectItem>
                  <SelectItem value="other" className="text-white hover:bg-white/10">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </GlassmorphicCard>

          <GlassmorphicCard variant="gradient" hoverable>
            <div className="p-6 space-y-3">
              <Label className="text-white/90 font-medium">Body Type</Label>
              <Select value={data.bodyType} onValueChange={(value: any) => updateData({ bodyType: value })}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/20 backdrop-blur-xl">
                  <SelectItem value="slim" className="text-white hover:bg-white/10">Slim</SelectItem>
                  <SelectItem value="average" className="text-white hover:bg-white/10">Average</SelectItem>
                  <SelectItem value="athletic" className="text-white hover:bg-white/10">Athletic</SelectItem>
                  <SelectItem value="curvy" className="text-white hover:bg-white/10">Curvy</SelectItem>
                  <SelectItem value="plus-size" className="text-white hover:bg-white/10">Plus Size</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </GlassmorphicCard>

          <GlassmorphicCard variant="gradient" hoverable>
            <div className="p-6 space-y-3">
              <Label className="text-white/90 font-medium">Relationship Status</Label>
              <Select value={data.relationshipStatus} onValueChange={(value: any) => updateData({ relationshipStatus: value })}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/20 backdrop-blur-xl">
                  <SelectItem value="single" className="text-white hover:bg-white/10">Single</SelectItem>
                  <SelectItem value="taken" className="text-white hover:bg-white/10">Taken</SelectItem>
                  <SelectItem value="complicated" className="text-white hover:bg-white/10">It's Complicated</SelectItem>
                  <SelectItem value="open" className="text-white hover:bg-white/10">Open Relationship</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </GlassmorphicCard>
        </div>
      </div>

      {/* Next Button */}
      <motion.div 
        className="flex justify-end pt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          onClick={handleNext}
          disabled={!data.title || !data.description || !data.location || !data.age}
          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:scale-105"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Continue to Preferences
        </motion.button>
      </motion.div>
    </motion.div>
  );
};