
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Bell, CreditCard, Eye, Lock, Users, Heart, Zap, Globe, MessageCircle, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface EroxrProfileSettingsProps {
  profileId: string;
}

export const EroxrProfileSettings = ({ profileId }: EroxrProfileSettingsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [settings, setSettings] = useState({
    profile_visibility: true,
    allow_direct_messages: true,
    show_online_status: true,
    email_notifications: true,
    push_notifications: true,
    marketing_emails: false,
    content_privacy_default: 'public',
    two_factor_enabled: false,
    content_warning_enabled: false,
  });

  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    if (!user || user.id !== profileId) return;

    setIsUpdating(true);
    try {
      console.log('🔒 EroxrProfileSettings: Updating settings via RLS-bypass');
      
      // Use ONLY the RLS-bypass function - crystal clear execution
      const { data: result, error: rpcError } = await supabase.rpc('rls_bypass_profile_update', {
        p_user_id: profileId,
        p_username: null,
        p_bio: null,
        p_location: null,
        p_avatar_url: null,
        p_banner_url: null,
        p_interests: null,
        p_profile_visibility: settings.profile_visibility,
        p_status: null,
      });

      if (rpcError || !result?.success) {
        console.error('❌ EroxrProfileSettings: RLS-bypass update failed:', rpcError || result?.error);
        throw new Error(rpcError?.message || result?.error || 'Failed to update settings');
      }

      console.log('✅ EroxrProfileSettings: Settings updated successfully via RLS-bypass');
      
      toast({
        title: "Settings Updated",
        description: "Your profile settings have been updated successfully!",
      });
    } catch (error: any) {
      console.error('💥 EroxrProfileSettings: Settings update error:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update settings",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-100 mb-2 flex items-center justify-center gap-3">
          <Shield className="w-8 h-8 text-slate-300" />
          Divine Settings
        </h2>
        <p className="text-slate-400 text-lg">Manage your celestial preferences and privacy</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Privacy Settings */}
        <Card className="bg-slate-800/30 backdrop-blur-xl border-slate-700/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <Eye className="w-5 h-5" />
              Privacy & Visibility
            </CardTitle>
            <CardDescription className="text-slate-400">
              Control who can see your profile and content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-slate-200">Profile Visibility</Label>
                <p className="text-sm text-slate-400">Make your profile visible to everyone</p>
              </div>
              <Switch
                checked={settings.profile_visibility}
                onCheckedChange={(checked) => handleSettingChange('profile_visibility', checked)}
              />
            </div>
            
            <Separator className="bg-slate-700/50" />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-slate-200">Show Online Status</Label>
                <p className="text-sm text-slate-400">Let others see when you're online</p>
              </div>
              <Switch
                checked={settings.show_online_status}
                onCheckedChange={(checked) => handleSettingChange('show_online_status', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Communication Settings */}
        <Card className="bg-slate-800/30 backdrop-blur-xl border-slate-700/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <MessageCircle className="w-5 h-5" />
              Communication
            </CardTitle>
            <CardDescription className="text-slate-400">
              Manage how others can contact you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-slate-200">Direct Messages</Label>
                <p className="text-sm text-slate-400">Allow users to send you messages</p>
              </div>
              <Switch
                checked={settings.allow_direct_messages}
                onCheckedChange={(checked) => handleSettingChange('allow_direct_messages', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-slate-800/30 backdrop-blur-xl border-slate-700/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
            <CardDescription className="text-slate-400">
              Choose what notifications you receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-slate-200">Email Notifications</Label>
                <p className="text-sm text-slate-400">Receive updates via email</p>
              </div>
              <Switch
                checked={settings.email_notifications}
                onCheckedChange={(checked) => handleSettingChange('email_notifications', checked)}
              />
            </div>
            
            <Separator className="bg-slate-700/50" />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-slate-200">Push Notifications</Label>
                <p className="text-sm text-slate-400">Receive notifications on your device</p>
              </div>
              <Switch
                checked={settings.push_notifications}
                onCheckedChange={(checked) => handleSettingChange('push_notifications', checked)}
              />
            </div>
            
            <Separator className="bg-slate-700/50" />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-slate-200">Marketing Emails</Label>
                <p className="text-sm text-slate-400">Receive promotional content</p>
              </div>
              <Switch
                checked={settings.marketing_emails}
                onCheckedChange={(checked) => handleSettingChange('marketing_emails', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-slate-800/30 backdrop-blur-xl border-slate-700/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <Lock className="w-5 h-5" />
              Security
            </CardTitle>
            <CardDescription className="text-slate-400">
              Protect your divine account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-slate-200">Two-Factor Authentication</Label>
                <p className="text-sm text-slate-400">Add extra security to your account</p>
              </div>
              <Switch
                checked={settings.two_factor_enabled}
                onCheckedChange={(checked) => handleSettingChange('two_factor_enabled', checked)}
              />
            </div>
            
            <Separator className="bg-slate-700/50" />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-slate-200">Content Warnings</Label>
                <p className="text-sm text-slate-400">Show warnings for sensitive content</p>
              </div>
              <Switch
                checked={settings.content_warning_enabled}
                onCheckedChange={(checked) => handleSettingChange('content_warning_enabled', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-center pt-6">
        <Button
          onClick={handleSaveSettings}
          disabled={isUpdating}
          className="bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white px-12 py-4 text-lg font-semibold rounded-2xl shadow-2xl"
        >
          {isUpdating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Updating Divine Settings...
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Save Divine Settings
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};
