import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Image, Loader2, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useQueryClient } from "@tanstack/react-query";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreatePostDialog = ({ open, onOpenChange }: CreatePostDialogProps) => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const { toast } = useToast();
  const session = useSession();
  const queryClient = useQueryClient();
  const [isPayingCustomer, setIsPayingCustomer] = useState<boolean | null>(null);

  // Fetch paying customer status
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

  // Check status when dialog opens
  useEffect(() => {
    if (open) {
      checkPayingCustomerStatus();
    }
  }, [open, session?.user?.id]);

  const handleSubmit = async () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create posts",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please write something before posting",
        variant: "destructive",
      });
      return;
    }

    if (selectedFiles?.length && !isPayingCustomer) {
      toast({
        title: "Premium feature",
        description: "Only paying customers can upload media",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      let mediaUrls: string[] = [];

      if (selectedFiles && selectedFiles.length > 0 && isPayingCustomer) {
        const files = Array.from(selectedFiles);
        mediaUrls = await Promise.all(
          files.map(async (file) => {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${session.user.id}/${fileName}`;

            const { error: uploadError, data } = await supabase.storage
              .from('posts')
              .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
              .from('posts')
              .getPublicUrl(filePath);

            return publicUrl;
          })
        );
      }

      const { error } = await supabase
        .from('posts')
        .insert([
          {
            creator_id: session.user.id,
            content,
            media_url: mediaUrls.length > 0 ? mediaUrls : null,
          },
        ]);

      if (error) throw error;

      toast({
        title: "Post created",
        description: "Your post has been published successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setContent("");
      setSelectedFiles(null);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
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
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="relative overflow-hidden"
              onClick={() => {
                if (!isPayingCustomer) {
                  toast({
                    title: "Premium feature",
                    description: "Only paying customers can upload media",
                    variant: "destructive",
                  });
                  return;
                }
                document.getElementById('file-upload')?.click();
              }}
            >
              {isPayingCustomer ? (
                <Image className="h-4 w-4" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              <input
                type="file"
                id="file-upload"
                multiple
                accept="image/*"
                className="absolute inset-0 cursor-pointer opacity-0"
                onChange={(e) => setSelectedFiles(e.target.files)}
                disabled={!isPayingCustomer}
              />
            </Button>
            {selectedFiles && (
              <span className="text-sm text-muted-foreground">
                {selectedFiles.length} file(s) selected
              </span>
            )}
            {!isPayingCustomer && (
              <span className="text-sm text-muted-foreground">
                Upgrade to upload media
              </span>
            )}
          </div>
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Post
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};