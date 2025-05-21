
import { useState, useEffect } from "react";
import { ImmersiveAdCreation } from "./immersive-creation";
import { Button } from "@/components/ui/button";
import { Plus, X, Heart } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import "./styles.css";

interface CreateBodyContactDialogProps {
  onSuccess?: () => void;
}

export const CreateBodyContactDialog = ({ onSuccess }: CreateBodyContactDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [animateButton, setAnimateButton] = useState(false);

  // Auto-animate the button periodically to attract attention
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimateButton(true);
      setTimeout(() => setAnimateButton(false), 1000);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Prevent page scroll when dialog is open
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }
  }, [isOpen]);

  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button
        onClick={() => setIsOpen(true)}
        className="relative overflow-hidden rounded-full px-5 py-2.5 font-semibold shadow-lg bg-gradient-to-r from-luxury-primary to-luxury-secondary text-white transition-all hover:from-luxury-secondary hover:to-luxury-primary duration-500 hover:shadow-[0_0_24px_rgba(155,135,245,0.4)] group focus-visible:ring-2 focus-visible:ring-luxury-primary focus-visible:ring-offset-2"
        aria-label="Create a new body contact"
      >
        <span className="flex items-center gap-2">
          <Heart className={`h-5 w-5 ${animateButton ? 'animate-pulse' : ''} group-hover:scale-110 transition-transform duration-300`} />
          <span className="whitespace-nowrap">Create Dating Ad</span>
        </span>
        <span className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(120deg,rgba(155,135,245,0.18)_0%,rgba(217,70,239,0.13)_96%,rgba(155,135,245,0.09)_100%)] opacity-0 group-hover:opacity-100 group-hover:animate-shine" />
      </Button>

      {isOpen && (
        <DialogContent
          className="flex flex-col max-h-[95vh] w-[95vw] sm:w-[90vw] md:max-w-[90vw] lg:max-w-[1680px] m-auto p-0 rounded-2xl border-none bg-gradient-to-br from-[#181B24e6] via-[#161B22e1] to-[#0D1117ed] overflow-hidden"
          style={{
            boxShadow: "0 8px 40px 0 rgba(155,135,245,0.22), 0 1.5px 0 0 rgba(217,70,239,0.09), 0 0 0 1px rgba(255,255,255,0.07) inset",
            backdropFilter: "blur(24px)",
          }}
        >
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="flex items-center justify-between px-14 pt-9 pb-2 border-b border-white/10 bg-gradient-to-r from-transparent via-luxury-primary/10 to-transparent rounded-t-2xl">
              <span className="text-xl md:text-3xl font-bold text-white/80 tracking-tight select-none">
                Create Dating Profile
              </span>
              <button
                className="group inline-flex items-center justify-center rounded-full bg-transparent hover:bg-luxury-primary/15 p-2 transition"
                onClick={() => setIsOpen(false)}
                tabIndex={0}
                type="button"
              >
                <span className="sr-only">Close</span>
                <X className="h-7 w-7 text-luxury-primary group-hover:text-luxury-secondary transition" />
              </button>
            </div>
            
            <div className="flex-1 min-h-0 p-4 md:p-8 overflow-y-auto custom-scrollbar">
              <ImmersiveAdCreation
                onClose={() => setIsOpen(false)}
                onSuccess={handleSuccess}
              />
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};
