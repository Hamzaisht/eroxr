import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ProfileContainer } from "@/components/profile/ProfileContainer";
import { FloatingActionMenu } from "@/components/profile/FloatingActionMenu";
import { useSession } from "@supabase/auth-helpers-react";

export default function Profile() {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const session = useSession();

  const isOwnProfile = session?.user?.id === id;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-[#1A1F2C] to-[#0D1117]"
    >
      <div className="max-w-[100vw] mx-auto">
        <ProfileContainer
          id={id}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      </div>
      
      {isOwnProfile && (
        <FloatingActionMenu
          onCreatePost={() => {
            // Handle create post
          }}
          onCreateStory={() => {
            // Handle create story
          }}
          onCreateDatingAd={() => {
            // Handle create dating ad
          }}
        />
      )}
    </motion.div>
  );
}