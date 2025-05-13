
import React, { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, User, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { runFileDiagnostic } from "@/utils/upload/fileUtils";
import { useAdMediaUpload } from "../hooks/useAdMediaUpload";

interface BDContactCardProps {
  onSuccess?: () => void;
}

export const BDContactCard: React.FC<BDContactCardProps> = ({ onSuccess }) => {
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [videoPreview, setVideoPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Refs for file inputs
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  const session = useSession();
  const { toast } = useToast();
  const { uploadMedia, setAvatarFile, setVideoFile } = useAdMediaUpload();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Run diagnostic on the file
    runFileDiagnostic(file);
    
    // Store the file in the hook
    setAvatarFile(file);
    
    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Run diagnostic on the file
    runFileDiagnostic(file);
    
    // Store the file in the hook
    setVideoFile(file);
    
    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    setVideoPreview(previewUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a dating ad",
        variant: "destructive",
      });
      return;
    }
    
    if (!title || !description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Upload media files first
      const { videoUrl, avatarUrl, error } = await uploadMedia();
      
      if (error) {
        throw new Error(error);
      }
      
      // Create the dating ad record
      const { error: adError } = await supabase.from("dating_ads").insert({
        user_id: session.user.id,
        title,
        description,
        avatar_url: avatarUrl,
        video_url: videoUrl,
        user_type: "body-contact",
        is_active: true,
      });
      
      if (adError) throw adError;
      
      toast({
        title: "Ad created successfully",
        description: "Your dating ad has been published",
      });
      
      // Reset form
      setTitle("");
      setDescription("");
      setAvatarPreview("");
      setVideoPreview("");
      
      if (avatarInputRef.current) avatarInputRef.current.value = "";
      if (videoInputRef.current) videoInputRef.current.value = "";
      
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Error creating ad:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create ad. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <Avatar className="h-24 w-24">
                {avatarPreview ? (
                  <AvatarImage src={avatarPreview} alt="Avatar preview" />
                ) : (
                  <AvatarFallback>
                    <User className="h-12 w-12 text-muted-foreground" />
                  </AvatarFallback>
                )}
              </Avatar>
              
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={avatarInputRef}
                onChange={handleAvatarChange}
                disabled={isSubmitting}
              />
              
              <Button
                type="button"
                size="sm"
                className="absolute -bottom-2 -right-2 rounded-full"
                onClick={() => avatarInputRef.current?.click()}
                disabled={isSubmitting}
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a catchy title"
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe yourself and what you're looking for"
              rows={4}
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Video (optional)</Label>
            {videoPreview ? (
              <div className="relative rounded-md overflow-hidden">
                <video
                  src={videoPreview}
                  className="w-full aspect-video"
                  controls
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setVideoPreview("");
                    if (videoInputRef.current) videoInputRef.current.value = "";
                    setVideoFile(null);
                  }}
                  disabled={isSubmitting}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div className="flex justify-center">
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  ref={videoInputRef}
                  onChange={handleVideoChange}
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full py-8"
                  onClick={() => videoInputRef.current?.click()}
                  disabled={isSubmitting}
                >
                  <Upload className="h-6 w-6 mr-2" />
                  Upload Video
                </Button>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Add a short introduction video (max 2 minutes)
            </p>
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Ad...
              </>
            ) : (
              "Create Dating Ad"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
