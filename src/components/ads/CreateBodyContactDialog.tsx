import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Upload, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const CreateBodyContactDialog = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [relationshipStatus, setRelationshipStatus] = useState<"single" | "couple" | "other">("single");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [location, setLocation] = useState("");
  const [ageRange, setAgeRange] = useState({ lower: 18, upper: 99 });
  const [bodyType, setBodyType] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  
  const session = useSession();
  const { toast } = useToast();

  const bodyTypes = [
    "athletic", "average", "slim", "curvy", "muscular", "plus_size"
  ];

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!tags.includes(currentTag.trim())) {
        setTags([...tags, currentTag.trim()]);
      }
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast({
          title: "File too large",
          description: "Video must be less than 50MB",
          variant: "destructive",
        });
        return;
      }
      setVideoFile(file);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Avatar must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Please login",
        description: "You need to be logged in to create a body contact ad",
        variant: "destructive",
      });
      return;
    }

    if (!title || !description || !location || !bodyType) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      let videoUrl = null;
      let avatarUrl = null;

      if (videoFile) {
        const videoFileName = `${session.user.id}/${Date.now()}_video.mp4`;
        const { error: videoError } = await supabase.storage
          .from('dating-videos')
          .upload(videoFileName, videoFile);

        if (videoError) throw videoError;

        const { data: { publicUrl } } = supabase.storage
          .from('dating-videos')
          .getPublicUrl(videoFileName);
        
        videoUrl = publicUrl;
      }

      if (avatarFile) {
        const avatarFileName = `${session.user.id}/${Date.now()}_avatar.jpg`;
        const { error: avatarError } = await supabase.storage
          .from('avatars')
          .upload(avatarFileName, avatarFile);

        if (avatarError) throw avatarError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(avatarFileName);
        
        avatarUrl = publicUrl;
      }

      const { error } = await supabase
        .from("dating_ads")
        .insert({
          user_id: session.user.id,
          title,
          description,
          relationship_status: relationshipStatus,
          looking_for: lookingFor,
          tags,
          country: "sweden", // Default for demo
          city: location,
          age_range: `[${ageRange.lower},${ageRange.upper}]`,
          body_type: bodyType,
          video_url: videoUrl,
          user_type: relationshipStatus === "couple" ? "couple_mf" : "male",
          is_active: true,
        });

      if (error) throw error;

      if (avatarUrl) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ avatar_url: avatarUrl })
          .eq("id", session.user.id);

        if (profileError) throw profileError;
      }

      toast({
        title: "Success!",
        description: "Your body contact ad has been created",
      });
      
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error creating ad:", error);
      toast({
        title: "Error",
        description: "Failed to create body contact ad",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setRelationshipStatus("single");
    setTags([]);
    setCurrentTag("");
    setLocation("");
    setAgeRange({ lower: 18, upper: 99 });
    setBodyType("");
    setVideoFile(null);
    setAvatarFile(null);
    setAvatarPreview("");
    setLookingFor([]);
  };

  return (
    <>
      <Button 
        onClick={() => setOpen(true)}
        className="bg-gradient-to-r from-luxury-primary to-luxury-secondary hover:from-luxury-secondary hover:to-luxury-primary text-white"
      >
        Create Body Contact
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="space-y-6 p-6">
            <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
              Create Body Contact Ad
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarPreview} />
                    <AvatarFallback>
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <Label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer hover:bg-primary/90"
                  >
                    <Upload className="h-4 w-4" />
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter a catchy title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Tell others about yourself and what you're looking for..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Relationship Status</Label>
                  <Select
                    value={relationshipStatus}
                    onValueChange={(value: "single" | "couple" | "other") => setRelationshipStatus(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="couple">Couple</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bodyType">Body Type</Label>
                  <Select value={bodyType} onValueChange={setBodyType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select body type" />
                    </SelectTrigger>
                    <SelectContent>
                      {bodyTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Enter your city"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Minimum Age</Label>
                  <Input
                    type="number"
                    min="18"
                    max="99"
                    value={ageRange.lower}
                    onChange={(e) => setAgeRange({ ...ageRange, lower: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Maximum Age</Label>
                  <Input
                    type="number"
                    min="18"
                    max="99"
                    value={ageRange.upper}
                    onChange={(e) => setAgeRange({ ...ageRange, upper: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <Input
                  placeholder="Add tags (press Enter)"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Video Profile</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="hidden"
                    id="video-upload"
                  />
                  <Label
                    htmlFor="video-upload"
                    className="flex items-center gap-2 cursor-pointer bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-md"
                  >
                    <Upload className="h-4 w-4" />
                    {videoFile ? 'Change Video' : 'Upload Video'}
                  </Label>
                  {videoFile && (
                    <span className="text-sm text-muted-foreground">
                      {videoFile.name}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Maximum size: 50MB. Recommended length: 30-60 seconds.
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-luxury-primary to-luxury-secondary hover:from-luxury-secondary hover:to-luxury-primary text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Ad"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};