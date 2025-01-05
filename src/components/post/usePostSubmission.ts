import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const usePostSubmission = (onSuccess: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (
    content: string,
    selectedFiles: FileList | null,
    isPayingCustomer: boolean | null,
    tags?: string[],
    visibility: "public" | "subscribers_only" = "public"
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
            tags: tags?.length ? tags : null,
            visibility
          },
        ]);

      if (error) throw error;

      toast({
        title: "Post created",
        description: "Your post has been published successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['posts'] });
      onSuccess();
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

  return { handleSubmit, isLoading };
};