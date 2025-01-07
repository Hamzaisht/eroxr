import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound, Image } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ProfileAvatarProps {
  profile: any;
  getMediaType: (url: string) => 'video' | 'gif' | 'image';
  isOwnProfile?: boolean;
}

export const ProfileAvatar = ({ profile, getMediaType, isOwnProfile }: ProfileAvatarProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload a file smaller than 5MB",
      });
      return;
    }

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

      setShowUploadModal(false);

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
    <>
      <div 
        className="relative inline-block"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Avatar 
          className="h-48 w-48 shadow-[0_0_30px_rgba(155,135,245,0.15)] rounded-3xl overflow-hidden bg-luxury-darker transition-all duration-500 hover:shadow-[0_0_50px_rgba(217,70,239,0.25)]"
          onClick={() => isOwnProfile && setShowUploadModal(true)}
        >
          {getMediaType(profile?.avatar_url) === 'video' ? (
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
              className="transition-transform duration-500" 
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
            className="absolute top-2 right-2 bg-luxury-darker/90 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-2 text-white border border-luxury-primary/20 shadow-luxury cursor-pointer"
            onClick={() => setShowUploadModal(true)}
          >
            <Image className="w-4 h-4 text-luxury-primary" />
            <span className="text-sm font-medium whitespace-nowrap">
              Change Picture
            </span>
          </motion.div>
        )}
      </div>

      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Profile Picture</DialogTitle>
            <DialogDescription>
              Upload a new profile picture. For best results:
              <ul className="list-disc pl-4 mt-2 space-y-1">
                <li>Use a square image</li>
                <li>Maximum file size: 5MB</li>
                <li>Supported formats: JPG, PNG, GIF</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              <label
                htmlFor="avatar-upload"
                className="cursor-pointer bg-luxury-primary/10 hover:bg-luxury-primary/20 text-luxury-primary px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
              >
                <Image className="w-4 h-4" />
                <span>{isUploading ? "Uploading..." : "Choose File"}</span>
              </label>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};