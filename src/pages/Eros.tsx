
import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { MediaRenderer } from "@/components/media/MediaRenderer";
import { Loader2, Heart, MessageSquare, Share2 } from "lucide-react";
import { MediaUploader } from "@/components/upload/MediaUploader";

export default function Eros() {
  const session = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    mediaUrl: "",
    isPremium: false
  });

  useEffect(() => {
    // Simulate loading content
    const timer = setTimeout(() => {
      setLoading(false);
      toast({
        title: "Welcome to Eros",
        description: "Experience our immersive content platform",
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [toast]);

  const handleMediaUpload = (url: string) => {
    setFormData(prev => ({ ...prev, mediaUrl: url }));
    toast({
      title: "Media uploaded",
      description: "Your content has been uploaded successfully",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit content",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Here you would typically make an API call to save the content
      console.log("Submitting form data:", formData);
      
      toast({
        title: "Content submitted",
        description: "Your content is now being processed",
      });
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        mediaUrl: "",
        isPremium: false
      });
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your content",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-luxury-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <motion.h1 
        className="text-4xl font-bold mb-6 bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Create Content
      </motion.h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Content Creation Form */}
        <Card className="bg-white/5 backdrop-blur-sm border-luxury-primary/20">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>New Content</CardTitle>
              <CardDescription>Share your content with the community</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter a title for your content"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your content..."
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Media Upload</Label>
                <MediaUploader
                  onComplete={handleMediaUpload}
                  context="post"
                  maxSizeInMB={100}
                  mediaTypes="both"
                  buttonText="Upload Media"
                  showPreview
                  autoUpload
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="premium">Premium Content</Label>
                <Switch
                  id="premium"
                  checked={formData.isPremium}
                  onCheckedChange={checked => setFormData(prev => ({ ...prev, isPremium: checked }))}
                />
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting || !formData.title}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {isSubmitting ? "Publishing..." : "Publish Content"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Preview Card */}
        <Card className="bg-white/5 backdrop-blur-sm border-luxury-primary/20">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>How your content will look</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.mediaUrl ? (
              <MediaRenderer
                source={formData.mediaUrl}
                className="w-full rounded-lg overflow-hidden"
                controls
              />
            ) : (
              <div className="w-full h-48 bg-gray-900/50 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Media preview will appear here</p>
              </div>
            )}
            
            {formData.title && (
              <h3 className="text-xl font-semibold">{formData.title}</h3>
            )}
            
            {formData.description && (
              <p className="text-gray-300">{formData.description}</p>
            )}
            
            {formData.isPremium && (
              <div className="inline-flex items-center px-2 py-1 rounded-full bg-luxury-primary/20 text-luxury-primary text-sm">
                Premium Content
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
