
import { Button } from "@/components/ui/button";
import { Edit3, UserPlus, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

interface ProfileHeaderProps {
  profile: any;
  isOwnProfile: boolean;
  onEdit: () => void;
}

export const ProfileHeaderActions = ({ profile, isOwnProfile, onEdit }: ProfileHeaderProps) => {
  if (!isOwnProfile) {
    return (
      <div className="flex items-center gap-3">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            className="bg-luxury-primary hover:bg-luxury-primary/90 text-white px-6 py-2 rounded-xl font-semibold shadow-luxury hover:shadow-luxury-hover transition-all duration-300"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Follow
          </Button>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            variant="outline"
            className="border-luxury-primary/30 text-luxury-neutral hover:bg-luxury-primary/10 px-6 py-2 rounded-xl font-semibold transition-all duration-300"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Message
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        onClick={onEdit}
        className="bg-luxury-primary/20 hover:bg-luxury-primary/30 text-luxury-primary border border-luxury-primary/30 hover:border-luxury-primary/50 px-6 py-2 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm"
      >
        <Edit3 className="h-4 w-4 mr-2" />
        Edit Profile
      </Button>
    </motion.div>
  );
};
