
import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, User, Upload, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { SimpleProfileEditor } from './SimpleProfileEditor';
import { SimpleMediaUploader } from './SimpleMediaUploader';
import { useSimpleProfile } from './SimpleProfileData';

interface SimpleProfileStudioProps {
  profileId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const SimpleProfileStudio = ({ profileId, isOpen, onClose }: SimpleProfileStudioProps) => {
  const { profile, refetch } = useSimpleProfile(profileId);
  const [activeTab, setActiveTab] = useState('profile');

  const handleMediaUploadSuccess = (url: string, type: 'avatar' | 'banner') => {
    // Refetch profile data to update the UI
    refetch();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 border-none bg-transparent overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-slate-900/95 to-gray-900/95 backdrop-blur-xl border border-slate-700/30 rounded-3xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700/30">
            <div>
              <h2 className="text-2xl font-bold text-slate-100">Profile Studio</h2>
              <p className="text-slate-400">Edit your profile and media</p>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 rounded-xl p-1 mb-6">
                <TabsTrigger 
                  value="profile" 
                  className="flex items-center gap-2 rounded-lg data-[state=active]:bg-slate-700/50"
                >
                  <User className="w-4 h-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger 
                  value="media" 
                  className="flex items-center gap-2 rounded-lg data-[state=active]:bg-slate-700/50"
                >
                  <Upload className="w-4 h-4" />
                  Media
                </TabsTrigger>
                <TabsTrigger 
                  value="settings" 
                  className="flex items-center gap-2 rounded-lg data-[state=active]:bg-slate-700/50"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <SimpleProfileEditor profileId={profileId} onClose={onClose} />
              </TabsContent>

              <TabsContent value="media" className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                  {/* Avatar Upload */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-slate-200">Profile Avatar</h3>
                    <p className="text-slate-400">Upload your profile picture</p>
                    <SimpleMediaUploader
                      type="avatar"
                      userId={profileId}
                      currentUrl={profile?.avatar_url}
                      onUploadSuccess={(url) => handleMediaUploadSuccess(url, 'avatar')}
                    />
                  </div>

                  {/* Banner Upload */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-slate-200">Profile Banner</h3>
                    <p className="text-slate-400">Upload a banner image for your profile</p>
                    <SimpleMediaUploader
                      type="banner"
                      userId={profileId}
                      currentUrl={profile?.banner_url}
                      onUploadSuccess={(url) => handleMediaUploadSuccess(url, 'banner')}
                    />
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="settings">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <Settings className="w-16 h-16 mx-auto text-slate-400 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-200 mb-2">Settings Coming Soon</h3>
                  <p className="text-slate-400">Profile settings will be available here</p>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
