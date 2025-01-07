import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { PostSubmitButtons } from "./post/PostSubmitButtons";
import { usePostSubmission } from "./post/usePostSubmission";
import { useToast } from "@/hooks/use-toast";
import { TagInput } from "./post/TagInput";
import { VisibilitySelect } from "./post/VisibilitySelect";
import { ContentPreview } from "./post/ContentPreview";
import { PPVSettings } from "./post/PPVSettings";
import { MediaUploadSection } from "./post/MediaUploadSection";
import { SuccessOverlay } from "./post/SuccessOverlay";
import { AnimatePresence } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

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

  if (!session) {
    return null;
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    // Extract hashtags from content
    const hashtagRegex = /#[^\s#]+/g;
    const foundTags = newContent.match(hashtagRegex)?.map(tag => tag.slice(1)) || [];
    
    // Update tags if new ones are found
    if (foundTags.length > 0) {
      setTags([...new Set([...tags, ...foundTags])]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] relative overflow-hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <AnimatePresence>
          {showSuccess && <SuccessOverlay show={showSuccess} />}
        </AnimatePresence>

        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create New Post</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Textarea
            placeholder="What's on your mind? Use #hashtags to categorize your post..."
            value={content}
            onChange={handleContentChange}
            className="min-h-[120px] bg-luxury-dark/30 border-luxury-neutral/10 text-luxury-neutral placeholder:text-luxury-neutral/40 resize-none"
            autoFocus
          />
          
          <TagInput tags={tags} onTagsChange={setTags} />
          
          <div className="grid gap-6 md:grid-cols-2">
            <VisibilitySelect 
              visibility={visibility} 
              onVisibilityChange={setVisibility}
            />

            {isPayingCustomer && (
              <PPVSettings
                isPPV={isPPV}
                setIsPPV={setIsPPV}
                ppvAmount={ppvAmount}
                setPpvAmount={setPpvAmount}
              />
            )}
          </div>

          {!isPayingCustomer && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Upgrade to a creator account to unlock premium features like PPV content and media uploads.
              </AlertDescription>
            </Alert>
          )}

          <ContentPreview content={content} />
          
          <MediaUploadSection
            selectedFiles={selectedFiles}
            onFileSelect={onFileSelect}
            isPayingCustomer={isPayingCustomer}
            handleFileSelect={(e) => {
              if (!isPayingCustomer) {
                toast({
                  title: "Premium feature",
                  description: "Only paying customers can upload media",
                  variant: "destructive",
                });
                return;
              }
              onFileSelect(e.target.files);
            }}
          />
          
          <PostSubmitButtons
            isLoading={isLoading}
            onCancel={() => {
              setContent("");
              onFileSelect(null);
              setTags([]);
              setVisibility("public");
              setIsPPV(false);
              setPpvAmount(null);
              onOpenChange(false);
            }}
            onSubmit={() => {
              if (!content.trim() && !selectedFiles?.length) {
                toast({
                  title: "Content required",
                  description: "Please add some text or media to your post",
                  variant: "destructive",
                });
                return;
              }
              handleSubmit(
                content, 
                selectedFiles, 
                isPayingCustomer, 
                tags, 
                visibility,
                isPPV ? ppvAmount : null
              );
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};