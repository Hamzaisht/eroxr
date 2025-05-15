
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
import { MediaUpload } from "./post/MediaUpload";
import { PostSubmitButtons } from "./post/PostSubmitButtons";
import { SuccessOverlay } from "./post/SuccessOverlay";
import { usePostSubmission } from "./post/usePostSubmission";
import { asUUID, extractProfile } from "@/utils/supabase/helpers";

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
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_paying_customer')
        .eq('id', asUUID(session.user.id))
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }
      
      setIsPayingCustomer(data?.is_paying_customer || false);
    } catch (error) {
      console.error("Error in profile fetch:", error);
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
      <DialogContent className="fixed left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] w-[95%] sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg shadow-xl">
        <AnimatePresence>
          {showSuccess && <SuccessOverlay show={showSuccess} />}
        </AnimatePresence>

        <PostDialogHeader />

        <div className="space-y-6 p-6">
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
          
          <MediaUpload
            selectedFiles={selectedFiles}
            onFileSelect={onFileSelect}
            isPayingCustomer={isPayingCustomer}
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
