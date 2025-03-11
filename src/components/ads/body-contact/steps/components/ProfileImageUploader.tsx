
import { useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface ProfileImageUploaderProps {
  onAvatarChange: (file: File | null, preview: string) => void;
  avatarPreview: string;
}

export const ProfileImageUploader = ({ onAvatarChange, avatarPreview }: ProfileImageUploaderProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="flex justify-center"
    >
      <div className="relative group">
        <Avatar className="h-28 w-28 border-2 border-luxury-primary/30 shadow-[0_0_15px_rgba(155,135,245,0.3)]
          transition-all duration-500 group-hover:shadow-[0_0_25px_rgba(155,135,245,0.6)]">
          <AvatarImage src={avatarPreview} />
          <AvatarFallback>
            <User className="h-12 w-12 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              if (file.size > 5 * 1024 * 1024) {
                // 5MB limit
                return;
              }
              
              const reader = new FileReader();
              reader.onloadend = () => {
                onAvatarChange(file, reader.result as string);
              };
              reader.readAsDataURL(file);
            }
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          id="avatar-upload"
        />
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 
          bg-gradient-to-r from-luxury-primary to-luxury-secondary text-white text-xs py-1 px-3 
          rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
          Change Photo
        </div>
      </div>
    </motion.div>
  );
};
