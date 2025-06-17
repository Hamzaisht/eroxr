
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Bell, CreditCard, Eye, Lock, Users, Heart, Zap, Globe, MessageCircle, Crown, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EroxrProfileSettingsProps {
  profileId: string;
}

interface ProfileSettings {
  content_privacy_default: string;
  subscription_price: number;
  allow_tips: boolean;
  allow_custom_requests: boolean;
  auto_renew_subscriptions: boolean;
  content_warning_enabled: boolean;
  two_factor_enabled: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  marketing_emails: boolean;
  show_online_status: boolean;
  allow_direct_messages: boolean;
}

export const EroxrProfileSettings = ({ profileId }: EroxrProfileSettingsProps) => {
  const [settings, setSettings] = useState<ProfileSettings>({
    content_privacy_default: 'public',
    subscription_price: 0,
    allow_tips: true,
    allow_custom_requests: true,
    auto_renew_subscriptions: true,
    content_warning_enabled: false,
    two_factor_enabled: false,
    email_notifications: true,
    push_notifications: true,
    marketing_emails: false,
    show_online_status: true,
    allow_direct_messages: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, [profileId]);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          content_privacy_default,
          subscription_price,
          allow_tips,
          allow_custom_requests,
          auto_renew_subscriptions,
          content_warning_enabled,
          two_factor_enabled,
          email_notifications,
          push_notifications,
          marketing_emails,
          show_online_status,
          allow_direct_messages
        `)
        .eq('id', profileId)
        .single();

      if (error) throw error;
      if (data) {
        setSettings({
          content_privacy_default: data.content_privacy_default || 'public',
          subscription_price: data.subscription_price || 0,
          allow_tips: data.allow_tips ?? true,
          allow_custom_requests: data.allow_custom_requests ?? true,
          auto_renew_subscriptions: data.auto_renew_subscriptions ?? true,
          content_warning_enabled: data.content_warning_enabled ?? false,
          two_factor_enabled: data.two_factor_enabled ?? false,
          email_notifications: data.email_notifications ?? true,
          push_notifications: data.push_notifications ?? true,
          marketing_emails: data.marketing_emails ?? false,
          show_online_status: data.show_online_status ?? true,
          allow_direct_messages: data.allow_direct_messages ?? true,
        });
      }
    } catch (error: any) {
      console.error('Error loading settings:', error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      });
    }
  };

  const saveSettings = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(settings)
        .eq('id', profileId);

      if (error) throw error;

      toast({
        title: "Settings Saved",
        description: "Your divine preferences have been updated",
      });
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = (key: keyof ProfileSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const settingsSections = [
    {
      title: 'Privacy & Content',
      icon: Shield,
      items: [
        {
          key: 'content_privacy_default',
          label: 'Default Content Privacy',
          type: 'select',
          options: [
            { value: 'public', label: 'Public' },
            { value: 'subscribers_only', label: 'Subscribers Only' },
            { value: 'private', label: 'Private' }
          ]
        },
        {
          key: 'content_warning_enabled',
          label: 'Enable Content Warnings',
          type: 'switch'
        },
        {
          key: 'show_online_status',
          label: 'Show Online Status',
          type: 'switch'
        }
      ]
    },
    {
      title: 'Monetization',
      icon: DollarSign,
      items: [
        {
          key: 'subscription_price',
          label: 'Monthly Subscription Price ($)',
          type: 'number',
          min: 0,
          step: 0.01
        },
        {
          key: 'allow_tips',
          label: 'Allow Tips',
          type: 'switch'
        },
        {
          key: 'allow_custom_requests',
          label: 'Allow Custom Requests',
          type: 'switch'
        },
        {
          key: 'auto_renew_subscriptions',
          label: 'Auto-Renew Subscriptions',
          type: 'switch'
        }
      ]
    },
    {
      title: 'Communication',
      icon: MessageCircle,
      items: [
        {
          key: 'allow_direct_messages',
          label: 'Allow Direct Messages',
          type: 'switch'
        }
      ]
    },
    {
      title: 'Security',
      icon: Lock,
      items: [
        {
          key: 'two_factor_enabled',
          label: 'Two-Factor Authentication',
          type: 'switch'
        }
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        {
          key: 'email_notifications',
          label: 'Email Notifications',
          type: 'switch'
        },
        {
          key: 'push_notifications',
          label: 'Push Notifications',
          type: 'switch'
        },
        {
          key: 'marketing_emails',
          label: 'Marketing Emails',
          type: 'switch'
        }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Crown className="w-8 h-8 text-slate-300" />
          <h2 className="text-4xl font-bold text-slate-100">Divine Settings</h2>
          <Crown className="w-8 h-8 text-slate-300" />
        </div>
        <p className="text-slate-400 text-lg">
          Configure your celestial realm preferences
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {settingsSections.map((section, sectionIndex) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
              className="bg-slate-800/30 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/30"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-slate-600 to-gray-600 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-slate-200" />
                </div>
                <h3 className="text-2xl font-bold text-slate-100">{section.title}</h3>
              </div>

              <div className="space-y-6">
                {section.items.map((item) => (
                  <div key={item.key} className="space-y-2">
                    <Label className="text-slate-200 text-base font-medium">
                      {item.label}
                    </Label>
                    
                    {item.type === 'switch' && (
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={settings[item.key as keyof ProfileSettings] as boolean}
                          onCheckedChange={(checked) => updateSetting(item.key as keyof ProfileSettings, checked)}
                          className="data-[state=checked]:bg-slate-600"
                        />
                      </div>
                    )}

                    {item.type === 'select' && (
                      <Select
                        value={settings[item.key as keyof ProfileSettings] as string}
                        onValueChange={(value) => updateSetting(item.key as keyof ProfileSettings, value)}
                      >
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          {item.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value} className="text-slate-200">
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {item.type === 'number' && (
                      <Input
                        type="number"
                        min={item.min}
                        step={item.step}
                        value={settings[item.key as keyof ProfileSettings] as number}
                        onChange={(e) => updateSetting(item.key as keyof ProfileSettings, parseFloat(e.target.value) || 0)}
                        className="bg-slate-700/50 border-slate-600 text-slate-200"
                      />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center pt-8"
      >
        <Button
          onClick={saveSettings}
          disabled={isLoading}
          className="bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-500 hover:to-gray-500 text-white px-12 py-4 text-lg font-semibold rounded-2xl shadow-2xl"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Saving Divine Settings...
            </>
          ) : (
            <>
              <Crown className="w-5 h-5 mr-2" />
              Save Divine Settings
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
};
