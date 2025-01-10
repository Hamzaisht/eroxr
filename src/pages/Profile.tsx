import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ProfileContainer } from "@/components/profile/ProfileContainer";

export default function Profile() {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-[#1A1F2C] to-[#0D1117]"
    >
      <div className="max-w-7xl mx-auto">
        <ProfileContainer
          id={id}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      </div>
    </motion.div>
  );
}