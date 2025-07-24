import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Download,
  Trash2,
  ArrowLeft,
  Eye,
  EyeOff
} from "lucide-react";

const Settings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    marketing: false,
    security: true
  });
  
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showOnlineStatus: true,
    allowMessages: true,
    showActivity: false
  });

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Delete Account",
      description: "Please contact support to delete your account.",
      variant: "destructive"
    });
  };

  return (
    <div className="min-h-screen bg-luxury-gradient">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div 
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
        </motion.div>

        <div className="grid gap-6">
          {/* Account Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-black/40 border-luxury-primary/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <User className="h-5 w-5" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Email</Label>
                    <Input 
                      value={user?.email || ""} 
                      disabled 
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Username</Label>
                    <Input 
                      placeholder="Set your username" 
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleSaveSettings}
                  className="bg-luxury-primary hover:bg-luxury-primary/90"
                >
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notification Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-black/40 border-luxury-primary/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Email Notifications</Label>
                    <p className="text-sm text-white/60">Receive email updates</p>
                  </div>
                  <Switch 
                    checked={notifications.email}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, email: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Push Notifications</Label>
                    <p className="text-sm text-white/60">Receive push notifications</p>
                  </div>
                  <Switch 
                    checked={notifications.push}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, push: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Marketing</Label>
                    <p className="text-sm text-white/60">Promotional content</p>
                  </div>
                  <Switch 
                    checked={notifications.marketing}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, marketing: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Security Alerts</Label>
                    <p className="text-sm text-white/60">Account security updates</p>
                  </div>
                  <Switch 
                    checked={notifications.security}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, security: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Privacy Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-black/40 border-luxury-primary/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Shield className="h-5 w-5" />
                  Privacy & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Profile Visibility</Label>
                    <p className="text-sm text-white/60">Make profile public</p>
                  </div>
                  <Switch 
                    checked={privacy.profileVisible}
                    onCheckedChange={(checked) => 
                      setPrivacy(prev => ({ ...prev, profileVisible: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Online Status</Label>
                    <p className="text-sm text-white/60">Show when you're online</p>
                  </div>
                  <Switch 
                    checked={privacy.showOnlineStatus}
                    onCheckedChange={(checked) => 
                      setPrivacy(prev => ({ ...prev, showOnlineStatus: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Allow Messages</Label>
                    <p className="text-sm text-white/60">Receive messages from others</p>
                  </div>
                  <Switch 
                    checked={privacy.allowMessages}
                    onCheckedChange={(checked) => 
                      setPrivacy(prev => ({ ...prev, allowMessages: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-red-900/20 border-red-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-400">
                  <Trash2 className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Sign Out</Label>
                    <p className="text-sm text-white/60">Sign out of your account</p>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={signOut}
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    Sign Out
                  </Button>
                </div>
                <Separator className="bg-red-500/20" />
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-red-400">Delete Account</Label>
                    <p className="text-sm text-white/60">Permanently delete your account</p>
                  </div>
                  <Button 
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;