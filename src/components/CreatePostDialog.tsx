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
import { ImagePlus, Lock, CheckCircle2 } from "lucide-react";
import { TagInput } from "./post/TagInput";
import { VisibilitySelect } from "./post/VisibilitySelect";
import { ContentPreview } from "./post/ContentPreview";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";

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
  const [showSuccess, setShowSuccess] = useState(false);
  const session = useSession();
  const { toast } = useToast();

  const { handleSubmit, isLoading } = usePostSubmission(() => {
    setShowSuccess(true);
    toast({
      title: "Post Created! 🎉",
      description: "Your content is now live and visible to your audience",
      duration: 3000,
    });
    
    // Reset form after a brief delay to show success animation
    setTimeout(() => {
      setContent("");
      onFileSelect(null);
      setTags([]);
      setVisibility("public");
      setIsPPV(false);
      setPpvAmount(null);
      setShowSuccess(false);
      onOpenChange(false);
    }, 1500);
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
      <DialogContent className="sm:max-w-[600px] relative overflow-hidden">
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 15 }}
                className="flex flex-col items-center space-y-4 text-center"
              >
                <CheckCircle2 className="w-16 h-16 text-green-500" />
                <h3 className="text-xl font-semibold">Post Created Successfully!</h3>
                <p className="text-muted-foreground">Your content is now live</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2 p-4 rounded-lg border border-luxury-neutral/10 bg-luxury-dark/20"
            >
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
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-2 pt-2"
                >
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
                </motion.div>
              )}
            </motion.div>
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