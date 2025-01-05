import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { MediaUploadButton } from "./post/MediaUploadButton";
import { PostSubmitButtons } from "./post/PostSubmitButtons";
import { usePostSubmission } from "./post/usePostSubmission";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { X } from "lucide-react";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreatePostDialog = ({ open, onOpenChange }: CreatePostDialogProps) => {
  const [content, setContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isPayingCustomer, setIsPayingCustomer] = useState<boolean | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const session = useSession();

  const { handleSubmit, isLoading } = usePostSubmission(() => {
    setContent("");
    setSelectedFiles(null);
    setTags([]);
    onOpenChange(false);
  });

  const checkPayingCustomerStatus = async () => {
    if (!session?.user?.id) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('is_paying_customer')
      .eq('id', session.user.id)
      .single();
    
    if (!error && data) {
      setIsPayingCustomer(data.is_paying_customer);
    }
  };

  useEffect(() => {
    if (open) {
      checkPayingCustomerStatus();
    }
  }, [open, session?.user?.id]);

  const handleTagSubmit = (e: React.KeyboardEvent) => {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px]"
          />
          
          <div className="space-y-2">
            <Input
              placeholder="Add tags (press Enter)"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={handleTagSubmit}
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {content && (
            <Card className="p-4">
              <h3 className="text-sm font-medium mb-2">Preview</h3>
              <p className="text-sm whitespace-pre-wrap">{content}</p>
            </Card>
          )}
          
          <MediaUploadButton
            isPayingCustomer={isPayingCustomer}
            onFileSelect={setSelectedFiles}
            selectedFiles={selectedFiles}
          />
          
          <PostSubmitButtons
            isLoading={isLoading}
            onCancel={() => onOpenChange(false)}
            onSubmit={() => handleSubmit(content, selectedFiles, isPayingCustomer, tags)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};