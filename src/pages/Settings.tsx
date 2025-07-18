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
import { Loader2, ArrowLeft, Shield, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, isLoading } = useCurrentUser();
  
  // Form state
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  
  // Settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [privateProfile, setPrivateProfile] = useState(false);
  
  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [canChangeUsername, setCanChangeUsername] = useState(true);
  const [verificationRequest, setVerificationRequest] = useState<any>(null);
  const [isCreator, setIsCreator] = useState(false);

  // Load user data when profile is available
  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
      setBio(profile.bio || "");
      setLocation(profile.location || "");
      setDateOfBirth((profile as any).date_of_birth || "");
      setFirstName((profile as any).first_name || "");
      setLastName((profile as any).last_name || "");
      setEmailNotifications((profile as any).email_notifications ?? true);
      setPushNotifications((profile as any).push_notifications ?? true);
      setPrivateProfile(!(profile.profile_visibility ?? true));
      
      // Check username change eligibility
      checkUsernameChangeEligibility();
      
      // Check creator verification status
      checkCreatorStatus();
    }
  }, [profile]);

  const checkUsernameChangeEligibility = async () => {
    if (!profile?.id) return;
    
    try {
      const { data, error } = await supabase.rpc('can_change_username', {
        user_id: profile.id
      });
      
      if (!error) {
        setCanChangeUsername(data);
      }
    } catch (error) {
      console.error('Error checking username eligibility:', error);
    }
  };

  const checkCreatorStatus = async () => {
    if (!profile?.id) return;
    
    try {
      // Check if user has a verification request
      const { data: request } = await supabase
        .from('creator_verification_requests')
        .select('*')
        .eq('user_id', profile.id)
        .single();
      
      setVerificationRequest(request);
      
      // Check if user is an approved creator
      const { data: isVerified } = await supabase.rpc('is_verified_creator', {
        user_id: profile.id
      });
      
      setIsCreator(isVerified);
    } catch (error) {
      console.error('Error checking creator status:', error);
    }
  };

  const handleSaveSettings = async () => {
    if (!profile) return;
    
    setIsSaving(true);
    try {
      const updateData: any = {
        bio,
        location,
        first_name: firstName,
        last_name: lastName,
        email_notifications: emailNotifications,
        push_notifications: pushNotifications,
        profile_visibility: !privateProfile,
        updated_at: new Date().toISOString()
      };

      // Only update username if it can be changed
      if (canChangeUsername && username !== profile.username) {
        updateData.username = username;
        updateData.last_username_change = new Date().toISOString();
      }

      // Only update date of birth if it's valid and user is 18+
      if (dateOfBirth) {
        const birthDate = new Date(dateOfBirth);
        const age = new Date().getFullYear() - birthDate.getFullYear();
        if (age >= 18) {
          updateData.date_of_birth = dateOfBirth;
          updateData.is_age_verified = true;
        } else {
          toast({
            title: "Invalid Date of Birth",
            description: "You must be at least 18 years old.",
            variant: "destructive"
          });
          return;
        }
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', profile.id);

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully."
      });
      
      // Refresh username eligibility if username was changed
      if (username !== profile.username) {
        checkUsernameChangeEligibility();
      }
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

  const handleBecomeCreator = () => {
    navigate('/creator-signup');
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
              <p className="text-xs text-gray-400 mt-1">
                Contact <a href="mailto:support@eroxr.se" className="text-luxury-primary hover:text-luxury-primary/80">support@eroxr.se</a> to change your email address
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="bg-luxury-dark border-luxury-neutral/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  className="bg-luxury-dark border-luxury-neutral/20 text-white"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                disabled={!canChangeUsername}
                className="bg-luxury-dark border-luxury-neutral/20 text-white disabled:opacity-50"
              />
              {!canChangeUsername && (
                <p className="text-xs text-yellow-400 mt-1">
                  Username can only be changed once every 90 days
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="bg-luxury-dark border-luxury-neutral/20 text-white"
              />
              <p className="text-xs text-gray-400 mt-1">Must be 18+ to use this platform</p>
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

        {/* Creator Verification Section */}
        <Card className="bg-luxury-darker border-luxury-neutral/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Star className="h-5 w-5 text-luxury-primary" />
              Creator Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isCreator ? (
              <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <Shield className="h-6 w-6 text-green-400" />
                <div>
                  <h3 className="font-semibold text-green-400">Verified Creator</h3>
                  <p className="text-sm text-gray-300">
                    You're a verified content creator and can earn through subscriptions, tips, and PPV content.
                  </p>
                </div>
              </div>
            ) : verificationRequest ? (
              <div className="space-y-3">
                <div className={`flex items-center gap-3 p-4 rounded-lg border ${
                  verificationRequest.status === 'pending' 
                    ? 'bg-yellow-500/10 border-yellow-500/20' 
                    : verificationRequest.status === 'under_review'
                    ? 'bg-blue-500/10 border-blue-500/20'
                    : verificationRequest.status === 'rejected'
                    ? 'bg-red-500/10 border-red-500/20'
                    : 'bg-orange-500/10 border-orange-500/20'
                }`}>
                  <Shield className={`h-6 w-6 ${
                    verificationRequest.status === 'pending' 
                      ? 'text-yellow-400' 
                      : verificationRequest.status === 'under_review'
                      ? 'text-blue-400'
                      : verificationRequest.status === 'rejected'
                      ? 'text-red-400'
                      : 'text-orange-400'
                  }`} />
                  <div>
                    <h3 className={`font-semibold ${
                      verificationRequest.status === 'pending' 
                        ? 'text-yellow-400' 
                        : verificationRequest.status === 'under_review'
                        ? 'text-blue-400'
                        : verificationRequest.status === 'rejected'
                        ? 'text-red-400'
                        : 'text-orange-400'
                    }`}>
                      Application {verificationRequest.status === 'under_review' ? 'Under Review' : 
                        verificationRequest.status.charAt(0).toUpperCase() + verificationRequest.status.slice(1)}
                    </h3>
                    <p className="text-sm text-gray-300">
                      {verificationRequest.status === 'pending' && 'Your creator verification request is pending review.'}
                      {verificationRequest.status === 'under_review' && 'Your application is currently being reviewed by our team.'}
                      {verificationRequest.status === 'rejected' && 'Your application was rejected. You can reapply with updated information.'}
                      {verificationRequest.status === 'requires_changes' && 'Please update your application based on admin feedback.'}
                    </p>
                    {verificationRequest.rejection_reason && (
                      <p className="text-sm text-red-300 mt-2">
                        <strong>Reason:</strong> {verificationRequest.rejection_reason}
                      </p>
                    )}
                  </div>
                </div>
                
                {(verificationRequest.status === 'rejected' || verificationRequest.status === 'requires_changes') && (
                  <Button 
                    onClick={handleBecomeCreator}
                    className="w-full bg-luxury-primary hover:bg-luxury-primary/90"
                  >
                    Reapply for Creator Verification
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-luxury-primary/10 border border-luxury-primary/20 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">Become a Verified Creator</h3>
                  <p className="text-sm text-gray-300 mb-4">
                    Join our creator program to monetize your content through subscriptions, tips, and pay-per-view content. 
                    Verification typically takes 48 hours.
                  </p>
                  <ul className="text-sm text-gray-300 space-y-1 mb-4">
                    <li>• Upload government-issued ID for identity verification</li>
                    <li>• Provide business or personal address information</li>
                    <li>• Accept our creator terms and community guidelines</li>
                    <li>• Start earning through fan subscriptions and tips</li>
                  </ul>
                </div>
                
                <Button 
                  onClick={handleBecomeCreator}
                  className="w-full bg-luxury-primary hover:bg-luxury-primary/90"
                  disabled={!dateOfBirth}
                >
                  <Star className="h-4 w-4 mr-2" />
                  Apply for Creator Verification
                </Button>
                
                {!dateOfBirth && (
                  <p className="text-xs text-yellow-400 text-center">
                    Please add your date of birth above to apply for creator verification
                  </p>
                )}
              </div>
            )}
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