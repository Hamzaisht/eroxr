
import { useState } from "react";
import { ImmersiveAdCreation } from "./immersive-creation";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
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
          // Make the dialog nearly fullscreen on desktop, larger on mobile/tablet, add only minimal paddings.
          className="p-0 !w-[99vw] !max-w-[1680px] !h-[98vh] !min-h-[750px] m-0 bg-gradient-to-br from-[#181B24e6] via-[#161B22e1] to-[#0D1117ed] rounded-2xl border-none shadow-[0_10px_56px_0_rgba(155,135,245,0.22)] glass-morph custom-popup-content custom-scrollbar flex flex-col"
          style={{
            boxShadow:
              "0 8px 40px 0 rgba(155,135,245,0.22), 0 1.5px 0 0 rgba(217,70,239,0.09), 0 0 0 1px rgba(255,255,255,0.07) inset",
            backdropFilter: "blur(24px)",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            minHeight: "98vh",
            height: "98vh",
            margin: 0,
            padding: 0,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-14 pt-9 pb-2 border-b border-white/10 bg-gradient-to-r from-transparent via-luxury-primary/10 to-transparent rounded-t-2xl w-full min-h-[70px]">
            <span className="text-xl md:text-3xl font-bold text-white/80 tracking-tight select-none">Create Body Contact</span>
            <button
              className="group inline-flex items-center justify-center rounded-full bg-transparent hover:bg-luxury-primary/15 p-2 transition"
              aria-label="Close dialog"
              onClick={() => setIsOpen(false)}
              tabIndex={0}
              type="button"
              autoFocus
            >
              <span className="sr-only">Close</span>
              <X className="h-7 w-7 text-luxury-primary group-hover:text-luxury-secondary transition" />
            </button>
          </div>
          {/* Form/content area: take 100% of available space and never force a scroll unless xs device */}
          <div className="w-full h-full flex-1 flex items-center justify-center px-2 md:px-10 py-6 glass-morph-bg" style={{
            minHeight: "0",
            height: "calc(98vh - 70px)", // minus header
            overflow: "visible",
          }}>
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
