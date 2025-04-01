
import { useToast } from "@/hooks/use-toast";

interface TipNotificationsReturn {
  showTipNotification: (message: string) => void;
}

export function useTipNotifications(): TipNotificationsReturn {
  const { toast } = useToast();

  const showTipNotification = (message: string) => {
    toast({
      title: "Tip Notification",
      description: message,
    });
  };

  return {
    showTipNotification
  };
}
