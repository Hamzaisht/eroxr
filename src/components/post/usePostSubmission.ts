
import { useState, useRef } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { createUniqueFilePath, uploadFileToStorage } from "@/utils/media/mediaUtils";
import { runFileDiagnostic } from "@/utils/upload/fileUtils";

export const usePostSubmission = (onSuccess: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Critical: Use ref for files
  const filesRef = useRef<File[]>([]);

  const uploadFiles = async (files: FileList | null): Promise<string[]> => {
    if (!files || !files.length || !session?.user?.id) {
      return [];
    }
    
    // Store files in ref
    filesRef.current = Array.from(files);
    
    try {
      // Upload each file and collect URLs
      const mediaUrls = await Promise.all(
        Array.from(files).map(async (file) => {
          // Run diagnostic on each file
          runFileDiagnostic(file);
          
          // Generate unique path
          const filePath = createUniqueFilePath(session.user.id, file);
          
          // Upload to storage
          const result = await uploadFileToStorage('posts', filePath, file);
          
          if (!result.success || !result.url) {
            throw new Error(result.error || "Failed to upload file");
          }
          
          return result.url;
        })
      );
      
      return mediaUrls;
    } catch (error: any) {
      console.error('Media upload error:', error);
      throw error;
    }
  };

  const handleSubmit = async (
    content: string,
    selectedFiles: FileList | null,
    isPayingCustomer: boolean | null,
    tags?: string[],
    visibility: "public" | "subscribers_only" = "public",
    ppvAmount: number | null = null
  ) => {
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

    if (ppvAmount !== null && ppvAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "PPV amount must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      let mediaUrls: string[] = [];

      if (selectedFiles && selectedFiles.length > 0 && isPayingCustomer) {
        mediaUrls = await uploadFiles(selectedFiles);
      }

      const { error } = await supabase
        .from('posts')
        .insert([
          {
            creator_id: session.user.id,
            content,
            media_url: mediaUrls.length > 0 ? mediaUrls : null,
            tags: tags?.length ? tags : null,
            visibility,
            is_ppv: ppvAmount !== null,
            ppv_amount: ppvAmount,
          },
        ]);

      if (error) throw error;

      toast({
        title: "Post created",
        description: "Your post has been published successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['posts'] });
      onSuccess();
      
      // Clear the files ref
      filesRef.current = [];
    } catch (error: any) {
      console.error('Post submission error:', error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading };
};
