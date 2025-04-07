
import { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useToast } from "./use-toast";
import { SurveillanceContentItem, LiveSession } from "@/types/surveillance";
import { ModerationAction } from "@/types/moderation";

export const useModerationActions = () => {
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const supabase = useSupabaseClient();
  const { toast } = useToast();

  const handleModeration = async (
    content: LiveSession | SurveillanceContentItem,
    action: ModerationAction,
    editedContent?: string
  ) => {
    setActionInProgress(content.id);
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
        toast({
          title: "Moderation Failed",
          description: `Could not ${action} content. Please try again.`,
          variant: "destructive",
        });
        throw moderationError;
      }

      toast({
        title: "Content Moderated",
        description: `Successfully ${action} content.`,
      });
    } catch (err: any) {
      console.error("Moderation Error:", err);
      toast({
        title: "Moderation Failed",
        description: `Failed to ${action} content.`,
        variant: "destructive",
      });
    } finally {
      setActionInProgress(null);
    }
  };

  return {
    handleModeration,
    actionInProgress,
  };
};
