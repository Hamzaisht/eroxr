
import { motion } from "framer-motion";
import { CircuitBoard } from "lucide-react";
import type { Profile } from "@/integrations/supabase/types/profile";

interface ProfileInfoProps {
  profile: Profile;
}

export const ProfileInfo = ({ profile }: ProfileInfoProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const displayName = profile?.username || "Anonymous";

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="space-y-4"
    >
      <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-luxury-primary via-luxury-accent to-luxury-secondary bg-clip-text text-transparent">
        @{displayName}
      </h1>
      
      <p className="text-luxury-neutral/80 text-base lg:text-lg leading-relaxed backdrop-blur-sm">
        {profile?.bio || "No bio yet"}
      </p>
      
      <div className="flex justify-center gap-2 items-center text-luxury-neutral/60">
        <CircuitBoard className="h-4 w-4" />
        <span>Joined {profile?.created_at ? formatDate(profile.created_at) : "recently"}</span>
      </div>
    </motion.div>
  );
};
