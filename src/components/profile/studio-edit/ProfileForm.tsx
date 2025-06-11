
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { User, MapPin, FileText, Sparkles } from "lucide-react";

interface ProfileFormProps {
  formData: {
    username: string;
    bio: string;
    location: string;
  };
  onInputChange: (field: string, value: string) => void;
  isLoading: boolean;
}

export const ProfileForm = ({ formData, onInputChange, isLoading }: ProfileFormProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-6 rounded-2xl bg-gradient-to-br from-luxury-darker/40 to-luxury-dark/40 border border-luxury-primary/10 backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="w-5 h-5 text-luxury-accent" />
        <h3 className="text-xl font-bold text-luxury-neutral">Your Divine Identity</h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="username" className="text-luxury-neutral flex items-center gap-2 mb-2">
            <User className="w-4 h-4" />
            Sacred Name
          </Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) => onInputChange('username', e.target.value)}
            className="bg-luxury-darker/50 border-luxury-primary/20 text-luxury-neutral rounded-xl h-12 focus:border-luxury-primary/40"
            placeholder="Your divine moniker..."
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="location" className="text-luxury-neutral flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4" />
            Realm of Origin
          </Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => onInputChange('location', e.target.value)}
            className="bg-luxury-darker/50 border-luxury-primary/20 text-luxury-neutral rounded-xl h-12 focus:border-luxury-primary/40"
            placeholder="From which realm do you hail?"
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="bio" className="text-luxury-neutral flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4" />
            Divine Chronicles
          </Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => onInputChange('bio', e.target.value)}
            className="bg-luxury-darker/50 border-luxury-primary/20 text-luxury-neutral min-h-[120px] rounded-xl focus:border-luxury-primary/40"
            placeholder="Tell your divine story to mortals and gods alike..."
            maxLength={500}
            disabled={isLoading}
          />
          <div className="text-xs text-luxury-muted text-right mt-2">
            {formData.bio.length}/500 divine characters
          </div>
        </div>
      </div>
    </motion.div>
  );
};
