
import { motion } from "framer-motion";
import { CircuitBoard, MapPin } from "lucide-react";
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
      className="space-y-4 max-w-3xl mx-auto px-4"
    >
      <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-luxury-primary via-luxury-accent to-luxury-secondary bg-clip-text text-transparent text-center">
        @{displayName}
      </h1>
      
      <p className="text-luxury-neutral/80 text-base lg:text-lg leading-relaxed backdrop-blur-sm text-center">
        {profile?.bio || "No bio yet"}
      </p>
      
      {profile?.location && (
        <div className="flex justify-center gap-2 items-center text-luxury-neutral/60 mb-2">
          <MapPin className="h-4 w-4" />
          <span>{profile.location}</span>
        </div>
      )}
      
      <div className="flex justify-center gap-2 items-center text-luxury-neutral/60">
        <CircuitBoard className="h-4 w-4" />
        <span>Joined {profile?.created_at ? formatDate(profile.created_at) : "recently"}</span>
      </div>
      
      {profile?.interests && profile.interests.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {profile.interests.map((interest, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-luxury-primary/20 rounded-full text-sm text-luxury-primary"
            >
              {interest}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};
