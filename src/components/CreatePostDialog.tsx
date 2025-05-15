import { useState, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDropzone } from "react-dropzone";
import { Badge } from "@/components/ui/badge";
import { X, Image, Video, FileVideo } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { applyEqualsFilter, getSafeProfile } from "@/utils/supabase/helpers";

interface CreatePostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string, files: FileList | null, tags?: string[]) => Promise<void>;
}

export const CreatePostDialog = ({ isOpen, onClose, onSubmit }: CreatePostDialogProps) => {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState("post");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const session = useSession();
  
  const { data: profile } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const query = supabase
        .from('profiles')
        .select('is_paying_customer');
        
      const { data, error } = await applyEqualsFilter(query, "id", session.user.id)
        .single();
        
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!session?.user?.id
  });
  
  // Extract profile safely with better error handling
  const safeProfile = getSafeProfile(profile);
  const isPayingCustomer = safeProfile?.is_paying_customer || false;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': [],
      'video/*': []
    },
    onDrop: (acceptedFiles) => {
      // Check file restrictions
      if (!isPayingCustomer && acceptedFiles.length > 0) {
        toast({
          title: "Premium Feature",
          description: "Only premium users can upload media. Upgrade your account to unlock this feature.",
          variant: "destructive"
        });
        return;
      }
      
      setSelectedFiles(prev => [...prev, ...acceptedFiles]);
    },
    maxFiles: 5
  });

  const handleSubmit = async () => {
    try {
      if (!content.trim() && selectedFiles.length === 0) {
        toast({
          title: "Empty Post",
          description: "Please add content to your post.",
          variant: "destructive"
        });
        return;
      }
      
      setIsSubmitting(true);
      
      // Convert selectedFiles to FileList for the parent component
      const dataTransfer = new DataTransfer();
      selectedFiles.forEach(file => {
        dataTransfer.items.add(file);
      });
      
      const fileList = selectedFiles.length > 0 ? dataTransfer.files : null;
      
      await onSubmit(content, fileList, tags.length > 0 ? tags : undefined);
      
      // Reset form after successful submission
      setContent("");
      setTags([]);
      setCurrentTag("");
      setSelectedFiles([]);
      setActiveTab("post");
      onClose();
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags(prev => [...prev, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="post" className="flex-1">Create Post</TabsTrigger>
            <TabsTrigger value="media" className="flex-1">
              Add Media {selectedFiles.length > 0 && `(${selectedFiles.length})`}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="post" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content">What's on your mind?</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                placeholder="Share your thoughts..."
                className="resize-none"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (optional)</Label>
              <div className="flex items-center gap-2">
                <input
                  id="tags"
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add tags..."
                  className="flex-1 bg-background px-3 py-2 border border-input rounded-md"
                  disabled={isSubmitting}
                />
                <Button 
                  type="button" 
                  onClick={handleAddTag}
                  disabled={!currentTag.trim() || isSubmitting}
                >
                  Add
                </Button>
              </div>
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="media" className="space-y-4">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center ${
                isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/20"
              }`}
            >
              <input {...getInputProps()} ref={fileInputRef} />
              
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="flex gap-3">
                  <Image className="h-8 w-8 text-muted-foreground" />
                  <FileVideo className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Drag & drop files here, or click to select files
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isPayingCustomer ? 
                      "Upload up to 5 images or videos" : 
                      "Only premium users can upload media"}
                  </p>
                </div>
              </div>
            </div>
            
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Files ({selectedFiles.length})</Label>
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between bg-background p-2 rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        {file.type.includes('image') ? (
                          <Image className="h-4 w-4" />
                        ) : (
                          <Video className="h-4 w-4" />
                        )}
                        <span className="text-sm truncate max-w-[300px]">{file.name}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-3 pt-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || (!content.trim() && selectedFiles.length === 0)}
          >
            {isSubmitting ? "Posting..." : "Post"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
