
import { useState } from "react";
import { ImmersiveAdCreation } from "./immersive-creation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import "./styles.css";

interface CreateBodyContactDialogProps {
  onSuccess?: () => void;
}

export const CreateBodyContactDialog = ({ onSuccess }: CreateBodyContactDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent page scroll when dialog is open (accessibility polish)
  if (typeof window !== "undefined") {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button
        onClick={() => setIsOpen(true)}
        className="relative gap-2 overflow-hidden rounded-full px-5 py-2.5 font-semibold shadow-lg bg-gradient-to-r from-luxury-primary to-luxury-secondary text-white transition-all hover:from-luxury-secondary hover:to-luxury-primary duration-500 hover:shadow-[0_0_24px_rgba(155,135,245,0.4)] group focus-visible:ring-2 focus-visible:ring-luxury-primary focus-visible:ring-offset-2"
        aria-label="Create a new body contact"
      >
        <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
        Create Body Contact
        {/* Animated Shine Effect */}
        <span className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(120deg,rgba(155,135,245,0.18)_0%,rgba(217,70,239,0.13)_96%,rgba(155,135,245,0.09)_100%)] opacity-0 group-hover:opacity-100 group-hover:animate-shine" />
      </Button>

      {isOpen && (
        <DialogContent
          className="p-0 bg-gradient-to-br from-[#181B24e6] via-[#161B22e1] to-[#0D1117ed] max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl rounded-2xl border-none shadow-[0_10px_56px_0_rgba(155,135,245,0.22)] animate-fade-in glass-morph custom-popup-content custom-scrollbar"
          style={{
            boxShadow:
              "0 8px 40px 0 rgba(155,135,245,0.17), 0 1.5px 0 0 rgba(217,70,239,0.07), 0 0 0 1px rgba(255,255,255,0.06) inset",
            backdropFilter: "blur(20px)",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            minHeight: "64vh",
          }}
        >
          {/* Premium styled header */}
          <div className="flex items-center justify-between px-7 pt-6 pb-2 border-b border-white/10 bg-gradient-to-r from-transparent via-luxury-primary/10 to-transparent rounded-t-2xl w-full">
            <span className="text-lg md:text-xl font-bold text-white/80 tracking-tight select-none">Create Body Contact</span>
            <button
              className="group inline-flex items-center justify-center rounded-full bg-transparent hover:bg-luxury-primary/15 p-1.5 transition"
              aria-label="Close dialog"
              onClick={() => setIsOpen(false)}
              tabIndex={0}
              type="button"
              autoFocus
            >
              <span className="sr-only">Close</span>
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6 text-luxury-primary group-hover:text-luxury-accent transition"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          {/* Content Area */}
          <div className="w-full min-h-[60vh] flex items-center justify-center px-1 pb-6 pt-2 md:px-3 md:pb-8 md:pt-3 transition">
            <ImmersiveAdCreation
              onClose={() => setIsOpen(false)}
              onSuccess={onSuccess}
            />
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};
