
import { motion } from 'framer-motion';
import { Shield, Bell, CreditCard, Globe, Eye, Lock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

interface EroxrProfileSettingsProps {
  profileId: string;
}

export const EroxrProfileSettings = ({ profileId }: EroxrProfileSettingsProps) => {
  const [settings, setSettings] = useState({
    profileVisibility: true,
    allowMessages: true,
    showOnline: false,
    notifications: true,
    autoRenewSubscriptions: true,
  });

  const updateSetting = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const settingsGroups = [
    {
      title: 'Privacy & Visibility',
      icon: Shield,
      settings: [
        { key: 'profileVisibility', label: 'Public Profile', description: 'Allow others to view your profile', icon: Globe },
        { key: 'showOnline', label: 'Show Online Status', description: 'Display when you are online', icon: Eye },
        { key: 'allowMessages', label: 'Allow Direct Messages', description: 'Let users send you messages', icon: MessageCircle },
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      settings: [
        { key: 'notifications', label: 'Push Notifications', description: 'Receive notifications for activities', icon: Bell },
      ]
    },
    {
      title: 'Subscriptions',
      icon: CreditCard,
      settings: [
        { key: 'autoRenewSubscriptions', label: 'Auto-Renew Subscriptions', description: 'Automatically renew your subscriptions', icon: CreditCard },
      ]
    },
  ];

  return (
    <div className="space-y-8">
      {settingsGroups.map((group, groupIndex) => (
        <motion.div
          key={group.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: groupIndex * 0.1 }}
          className="bg-slate-800/30 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/30"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-slate-600 to-gray-600 flex items-center justify-center">
              <group.icon className="w-5 h-5 text-slate-200" />
            </div>
            <h3 className="text-2xl font-bold text-slate-100">{group.title}</h3>
          </div>

          <div className="space-y-6">
            {group.settings.map((setting, settingIndex) => (
              <motion.div
                key={setting.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (groupIndex * 0.1) + (settingIndex * 0.05) }}
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-700/20 hover:bg-slate-700/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-slate-600/30 flex items-center justify-center">
                    <setting.icon className="w-4 h-4 text-slate-300" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">{setting.label}</div>
                    <div className="text-sm text-slate-400">{setting.description}</div>
                  </div>
                </div>
                <Switch
                  checked={settings[setting.key as keyof typeof settings]}
                  onCheckedChange={(checked) => updateSetting(setting.key, checked)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/30 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/30"
      >
        <h3 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-3">
          <Lock className="w-6 h-6 text-red-400" />
          Danger Zone
        </h3>
        
        <div className="space-y-4">
          <Button variant="outline" className="w-full border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10">
            Deactivate Account
          </Button>
          <Button variant="outline" className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10">
            Delete Account Permanently
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
