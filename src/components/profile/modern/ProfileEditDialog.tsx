import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, User, X, Save, Loader2, Plus, Trash2, 
  Star, Shield, Globe, Eye, EyeOff, Heart, 
  Settings, Palette, Bell, Lock, Crown, Zap,
  Upload, Image, Video, Music, FileText
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '../hooks/useProfile';
import { SimpleMediaUploader } from '../core/SimpleMediaUploader';

interface ProfileEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  profileId: string;
}

export const ProfileEditDialog = ({ isOpen, onClose, profileId }: ProfileEditDialogProps) => {
  const { profile, updateProfile, loading } = useProfile(profileId);
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    location: '',
    interests: [] as string[],
    website: '',
    profession: '',
    relationship_status: 'single',
    looking_for: [] as string[]
  });

  const [advancedSettings, setAdvancedSettings] = useState({
    profile_visibility: true,
    show_online_status: true,
    allow_messages: true,
    show_location: true,
    content_rating: 'general',
    notification_preferences: {
      likes: true,
      comments: true,
      follows: true,
      messages: true
    }
  });

  const [newInterest, setNewInterest] = useState('');
  
  const relationshipOptions = [
    'single', 'taken', 'open', 'complicated', 'prefer_not_to_say'
  ];

  const lookingForOptions = [
    'friendship', 'dating', 'networking', 'collaboration', 'mentoring', 'fun'
  ];

  const contentRatingOptions = [
    { value: 'general', label: 'General Audience', icon: Globe },
    { value: 'mature', label: 'Mature Content', icon: Eye },
    { value: 'adult', label: 'Adult Only', icon: Crown }
  ];

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        bio: profile.bio || '',
        location: profile.location || '',
        interests: profile.interests || [],
        website: '',
        profession: '',
        relationship_status: 'single',
        looking_for: []
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      await updateProfile(formData);
      toast({
        title: "✨ Profile Updated Successfully!",
        description: "Your profile looks amazing! Others will love your new updates.",
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim()) && formData.interests.length < 15) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const addLookingFor = (option: string) => {
    if (!formData.looking_for.includes(option)) {
      setFormData(prev => ({
        ...prev,
        looking_for: [...prev.looking_for, option]
      }));
    }
  };

  const removeLookingFor = (option: string) => {
    setFormData(prev => ({
      ...prev,
      looking_for: prev.looking_for.filter(item => item !== option)
    }));
  };

  const handleAvatarUpload = (url: string) => {
    toast({
      title: "🎉 Avatar Updated!",
      description: "Looking great! Your new profile picture is live.",
    });
  };

  const handleBannerUpload = (url: string) => {
    toast({
      title: "🌟 Banner Updated!", 
      description: "Your profile banner looks stunning!",
    });
  };

  if (loading || !profile) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] w-[90vw] sm:w-[85vw] lg:w-[80vw] overflow-hidden bg-black/95 border border-white/10">
        <DialogHeader className="border-b border-white/10 pb-4">
          <DialogTitle className="flex items-center gap-3 text-2xl font-light text-white">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid grid-cols-4 w-fit mx-auto bg-white/5 backdrop-blur-xl rounded-full p-2 mb-6">
              <TabsTrigger 
                value="basic" 
                className="px-4 py-2 rounded-full transition-all text-sm data-[state=active]:bg-primary data-[state=active]:text-white text-white/60 hover:text-white"
              >
                <User className="w-4 h-4 mr-2" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger 
                value="media" 
                className="px-4 py-2 rounded-full transition-all text-sm data-[state=active]:bg-primary data-[state=active]:text-white text-white/60 hover:text-white"
              >
                <Camera className="w-4 h-4 mr-2" />
                Photos & Media
              </TabsTrigger>
              <TabsTrigger 
                value="verification" 
                className="px-4 py-2 rounded-full transition-all text-sm data-[state=active]:bg-primary data-[state=active]:text-white text-white/60 hover:text-white"
              >
                <Shield className="w-4 h-4 mr-2" />
                Creator Verification
              </TabsTrigger>
              <TabsTrigger 
                value="privacy" 
                className="px-4 py-2 rounded-full transition-all text-sm data-[state=active]:bg-primary data-[state=active]:text-white text-white/60 hover:text-white"
              >
                <Settings className="w-4 h-4 mr-2" />
                Privacy & Settings
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  {/* Basic Info Tab */}
                  <TabsContent value="basic" className="space-y-8 mt-0">
                    <form onSubmit={handleSubmit} className="space-y-8">
                      {/* Profile Preview */}
                      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                          <Eye className="w-5 h-5 text-primary" />
                          Live Preview
                        </h3>
                        <div className="flex items-center gap-6">
                          <div className="relative">
                            <Avatar className="w-24 h-24 border-2 border-primary/30">
                              <AvatarImage src={profile.avatar_url || undefined} />
                              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                                <User className="w-8 h-8" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                              <Crown className="w-3 h-3 text-white" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-light text-white mb-1">
                              {formData.username || 'Your Username'}
                            </h3>
                            <p className="text-white/60 mb-2">
                              {formData.bio || 'Your bio will appear here...'}
                            </p>
                            {formData.location && (
                              <p className="text-white/40 text-sm">📍 {formData.location}</p>
                            )}
                            {formData.interests.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {formData.interests.slice(0, 3).map((interest) => (
                                  <Badge key={interest} variant="secondary" className="text-xs">
                                    {interest}
                                  </Badge>
                                ))}
                                {formData.interests.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{formData.interests.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Basic Information */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-white/80 mb-2 block">
                              Username *
                            </label>
                            <Input
                              placeholder="Choose your unique username"
                              value={formData.username}
                              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                              maxLength={30}
                              className="bg-white/5 border-white/10 text-white"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium text-white/80 mb-2 block">
                              Profession
                            </label>
                            <Input
                              placeholder="What do you do?"
                              value={formData.profession}
                              onChange={(e) => setFormData(prev => ({ ...prev, profession: e.target.value }))}
                              maxLength={50}
                              className="bg-white/5 border-white/10 text-white"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium text-white/80 mb-2 block">
                              Website
                            </label>
                            <Input
                              placeholder="https://your-website.com"
                              value={formData.website}
                              onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                              className="bg-white/5 border-white/10 text-white"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium text-white/80 mb-2 block">
                              Relationship Status
                            </label>
                            <Select value={formData.relationship_status} onValueChange={(value) => 
                              setFormData(prev => ({ ...prev, relationship_status: value }))
                            }>
                              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-black border-white/10">
                                {relationshipOptions.map(option => (
                                  <SelectItem key={option} value={option} className="text-white">
                                    {option.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-white/80 mb-2 block">
                              Bio *
                            </label>
                            <Textarea
                              placeholder="Tell everyone about yourself... What makes you unique?"
                              value={formData.bio}
                              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                              rows={4}
                              maxLength={500}
                              className="bg-white/5 border-white/10 text-white resize-none"
                            />
                            <p className="text-xs text-white/40 mt-1">
                              {formData.bio.length}/500 characters
                            </p>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-white/80 mb-2 block">
                              Location
                            </label>
                            <Input
                              placeholder="Where are you based?"
                              value={formData.location}
                              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                              maxLength={100}
                              className="bg-white/5 border-white/10 text-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Interests */}
                      <div>
                        <label className="text-sm font-medium text-white/80 mb-3 block">
                          Interests & Skills
                        </label>
                        <div className="flex gap-2 mb-4">
                          <Input
                            placeholder="Add an interest (e.g., Photography, Gaming, Art...)"
                            value={newInterest}
                            onChange={(e) => setNewInterest(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                            maxLength={30}
                            className="bg-white/5 border-white/10 text-white"
                          />
                          <Button 
                            type="button" 
                            onClick={addInterest} 
                            variant="outline" 
                            size="icon"
                            className="border-white/10 hover:bg-primary/20"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        {formData.interests.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {formData.interests.map((interest, index) => (
                              <motion.div
                                key={interest}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ delay: index * 0.05 }}
                                className="relative group"
                              >
                                <Badge 
                                  variant="secondary" 
                                  className="pr-8 bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 transition-colors"
                                >
                                  {interest}
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full w-6 p-0 hover:bg-red-500/20 hover:text-red-400"
                                    onClick={() => removeInterest(interest)}
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </Badge>
                              </motion.div>
                            ))}
                          </div>
                        )}
                        <p className="text-xs text-white/40">
                          Add up to 15 interests that describe you ({formData.interests.length}/15)
                        </p>
                      </div>

                      {/* Looking For */}
                      <div>
                        <label className="text-sm font-medium text-white/80 mb-3 block">
                          What Are You Looking For?
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {lookingForOptions.map((option) => (
                            <Button
                              key={option}
                              type="button"
                              variant={formData.looking_for.includes(option) ? "default" : "outline"}
                              onClick={() => 
                                formData.looking_for.includes(option) 
                                  ? removeLookingFor(option)
                                  : addLookingFor(option)
                              }
                              className={`justify-start ${
                                formData.looking_for.includes(option)
                                  ? 'bg-primary text-white'
                                  : 'border-white/10 text-white/60 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              <Heart className="w-4 h-4 mr-2" />
                              {option.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-4 pt-6 border-t border-white/10">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={onClose} 
                          className="flex-1 border-white/10 text-white hover:bg-white/5"
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={isUpdating} 
                          className="flex-1 bg-primary hover:bg-primary/90"
                        >
                          {isUpdating ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Updating...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </TabsContent>

                  {/* Photos & Media Tab */}
                  <TabsContent value="media" className="space-y-8 mt-0">
                    <div className="grid lg:grid-cols-2 gap-8">
                      {/* Profile Picture */}
                      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                          <User className="w-5 h-5 text-primary" />
                          Profile Picture
                        </h3>
                        <div className="space-y-4">
                          <div className="w-32 h-32 mx-auto">
                            <Avatar className="w-full h-full border-2 border-primary/30">
                              <AvatarImage src={profile.avatar_url || undefined} />
                              <AvatarFallback className="bg-primary/10 text-primary text-4xl">
                                <User className="w-12 h-12" />
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <SimpleMediaUploader
                            type="avatar"
                            userId={profileId}
                            currentUrl={profile.avatar_url}
                            onUploadSuccess={handleAvatarUpload}
                          />
                        </div>
                        <p className="text-white/40 text-sm mt-3 text-center">
                          Choose a high-quality photo that represents you. Square images work best.
                        </p>
                      </div>

                      {/* Cover Banner */}
                      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                          <Camera className="w-5 h-5 text-primary" />
                          Cover Banner
                        </h3>
                        <div className="space-y-4">
                          <div className="w-full h-32 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center relative overflow-hidden">
                            {profile.banner_url ? (
                              <img 
                                src={profile.banner_url} 
                                alt="Banner preview" 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = '<div class="text-center"><div class="w-8 h-8 text-white/40 mx-auto mb-2"><svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg></div><p class="text-white/60 text-sm">Upload a stunning banner</p></div>';
                                  }
                                }}
                              />
                            ) : (
                              <div className="text-center">
                                <Camera className="w-8 h-8 text-white/40 mx-auto mb-2" />
                                <p className="text-white/60 text-sm">Upload a stunning banner</p>
                              </div>
                            )}
                          </div>
                          <SimpleMediaUploader
                            type="banner"
                            userId={profileId}
                            currentUrl={profile.banner_url}
                            onUploadSuccess={handleBannerUpload}
                          />
                        </div>
                        <p className="text-white/40 text-sm mt-3 text-center">
                          Upload a stunning banner to make your profile stand out. 16:9 ratio recommended.
                        </p>
                      </div>
                    </div>

                    {/* Media Gallery */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                      <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                        <Image className="w-5 h-5 text-primary" />
                        Media Gallery
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <div key={i} className="aspect-square bg-white/5 rounded-xl border border-white/10 flex items-center justify-center group hover:bg-white/10 transition-colors cursor-pointer">
                            <Plus className="w-6 h-6 text-white/40 group-hover:text-white/60" />
                          </div>
                        ))}
                      </div>
                      <p className="text-white/40 text-sm mt-4 text-center">
                        Coming soon: Upload photos and videos to showcase your content
                      </p>
                    </div>
                  </TabsContent>

                  {/* Creator Verification Tab */}
                  <TabsContent value="verification" className="space-y-8 mt-0">
                    {/* Verification Status */}
                    <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 backdrop-blur-xl rounded-2xl p-6 border border-primary/20">
                      <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                        <Crown className="w-5 h-5 text-primary" />
                        Creator Verification Status
                      </h3>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                          <Shield className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Not Verified</p>
                          <p className="text-white/60 text-sm">Complete verification to unlock premium features and start earning</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-white/5 rounded-lg p-3">
                          <p className="text-2xl font-light text-white">🔒</p>
                          <p className="text-xs text-white/60 mt-1">Identity</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                          <p className="text-2xl font-light text-white">💳</p>
                          <p className="text-xs text-white/60 mt-1">Payments</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                          <p className="text-2xl font-light text-white">✨</p>
                          <p className="text-xs text-white/60 mt-1">Premium</p>
                        </div>
                      </div>
                    </div>

                    {/* Identity Verification */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                      <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        Identity Verification
                      </h3>
                      <div className="space-y-6">
                        <div>
                          <label className="text-sm font-medium text-white/80 mb-2 block">
                            Full Legal Name *
                          </label>
                          <Input
                            placeholder="Enter your full legal name"
                            className="bg-white/5 border-white/10 text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-white/80 mb-2 block">
                            Date of Birth *
                          </label>
                          <Input
                            type="date"
                            className="bg-white/5 border-white/10 text-white"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-white/80 mb-2 block">
                            Government ID Upload *
                          </label>
                          <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center">
                            <Upload className="w-12 h-12 text-white/40 mx-auto mb-4" />
                            <p className="text-white/60 mb-2">Upload a clear photo of your government ID</p>
                            <p className="text-xs text-white/40">Accepted: Driver's License, Passport, National ID</p>
                            <Button variant="outline" className="mt-4 border-white/10 text-white hover:bg-white/5">
                              <Upload className="w-4 h-4 mr-2" />
                              Choose File
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Subscription Pricing Setup */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                      <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-primary" />
                        Subscription Pricing
                      </h3>
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="text-sm font-medium text-white/80 mb-2 block">
                              Monthly Subscription Price
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">$</span>
                              <Input
                                type="number"
                                placeholder="9.99"
                                className="bg-white/5 border-white/10 text-white pl-8"
                              />
                            </div>
                            <p className="text-xs text-white/40 mt-1">Recommended: $5-50/month</p>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-white/80 mb-2 block">
                              Annual Discount (%)
                            </label>
                            <Input
                              type="number"
                              placeholder="20"
                              className="bg-white/5 border-white/10 text-white"
                            />
                            <p className="text-xs text-white/40 mt-1">Encourage yearly subscriptions</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submit Application */}
                    <div className="flex gap-4 pt-6 border-t border-white/10">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={onClose} 
                        className="flex-1 border-white/10 text-white hover:bg-white/5"
                      >
                        Save Draft
                      </Button>
                      <Button 
                        type="button"
                        className="flex-1 bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-white font-medium"
                      >
                        <Crown className="w-4 h-4 mr-2" />
                        Submit for Verification
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Privacy & Settings Tab */}
                  <TabsContent value="privacy" className="space-y-8 mt-0">
                    {/* Privacy Settings */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                      <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        Privacy & Visibility
                      </h3>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-white font-medium">Profile Visibility</label>
                            <p className="text-white/60 text-sm">Make your profile visible to everyone</p>
                          </div>
                          <Switch 
                            checked={advancedSettings.profile_visibility}
                            onCheckedChange={(checked) => 
                              setAdvancedSettings(prev => ({ ...prev, profile_visibility: checked }))
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-white font-medium">Show Online Status</label>
                            <p className="text-white/60 text-sm">Let others see when you're online</p>
                          </div>
                          <Switch 
                            checked={advancedSettings.show_online_status}
                            onCheckedChange={(checked) => 
                              setAdvancedSettings(prev => ({ ...prev, show_online_status: checked }))
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-white font-medium">Allow Messages</label>
                            <p className="text-white/60 text-sm">Allow users to send you direct messages</p>
                          </div>
                          <Switch 
                            checked={advancedSettings.allow_messages}
                            onCheckedChange={(checked) => 
                              setAdvancedSettings(prev => ({ ...prev, allow_messages: checked }))
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-white font-medium">Show Location</label>
                            <p className="text-white/60 text-sm">Display your location on your profile</p>
                          </div>
                          <Switch 
                            checked={advancedSettings.show_location}
                            onCheckedChange={(checked) => 
                              setAdvancedSettings(prev => ({ ...prev, show_location: checked }))
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Content Rating */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                      <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
                        <Eye className="w-5 h-5 text-primary" />
                        Content Rating
                      </h3>
                      <div className="space-y-4">
                        {contentRatingOptions.map(({ value, label, icon: Icon }) => (
                          <div key={value} className="flex items-center gap-4">
                            <input
                              type="radio"
                              id={value}
                              name="content_rating"
                              value={value}
                              checked={advancedSettings.content_rating === value}
                              onChange={(e) => 
                                setAdvancedSettings(prev => ({ ...prev, content_rating: e.target.value }))
                              }
                              className="text-primary"
                            />
                            <div className="flex items-center gap-3 flex-1">
                              <Icon className="w-5 h-5 text-primary" />
                              <div>
                                <label htmlFor={value} className="text-white font-medium cursor-pointer">
                                  {label}
                                </label>
                                <p className="text-white/60 text-sm">
                                  {value === 'general' && 'Suitable for all audiences'}
                                  {value === 'mature' && 'Contains mature themes (18+)'}
                                  {value === 'adult' && 'Explicit adult content (21+)'}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notification Preferences */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                      <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-primary" />
                        Notification Preferences
                      </h3>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-white font-medium">New Likes</label>
                            <p className="text-white/60 text-sm">Get notified when someone likes your content</p>
                          </div>
                          <Switch 
                            checked={advancedSettings.notification_preferences.likes}
                            onCheckedChange={(checked) => 
                              setAdvancedSettings(prev => ({ 
                                ...prev, 
                                notification_preferences: { ...prev.notification_preferences, likes: checked }
                              }))
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-white font-medium">New Comments</label>
                            <p className="text-white/60 text-sm">Get notified when someone comments on your posts</p>
                          </div>
                          <Switch 
                            checked={advancedSettings.notification_preferences.comments}
                            onCheckedChange={(checked) => 
                              setAdvancedSettings(prev => ({ 
                                ...prev, 
                                notification_preferences: { ...prev.notification_preferences, comments: checked }
                              }))
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-white font-medium">New Followers</label>
                            <p className="text-white/60 text-sm">Get notified when someone follows you</p>
                          </div>
                          <Switch 
                            checked={advancedSettings.notification_preferences.follows}
                            onCheckedChange={(checked) => 
                              setAdvancedSettings(prev => ({ 
                                ...prev, 
                                notification_preferences: { ...prev.notification_preferences, follows: checked }
                              }))
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-white font-medium">Direct Messages</label>
                            <p className="text-white/60 text-sm">Get notified when you receive a message</p>
                          </div>
                          <Switch 
                            checked={advancedSettings.notification_preferences.messages}
                            onCheckedChange={(checked) => 
                              setAdvancedSettings(prev => ({ 
                                ...prev, 
                                notification_preferences: { ...prev.notification_preferences, messages: checked }
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Save Settings */}
                    <div className="flex gap-4 pt-6 border-t border-white/10">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={onClose} 
                        className="flex-1 border-white/10 text-white hover:bg-white/5"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="button"
                        className="flex-1 bg-primary hover:bg-primary/90 text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Settings
                      </Button>
                    </div>
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};