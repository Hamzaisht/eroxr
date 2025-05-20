
import { useState, useEffect, createContext, useContext } from "react";
import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast";

type ToastType = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: "default" | "destructive" | "warning" | "success";
  duration?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

type ToastContextValue = {
  toasts: ToastType[];
  addToast: (toast: Omit<ToastType, "id">) => void;
  removeToast: (id: string) => void;
  updateToast: (id: string, toast: Partial<ToastType>) => void;
};

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1000000;
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

let count = 0;
const genId = () => {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const addToast = (toast: Omit<ToastType, "id">) => {
    const id = genId();
    
    setToasts((prev) => [
      ...prev,
      { 
        id, 
        ...toast, 
        open: true,
        onOpenChange: (open) => {
          if (!open) removeToast(id);
        }
      }
    ].slice(0, TOAST_LIMIT));
  };

  const removeToast = (id: string) => {
    const timeout = setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
      toastTimeouts.delete(id);
    }, TOAST_REMOVE_DELAY);

    toastTimeouts.set(id, timeout);
  };

  const updateToast = (id: string, toast: Partial<ToastType>) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...toast } : t))
    );
  };

  useEffect(() => {
    return () => {
      toastTimeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, updateToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  const toast = (props: Omit<ToastType, "id">) => {
    context.addToast(props);
  };

  return {
    toast,
    toasts: context.toasts,
    dismiss: context.removeToast,
    update: context.updateToast,
  };
}

// Export the toast function directly for use in components
export const toast = (props: Omit<ToastType, "id">) => {
  // This is a fallback for when used outside of context
  console.warn("Using toast outside of ToastProvider. This may not work as expected.");
  
  // Simple implementation that just shows a browser alert if context isn't available
  if (typeof window !== 'undefined') {
    console.warn(props.title, props.description);
    alert(`${props.title}: ${props.description}`);
  }
};
