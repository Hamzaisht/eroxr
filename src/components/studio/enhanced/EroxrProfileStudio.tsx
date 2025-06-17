
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Upload, Crown, Palette, Shield, Bell, CreditCard, Eye, Lock, Users, Heart, Zap, Globe, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStudioProfile } from '@/hooks/useStudioProfile';
import { useAuth } from '@/contexts/AuthContext';
import { MediaUploader } from '../MediaUploader';
import { ProfileEditor } from '../ProfileEditor';
import { EroxrProfileSettings } from './EroxrProfileSettings';

interface EroxrProfileStudioProps {
  profileId: string;
  onClose: () => void;
}

export const EroxrProfileStudio = ({ profileId, onClose }: EroxrProfileStudioProps) => {
  const { profile, updateProfile, isUpdating } = useStudioProfile(profileId);
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  if (!user || user.id !== profileId) {
    return null;
  }

  const handleMediaUploadSuccess = (url: string, type: 'avatar' | 'banner') => {
    updateProfile({ [type === 'avatar' ? 'avatar_url' : 'banner_url']: url });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 relative overflow-hidden">
      {/* Greek Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0 bg-repeat bg-[length:80px_80px]" 
          style={{
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 0L65 35L100 35L72.5 57.5L80 92.5L50 75L20 92.5L27.5 57.5L0 35L35 35Z" fill="#E5E7EB" opacity="0.3"/></svg>')}")`
          }}
        />
      </div>

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-20 flex items-center justify-between p-8 border-b border-slate-700/50 backdrop-blur-xl bg-slate-900/30"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-slate-600 to-gray-600 flex items-center justify-center">
            <Crown className="w-6 h-6 text-slate-200" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Divine Studio</h1>
            <p className="text-slate-400">Craft your celestial presence</p>
          </div>
        </div>
        
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
        >
          <X className="w-6 h-6" />
        </Button>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 p-8">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-2 border border-slate-700/30">
                <TabsTrigger 
                  value="profile" 
                  className="flex items-center gap-2 rounded-xl px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-600/30 data-[state=active]:to-gray-600/30 data-[state=active]:text-slate-200"
                >
                  <Palette className="w-4 h-4" />
                  Profile Design
                </TabsTrigger>
                <TabsTrigger 
                  value="media" 
                  className="flex items-center gap-2 rounded-xl px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-600/30 data-[state=active]:to-gray-600/30 data-[state=active]:text-slate-200"
                >
                  <Upload className="w-4 h-4" />
                  Media
                </TabsTrigger>
                <TabsTrigger 
                  value="settings" 
                  className="flex items-center gap-2 rounded-xl px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-600/30 data-[state=active]:to-gray-600/30 data-[state=active]:text-slate-200"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="profile" className="space-y-8">
              {profile && (
                <ProfileEditor
                  profile={profile}
                  onUpdate={updateProfile}
                  isUpdating={isUpdating}
                />
              )}
            </TabsContent>

            <TabsContent value="media" className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                {/* Avatar Upload */}
                <div className="bg-slate-800/30 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/30">
                  <h3 className="text-2xl font-bold text-slate-100 mb-2 flex items-center gap-3">
                    <Crown className="w-6 h-6 text-slate-300" />
                    Divine Avatar
                  </h3>
                  <p className="text-slate-400 mb-6">Upload your celestial portrait</p>
                  <MediaUploader
                    type="avatar"
                    userId={profileId}
                    currentUrl={profile?.avatar_url}
                    onUploadSuccess={(url) => handleMediaUploadSuccess(url, 'avatar')}
                  />
                </div>

                {/* Banner Upload */}
                <div className="bg-slate-800/30 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/30">
                  <h3 className="text-2xl font-bold text-slate-100 mb-2 flex items-center gap-3">
                    <Zap className="w-6 h-6 text-slate-300" />
                    Divine Banner
                  </h3>
                  <p className="text-slate-400 mb-6">Showcase your divine realm</p>
                  <MediaUploader
                    type="banner"
                    userId={profileId}
                    currentUrl={profile?.banner_url}
                    onUploadSuccess={(url) => handleMediaUploadSuccess(url, 'banner')}
                  />
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-8">
              <EroxrProfileSettings profileId={profileId} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
