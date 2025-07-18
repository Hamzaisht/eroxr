import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, isLoading } = useCurrentUser();
  
  // Form state - only using confirmed Profile fields
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  
  // Settings state using confirmed Profile fields
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [privateProfile, setPrivateProfile] = useState(false);
  
  const [isSaving, setIsSaving] = useState(false);

  // Load user data when profile is available
  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
      setBio(profile.bio || "");
      setLocation(profile.location || "");
      // Use default values for settings since the fields don't exist in Profile type yet
      setEmailNotifications(true);
      setPushNotifications(true);
      setPrivateProfile(!(profile.profile_visibility ?? true));
    }
  }, [profile]);

  const handleSaveSettings = async () => {
    if (!profile) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          bio,
          location,
          profile_visibility: !privateProfile,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully."
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-luxury-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4 text-white hover:bg-white/10 p-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account preferences</p>
      </div>

      <div className="space-y-6">
        <Card className="bg-luxury-darker border-luxury-neutral/10">
          <CardHeader>
            <CardTitle className="text-white">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={session?.user?.email || ''}
                disabled
                className="bg-luxury-dark border-luxury-neutral/20 text-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="bg-luxury-dark border-luxury-neutral/20 text-white"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your location"
                className="bg-luxury-dark border-luxury-neutral/20 text-white"
              />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself"
                className="bg-luxury-dark border-luxury-neutral/20 text-white"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-luxury-darker border-luxury-neutral/10">
          <CardHeader>
            <CardTitle className="text-white">Privacy Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="private-profile">Private Profile</Label>
                <p className="text-sm text-gray-400">Make your profile visible only to followers</p>
              </div>
              <Switch
                id="private-profile"
                checked={privateProfile}
                onCheckedChange={setPrivateProfile}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-luxury-darker border-luxury-neutral/10">
          <CardHeader>
            <CardTitle className="text-white">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-gray-400">Receive notifications via email</p>
              </div>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-gray-400">Receive push notifications in your browser</p>
              </div>
              <Switch
                id="push-notifications"
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button 
            onClick={handleSaveSettings} 
            disabled={isSaving}
            className="bg-luxury-primary hover:bg-luxury-primary/90 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              'Save Settings'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;