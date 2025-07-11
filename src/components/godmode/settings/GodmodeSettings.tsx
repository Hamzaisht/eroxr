import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdminSession } from '@/contexts/AdminSessionContext';
import { Settings, Eye, Shield, Bell, Database, Globe, Lock, Save, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface PlatformSettings {
  maintenance_mode: boolean;
  user_registration: boolean;
  content_moderation: boolean;
  auto_verification: boolean;
  ghost_mode_enabled: boolean;
  max_file_size: number;
  platform_fee_percentage: number;
  notification_settings: {
    email_notifications: boolean;
    push_notifications: boolean;
    admin_alerts: boolean;
  };
  security_settings: {
    two_factor_required: boolean;
    session_timeout: number;
    ip_whitelist: string[];
  };
  content_settings: {
    max_post_length: number;
    allowed_file_types: string[];
    nsfw_content_allowed: boolean;
  };
}

export const GodmodeSettings: React.FC = () => {
  const { isGhostMode, logGhostAction } = useAdminSession();
  const [settings, setSettings] = useState<PlatformSettings>({
    maintenance_mode: false,
    user_registration: true,
    content_moderation: true,
    auto_verification: false,
    ghost_mode_enabled: true,
    max_file_size: 50,
    platform_fee_percentage: 15,
    notification_settings: {
      email_notifications: true,
      push_notifications: true,
      admin_alerts: true
    },
    security_settings: {
      two_factor_required: false,
      session_timeout: 24,
      ip_whitelist: []
    },
    content_settings: {
      max_post_length: 2000,
      allowed_file_types: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov'],
      nsfw_content_allowed: true
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'content' | 'notifications'>('general');

  const fetchSettings = async () => {
    try {
      // In a real implementation, these would come from a settings table
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async () => {
    if (isGhostMode) {
      await logGhostAction('Update platform settings', 'system', '', { tab: activeTab, timestamp: new Date().toISOString() });
    }

    setIsSaving(true);
    try {
      // In a real implementation, these would be saved to the database
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Show success message
      console.log('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (path: string, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      const keys = path.split('.');
      let current = newSettings as any;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Platform Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">Maintenance Mode</label>
              <p className="text-sm text-gray-400">Temporarily disable platform access</p>
            </div>
            <Switch
              checked={settings.maintenance_mode}
              onCheckedChange={(value) => updateSetting('maintenance_mode', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">User Registration</label>
              <p className="text-sm text-gray-400">Allow new user registrations</p>
            </div>
            <Switch
              checked={settings.user_registration}
              onCheckedChange={(value) => updateSetting('user_registration', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">Content Moderation</label>
              <p className="text-sm text-gray-400">Enable automatic content moderation</p>
            </div>
            <Switch
              checked={settings.content_moderation}
              onCheckedChange={(value) => updateSetting('content_moderation', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">Ghost Mode</label>
              <p className="text-sm text-gray-400">Enable admin surveillance mode</p>
            </div>
            <Switch
              checked={settings.ghost_mode_enabled}
              onCheckedChange={(value) => updateSetting('ghost_mode_enabled', value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Platform Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-white font-medium mb-2 block">Max File Size (MB)</label>
            <Input
              type="number"
              value={settings.max_file_size}
              onChange={(e) => updateSetting('max_file_size', parseInt(e.target.value))}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          <div>
            <label className="text-white font-medium mb-2 block">Platform Fee (%)</label>
            <Input
              type="number"
              value={settings.platform_fee_percentage}
              onChange={(e) => updateSetting('platform_fee_percentage', parseInt(e.target.value))}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Authentication & Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">Two-Factor Authentication</label>
              <p className="text-sm text-gray-400">Require 2FA for admin accounts</p>
            </div>
            <Switch
              checked={settings.security_settings.two_factor_required}
              onCheckedChange={(value) => updateSetting('security_settings.two_factor_required', value)}
            />
          </div>

          <div>
            <label className="text-white font-medium mb-2 block">Session Timeout (hours)</label>
            <Input
              type="number"
              value={settings.security_settings.session_timeout}
              onChange={(e) => updateSetting('security_settings.session_timeout', parseInt(e.target.value))}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          <div>
            <label className="text-white font-medium mb-2 block">IP Whitelist</label>
            <Textarea
              placeholder="Enter IP addresses, one per line"
              value={settings.security_settings.ip_whitelist.join('\n')}
              onChange={(e) => updateSetting('security_settings.ip_whitelist', e.target.value.split('\n').filter(ip => ip.trim()))}
              className="bg-white/5 border-white/10 text-white"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContentSettings = () => (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Content Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-white font-medium mb-2 block">Max Post Length (characters)</label>
            <Input
              type="number"
              value={settings.content_settings.max_post_length}
              onChange={(e) => updateSetting('content_settings.max_post_length', parseInt(e.target.value))}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">NSFW Content</label>
              <p className="text-sm text-gray-400">Allow adult content on platform</p>
            </div>
            <Switch
              checked={settings.content_settings.nsfw_content_allowed}
              onCheckedChange={(value) => updateSetting('content_settings.nsfw_content_allowed', value)}
            />
          </div>

          <div>
            <label className="text-white font-medium mb-2 block">Allowed File Types</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {settings.content_settings.allowed_file_types.map((type) => (
                <Badge key={type} variant="secondary" className="bg-blue-500/20 text-blue-300">
                  {type.toUpperCase()}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">Email Notifications</label>
              <p className="text-sm text-gray-400">Send notifications via email</p>
            </div>
            <Switch
              checked={settings.notification_settings.email_notifications}
              onCheckedChange={(value) => updateSetting('notification_settings.email_notifications', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">Push Notifications</label>
              <p className="text-sm text-gray-400">Send browser push notifications</p>
            </div>
            <Switch
              checked={settings.notification_settings.push_notifications}
              onCheckedChange={(value) => updateSetting('notification_settings.push_notifications', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">Admin Alerts</label>
              <p className="text-sm text-gray-400">Receive critical system alerts</p>
            </div>
            <Switch
              checked={settings.notification_settings.admin_alerts}
              onCheckedChange={(value) => updateSetting('notification_settings.admin_alerts', value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Platform Settings</h1>
          <p className="text-gray-400">Configure platform behavior and policies</p>
        </div>
        <div className="flex items-center gap-3">
          {isGhostMode && (
            <div className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg">
              <Eye className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-purple-300">Ghost Mode Active</span>
            </div>
          )}
          <Button onClick={handleSaveSettings} disabled={isSaving}>
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === 'general' ? 'default' : 'outline'}
          onClick={() => setActiveTab('general')}
        >
          <Settings className="h-4 w-4 mr-2" />
          General
        </Button>
        <Button
          variant={activeTab === 'security' ? 'default' : 'outline'}
          onClick={() => setActiveTab('security')}
        >
          <Lock className="h-4 w-4 mr-2" />
          Security
        </Button>
        <Button
          variant={activeTab === 'content' ? 'default' : 'outline'}
          onClick={() => setActiveTab('content')}
        >
          <Globe className="h-4 w-4 mr-2" />
          Content
        </Button>
        <Button
          variant={activeTab === 'notifications' ? 'default' : 'outline'}
          onClick={() => setActiveTab('notifications')}
        >
          <Bell className="h-4 w-4 mr-2" />
          Notifications
        </Button>
      </div>

      {/* Settings Content */}
      {activeTab === 'general' && renderGeneralSettings()}
      {activeTab === 'security' && renderSecuritySettings()}
      {activeTab === 'content' && renderContentSettings()}
      {activeTab === 'notifications' && renderNotificationSettings()}

      {/* System Status */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Database className="h-5 w-5" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-white font-medium">Database</p>
                <p className="text-sm text-green-400">Operational</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-white font-medium">Storage</p>
                <p className="text-sm text-green-400">Operational</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-white font-medium">API</p>
                <p className="text-sm text-green-400">Operational</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};