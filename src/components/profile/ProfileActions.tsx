import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Share2, Edit, X, Save } from "lucide-react";

interface ProfileActionsProps {
  isOwnProfile: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ProfileActions = ({ 
  isOwnProfile, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel 
}: ProfileActionsProps) => {
  return (
    <motion.div 
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="flex gap-3"
    >
      {!isOwnProfile && (
        <Button 
          className="bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-accent hover:to-luxury-primary text-white px-8 py-6 rounded-xl text-lg font-medium
          relative overflow-hidden group transition-all duration-300"
        >
          <span className="relative z-10">Follow</span>
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-accent to-luxury-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Button>
      )}
      {isOwnProfile && !isEditing && (
        <Button
          variant="outline"
          className="border-luxury-primary/20 bg-luxury-darker/40 hover:bg-luxury-primary/20 transition-all duration-300"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      )}
      {isEditing && (
        <>
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-luxury-primary/20 bg-luxury-darker/40 hover:bg-luxury-primary/20"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={onSave}
            className="bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-accent hover:to-luxury-primary"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </>
      )}
      <Button 
        variant="outline" 
        size="icon" 
        className="w-14 h-14 rounded-xl border-luxury-primary/20 bg-luxury-darker/40 hover:bg-luxury-primary/20 transition-all duration-300"
      >
        <Share2 className="h-5 w-5" />
      </Button>
    </motion.div>
  );
};