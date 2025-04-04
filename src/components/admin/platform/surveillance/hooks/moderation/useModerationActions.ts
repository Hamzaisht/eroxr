
import { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { SurveillanceContentItem } from "@/types/surveillance";
import { ModerationAction } from "@/types/moderation";

interface UseModerationActionsProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useModerationActions = ({ onSuccess, onError }: UseModerationActionsProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const supabase = useSupabaseClient();

  const executeModerationAction = async (
    content: SurveillanceContentItem,
    action: ModerationAction,
    editedContent?: string
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const { content_type, id } = content;
      let update: any = {
        moderation_status: action,
      };

      if (action === 'edit' && editedContent) {
        update.content = editedContent;
      }

      const { error: moderationError } = await supabase
        .from(content_type)
        .update(update)
        .eq('id', id);

      if (moderationError) {
        setError(moderationError);
        if (onError) onError(moderationError);
        throw moderationError;
      }

      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err as Error);
      if (onError) onError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    executeModerationAction,
  };
};
