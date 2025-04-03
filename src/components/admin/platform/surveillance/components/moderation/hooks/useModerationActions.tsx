import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ModerationAction } from "@/types/moderation";

interface UseModerationActionsProps {
  onActionComplete?: (action: ModerationAction) => void;
  onError?: (error: string) => void;
}

export const useModerationActions = ({ onActionComplete, onError }: UseModerationActionsProps = {}) => {
  const [actionInProgress, setActionInProgress] = useState<ModerationAction | null>(null);
  const { toast } = useToast();

  const executeAction = async (
    action: ModerationAction,
    actionFn: () => Promise<void>
  ) => {
    setActionInProgress(action);
    try {
      await actionFn();
      toast({
        title: `Content ${action}d`,
        description: `Content has been successfully ${action}d.`,
      });
      onActionComplete?.(action);
    } catch (error: any) {
      console.error(`Failed to ${action} content:`, error);
      toast({
        title: "Failed to moderate content",
        description: error.message || `Failed to ${action} content. Please try again.`,
        variant: "destructive",
      });
      onError?.(error.message || `Failed to ${action} content.`);
    } finally {
      setActionInProgress(null);
    }
  };

  return { actionInProgress, executeAction, setActionInProgress };
};
