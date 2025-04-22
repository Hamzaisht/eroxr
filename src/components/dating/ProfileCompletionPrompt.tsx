
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Info, Check, ChevronRight } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { DatingAd } from "../ads/types/dating";

interface ProfileCompletionPromptProps {
  userProfile: DatingAd | null;
}

export const ProfileCompletionPrompt = ({ userProfile }: ProfileCompletionPromptProps) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const session = useSession();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  if (!session || !userProfile || isDismissed || (userProfile.profile_completion_score || 0) >= 80) {
    return null;
  }
  
  const score = userProfile.profile_completion_score || 0;
  const missingItems: {label: string; completed: boolean}[] = [
    { label: "Profile photo", completed: !!userProfile.avatar_url },
    { label: "Video introduction", completed: !!userProfile.video_url },
    { label: "About me", completed: !!userProfile.about_me },
    { label: "Interests", completed: !!(userProfile.interests && userProfile.interests.length > 0) },
    { label: "What I'm seeking", completed: !!userProfile.seeking_description },
  ];
  
  const incompleteItems = missingItems.filter(item => !item.completed);
  
  const handleEditProfile = () => {
    toast({
      title: "Let's complete your profile",
      description: "Higher completion scores get up to 5x more views!",
      duration: 3000,
    });
    navigate("/profile/edit");
  };
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-luxury-darker/60 backdrop-blur-md rounded-xl border border-luxury-primary/20 p-4 mb-6"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-luxury-primary" />
            <h3 className="text-lg font-medium text-white">Complete Your Profile</h3>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsDismissed(true)}
            className="text-luxury-neutral hover:text-white"
          >
            Dismiss
          </Button>
        </div>
        
        <div className="mt-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-luxury-neutral">Profile completion</span>
            <span className="text-sm font-medium text-luxury-primary">{score}%</span>
          </div>
          <Progress value={score} className="h-2" />
        </div>
        
        <div className="mt-4 space-y-2">
          {incompleteItems.slice(0, 3).map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-luxury-neutral">
              <div className="h-4 w-4 rounded-full border border-luxury-primary/30 flex items-center justify-center">
                {item.completed ? (
                  <Check className="h-3 w-3 text-luxury-primary" />
                ) : null}
              </div>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        
        <Button
          className="w-full mt-4 bg-gradient-to-r from-luxury-primary to-luxury-accent text-white"
          onClick={handleEditProfile}
        >
          Complete Profile <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
        
        <p className="text-xs text-luxury-neutral/70 mt-2 text-center">
          Complete profiles get up to 5x more views and matches!
        </p>
      </motion.div>
    </AnimatePresence>
  );
};
