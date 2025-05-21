
// This file is maintained for compatibility with shadcn components
// but delegates all functionality to our main toast hooks
import { useToast as useToastHook, ToastType } from "@/hooks/use-toast";

export { useToast as useToastOriginal } from "@/hooks/use-toast";

export const useToast = useToastHook;

export const toast = (props: Parameters<ReturnType<typeof useToastHook>["toast"]>[0]) => {
  // Get the current toast context - this will throw if used outside a ToastProvider
  const { toast: toastFn } = useToastHook();
  return toastFn(props);
};

// Export other types for compatibility
export type { ToastType };
