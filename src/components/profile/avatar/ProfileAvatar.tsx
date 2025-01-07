import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PencilIcon } from "lucide-react";
import { motion } from "framer-motion";
import { AvatarUploadModal } from "./AvatarUploadModal";
import { AvatarPreviewModal } from "./AvatarPreviewModal";
import { useAvatarUpload } from "./useAvatarUpload";

interface ProfileAvatarProps {
  profile: any;
  getMediaType: (url: string) => 'video' | 'gif' | 'image';
  isOwnProfile?: boolean;
}

export const ProfileAvatar = ({ profile, getMediaType, isOwnProfile }: ProfileAvatarProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { isUploading, handleFileChange } = useAvatarUpload(profile);
  const mediaType = getMediaType(profile?.avatar_url);

  return (
    <>
      <div 
        className="relative inline-block"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Avatar 
          className="h-48 w-48 shadow-[0_0_30px_rgba(155,135,245,0.15)] rounded-3xl overflow-hidden bg-luxury-darker transition-all duration-500 hover:shadow-[0_0_50px_rgba(217,70,239,0.25)] cursor-pointer"
          onClick={() => profile?.avatar_url && setShowPreview(true)}
        >
          {mediaType === 'video' ? (
            <video
              src={profile?.avatar_url}
              className="h-full w-full object-cover transition-transform duration-500"
              autoPlay={isHovering}
              loop
              muted
              playsInline
            />
          ) : (
            <AvatarImage 
              src={profile?.avatar_url} 
              className="h-full w-full object-cover transition-transform duration-500"
            />
          )}
          <AvatarFallback className="text-4xl bg-luxury-darker text-luxury-primary">
            {profile?.username?.[0]?.toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
        
        {isOwnProfile && isHovering && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-3 right-3 bg-luxury-primary hover:bg-luxury-primary/90 p-2.5 rounded-full flex items-center justify-center shadow-luxury cursor-pointer backdrop-blur-sm z-10"
            onClick={(e) => {
              e.stopPropagation();
              setShowUploadModal(true);
            }}
          >
            <PencilIcon className="w-5 h-5 text-white" />
          </motion.div>
        )}
      </div>

      <AvatarUploadModal
        isOpen={showUploadModal}
        onOpenChange={setShowUploadModal}
        isUploading={isUploading}
        onFileChange={handleFileChange}
      />

      <AvatarPreviewModal
        isOpen={showPreview}
        onOpenChange={setShowPreview}
        mediaUrl={profile?.avatar_url}
        mediaType={mediaType}
      />
    </>
  );
};