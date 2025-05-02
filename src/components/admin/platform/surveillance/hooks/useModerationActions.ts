
import { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { SurveillanceContentItem, LiveSession, ModerationAction } from "@/types/surveillance";

interface UseModerationActionsProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useModerationActions = ({ onSuccess, onError }: UseModerationActionsProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const supabase = useSupabaseClient();

  const executeModerationAction = async (
    content: SurveillanceContentItem | LiveSession,
    action: ModerationAction,
    editedContent?: string
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if it's a LiveSession or SurveillanceContentItem
      const contentType = 'content_type' in content ? content.content_type : 
                        ('type' in content ? content.type : null);
      
      const id = content.id;

      if (!contentType || !id) {
        throw new Error("Invalid content: missing content type or ID");
      }

      let update: any = {
        moderation_status: action,
      };

      if (action === 'edit' && editedContent) {
        update.content = editedContent;
      }

      // Determine the table to update based on content type
      const table = getTableNameFromContentType(contentType);

      if (!table) {
        throw new Error(`Unknown content type: ${contentType}`);
      }

      const { error: moderationError } = await supabase
        .from(table)
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

  // Helper function to determine table name
  const getTableNameFromContentType = (contentType: string): string | null => {
    switch (contentType) {
      case 'post':
      case 'posts':
        return 'posts';
      case 'video':
      case 'videos':
        return 'videos';
      case 'audio':
      case 'audios':
        return 'audios';
      case 'story':
      case 'stories':
        return 'stories';
      case 'stream':
      case 'live_streams':
        return 'live_streams';
      case 'chat':
      case 'direct_messages':
        return 'direct_messages';
      default:
        return null;
    }
  };

  return {
    isLoading,
    error,
    executeModerationAction,
  };
};
