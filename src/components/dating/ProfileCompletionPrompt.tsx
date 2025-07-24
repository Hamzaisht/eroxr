import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "@supabase/auth-helpers-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Info, Check, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const ProfileCompletionPrompt = () => {
  const [isDismissed, setIsDismissed] = useState(false);
  const session = useSession();
  const { profile: userProfile } = useCurrentUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  if (!session || !userProfile || isDismissed) {
    return null;
  }
  
  // Calculate profile completion based on actual user data
  const completionItems: {label: string; completed: boolean; points: number}[] = [
    { label: "Profile photo", completed: !!userProfile.avatar_url, points: 15 },
    { label: "Banner image/video", completed: !!userProfile.banner_url, points: 10 },
    { label: "Bio description", completed: !!userProfile.bio && userProfile.bio.length > 20, points: 15 },
    { label: "Interests", completed: !!(userProfile.interests && userProfile.interests.length >= 2), points: 10 },
    { label: "Location details", completed: !!userProfile.location, points: 10 },
    { label: "Username", completed: !!userProfile.username, points: 10 },
    { label: "Profile verified", completed: !!userProfile.is_verified, points: 15 },
    { label: "Profile visibility", completed: userProfile.profile_visibility === true, points: 5 },
    { label: "Profile settings configured", completed: userProfile.profile_visibility === true, points: 10 }
  ];
  
  const completedItems = completionItems.filter(item => item.completed);
  const incompleteItems = completionItems.filter(item => !item.completed);
  const totalPoints = completionItems.reduce((total, item) => total + item.points, 0);
  const completedPoints = completedItems.reduce((total, item) => total + item.points, 0);
  const score = Math.round((completedPoints / totalPoints) * 100);
  
  // Only show if profile is less than 80% complete
  if (score >= 80) {
    return null;
  }
  
  const totalMissingPoints = incompleteItems.reduce((total, item) => total + item.points, 0);
  
  const handleEditProfile = () => {
    toast({
      title: "Let's complete your profile",
      description: `Completing your profile could boost your visibility by up to ${totalMissingPoints}%!`,
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
            <h3 className="text-lg font-medium text-white">Boost Your Profile</h3>
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
          {incompleteItems.slice(0, 4).map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-luxury-neutral">
              <div className="h-4 w-4 rounded-full border border-luxury-primary/30 flex items-center justify-center">
                {item.completed ? (
                  <Check className="h-3 w-3 text-luxury-primary" />
                ) : null}
              </div>
              <span>{item.label}</span>
              <span className="ml-auto text-xs text-luxury-primary">+{item.points}%</span>
            </div>
          ))}
          
          {incompleteItems.length > 4 && (
            <div className="text-sm text-luxury-neutral/70">
              +{incompleteItems.length - 4} more items to complete
            </div>
          )}
        </div>
        
        <Button
          className="w-full mt-4 bg-gradient-to-r from-luxury-primary to-luxury-accent text-white"
          onClick={handleEditProfile}
        >
          Complete Profile <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
        
        <div className="flex items-center justify-center mt-3 gap-2">
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <div key={star} className={`h-2 w-2 rounded-full ${star <= (score / 20) ? 'bg-luxury-primary' : 'bg-luxury-neutral/20'}`} />
            ))}
          </div>
          <p className="text-xs text-luxury-neutral/70">
            Complete profiles get up to 5x more views and matches!
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};