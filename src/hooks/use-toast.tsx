
import { useState, useEffect, createContext, useContext } from "react";
import { Toast } from "@/components/ui/toast";

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastType = {
  id: string;
  title?: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
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

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const addToast = (toast: Omit<ToastType, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, ...toast }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const updateToast = (id: string, toast: Partial<ToastType>) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...toast } : t))
    );
  };

  useEffect(() => {
    const handleTimeout = (toast: ToastType) => {
      if (toast.duration !== undefined) {
        const timeout = setTimeout(() => {
          removeToast(toast.id);
        }, toast.duration);

        return () => clearTimeout(timeout);
      }
    };

    const timeouts = toasts.map(handleTimeout);

    return () => {
      timeouts.forEach((clearFn) => clearFn && clearFn());
    };
  }, [toasts]);

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
  if (!document.querySelector('[data-toast-container]')) {
    console.warn(props.title, props.description);
    if (typeof window !== 'undefined') {
      alert(`${props.title}: ${props.description}`);
    }
  }
};
