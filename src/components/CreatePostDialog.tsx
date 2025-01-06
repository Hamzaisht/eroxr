import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { PostSubmitButtons } from "./post/PostSubmitButtons";
import { usePostSubmission } from "./post/usePostSubmission";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ImagePlus, Lock } from "lucide-react";
import { TagInput } from "./post/TagInput";
import { VisibilitySelect } from "./post/VisibilitySelect";
import { ContentPreview } from "./post/ContentPreview";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFiles: FileList | null;
  onFileSelect: (files: FileList | null) => void;
}

export const CreatePostDialog = ({ 
  open, 
  onOpenChange,
  selectedFiles,
  onFileSelect
}: CreatePostDialogProps) => {
  const [content, setContent] = useState("");
  const [isPayingCustomer, setIsPayingCustomer] = useState<boolean | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<"public" | "subscribers_only">("public");
  const [isPPV, setIsPPV] = useState(false);
  const [ppvAmount, setPpvAmount] = useState<number | null>(null);
  const session = useSession();
  const { toast } = useToast();

  const { handleSubmit, isLoading } = usePostSubmission(() => {
    setContent("");
    onFileSelect(null);
    setTags([]);
    setVisibility("public");
    setIsPPV(false);
    setPpvAmount(null);
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isPayingCustomer) {
      toast({
        title: "Premium feature",
        description: "Only paying customers can upload media",
        variant: "destructive",
      });
      return;
    }
    onFileSelect(e.target.files);
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
            className="min-h-[100px] bg-luxury-dark/30 border-luxury-neutral/10 text-luxury-neutral placeholder:text-luxury-neutral/40"
          />
          
          <TagInput tags={tags} onTagsChange={setTags} />
          
          <VisibilitySelect 
            visibility={visibility} 
            onVisibilityChange={setVisibility}
          />

          {isPayingCustomer && (
            <div className="space-y-2 p-4 rounded-lg border border-luxury-neutral/10 bg-luxury-dark/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-luxury-primary" />
                  <Label htmlFor="ppv-toggle">Pay-Per-View Content</Label>
                </div>
                <Switch
                  id="ppv-toggle"
                  checked={isPPV}
                  onCheckedChange={setIsPPV}
                />
              </div>
              
              {isPPV && (
                <div className="space-y-2 pt-2">
                  <Label htmlFor="ppv-amount">Amount ($)</Label>
                  <Input
                    id="ppv-amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={ppvAmount || ''}
                    onChange={(e) => setPpvAmount(parseFloat(e.target.value))}
                    placeholder="Enter amount"
                    className="bg-luxury-dark/30 border-luxury-neutral/10"
                  />
                  <p className="text-sm text-muted-foreground">
                    Content will be locked until payment is made
                  </p>
                </div>
              )}
            </div>
          )}

          <ContentPreview content={content} />
          
          <div className="space-y-2">
            <Label>Media</Label>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('post-file-upload')?.click()}
                className="w-full"
              >
                <ImagePlus className="h-4 w-4 mr-2" />
                {selectedFiles?.length ? `${selectedFiles.length} file(s) selected` : 'Add Media'}
              </Button>
              <input
                type="file"
                id="post-file-upload"
                multiple
                accept="image/*,video/*"
                className="hidden"
                onChange={handleFileSelect}
                disabled={!isPayingCustomer}
              />
            </div>
            {!isPayingCustomer && (
              <p className="text-sm text-muted-foreground">
                Upgrade to upload media files
              </p>
            )}
          </div>
          
          <PostSubmitButtons
            isLoading={isLoading}
            onCancel={() => onOpenChange(false)}
            onSubmit={() => handleSubmit(
              content, 
              selectedFiles, 
              isPayingCustomer, 
              tags, 
              visibility,
              isPPV ? ppvAmount : null
            )}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};