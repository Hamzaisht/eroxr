import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence } from "framer-motion";
import { PostDialogHeader } from "./post/PostDialogHeader";
import { PostContentInput } from "./post/PostContentInput";
import { PostSettings } from "./post/PostSettings";
import { ContentPreview } from "./post/ContentPreview";
import { MediaUploadSection } from "./post/MediaUploadSection";
import { PostSubmitButtons } from "./post/PostSubmitButtons";
import { SuccessOverlay } from "./post/SuccessOverlay";
import { usePostSubmission } from "./post/usePostSubmission";

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] relative overflow-hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <AnimatePresence>
          {showSuccess && <SuccessOverlay show={showSuccess} />}
        </AnimatePresence>

        <PostDialogHeader />

        <div className="space-y-6">
          <PostContentInput
            content={content}
            setContent={setContent}
            tags={tags}
            setTags={setTags}
          />
          
          <PostSettings
            isPayingCustomer={isPayingCustomer}
            visibility={visibility}
            setVisibility={setVisibility}
            isPPV={isPPV}
            setIsPPV={setIsPPV}
            ppvAmount={ppvAmount}
            setPpvAmount={setPpvAmount}
          />

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