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
          <SuccessOverlay show={showSuccess} />
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
            <PPVSettings
              isPPV={isPPV}
              setIsPPV={setIsPPV}
              ppvAmount={ppvAmount}
              setPpvAmount={setPpvAmount}
            />
          )}

          <ContentPreview content={content} />
          
          <MediaUploadSection
            selectedFiles={selectedFiles}
            onFileSelect={onFileSelect}
            isPayingCustomer={isPayingCustomer}
            handleFileSelect={handleFileSelect}
          />
          
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