import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ProfileAvatarProps {
  profile: any;
  getMediaType: (url: string) => 'video' | 'gif' | 'image';
  isOwnProfile?: boolean;
}

export const ProfileAvatar = ({ profile, getMediaType, isOwnProfile }: ProfileAvatarProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleAvatarClick = () => {
    if (isOwnProfile && !isUploading) {
      document.getElementById('avatar-upload')?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const filePath = `${profile.id}/avatar.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });

    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile picture. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div 
      className="relative inline-block group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Avatar 
        className="h-48 w-48 shadow-[0_0_30px_rgba(155,135,245,0.15)] rounded-3xl overflow-hidden bg-luxury-darker transition-all duration-500 group-hover:shadow-[0_0_50px_rgba(217,70,239,0.25)] cursor-pointer"
        onClick={handleAvatarClick}
      >
        {getMediaType(profile?.avatar_url) === 'video' ? (
          <video
            src={profile?.avatar_url}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            autoPlay={isHovering}
            loop
            muted
            playsInline
          />
        ) : (
          <AvatarImage 
            src={profile?.avatar_url} 
            className="group-hover:scale-105 transition-transform duration-500" 
          />
        )}
        <AvatarFallback className="text-4xl bg-luxury-darker text-luxury-primary">
          {profile?.username?.[0]?.toUpperCase() || "?"}
        </AvatarFallback>
      </Avatar>
      
      {isOwnProfile && (
        <div className="absolute inset-0 bg-luxury-darker/60 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-3xl backdrop-blur-[1px] flex items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: isHovering ? 1 : 0 }}
            className="text-luxury-primary flex flex-col items-center gap-2"
          >
            <UserRound className="w-8 h-8 animate-pulse" />
            <span className="text-sm font-medium text-white">
              {isUploading ? "Uploading..." : "Change Profile Picture"}
            </span>
          </motion.div>
        </div>
      )}
      
      <input
        type="file"
        id="avatar-upload"
        className="hidden"
        accept="image/*,video/*"
        onChange={handleFileChange}
        disabled={isUploading}
      />
    </div>
  );
};
