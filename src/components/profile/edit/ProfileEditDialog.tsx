
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProfileEditForm } from "./ProfileEditForm";
import { MediaUploadSection } from "./MediaUploadSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Camera } from "lucide-react";
import { motion } from "framer-motion";

interface ProfileEditDialogProps {
  profile: {
    id: string;
    username: string;
    bio?: string;
    location?: string;
    avatar_url?: string;
    banner_url?: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ProfileEditDialog = ({ profile, isOpen, onClose, onSuccess }: ProfileEditDialogProps) => {
  const [activeTab, setActiveTab] = useState("basic");

  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-luxury-dark to-luxury-darker border border-luxury-primary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-luxury-neutral text-center py-4">
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-luxury-darker/50">
              <TabsTrigger 
                value="basic" 
                className="flex items-center gap-2 data-[state=active]:bg-luxury-primary/20 data-[state=active]:text-luxury-primary"
              >
                <User className="w-4 h-4" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger 
                value="media" 
                className="flex items-center gap-2 data-[state=active]:bg-luxury-primary/20 data-[state=active]:text-luxury-primary"
              >
                <Camera className="w-4 h-4" />
                Photos
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="basic" className="mt-0">
                <ProfileEditForm
                  profile={profile}
                  onSuccess={handleSuccess}
                  onCancel={onClose}
                />
              </TabsContent>

              <TabsContent value="media" className="mt-0">
                <MediaUploadSection
                  profileId={profile.id}
                  currentAvatarUrl={profile.avatar_url}
                  currentBannerUrl={profile.banner_url}
                  onSuccess={onSuccess}
                />
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
