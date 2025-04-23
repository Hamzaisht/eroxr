
import { useState } from "react";
import { ImmersiveAdCreation } from "./immersive-creation";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import "./styles.css";

interface CreateBodyContactDialogProps {
  onSuccess?: () => void;
}

export const CreateBodyContactDialog = ({ onSuccess }: CreateBodyContactDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button 
        onClick={() => setIsOpen(true)}
        className="relative overflow-hidden bg-gradient-to-r from-luxury-primary to-luxury-secondary 
          hover:from-luxury-secondary hover:to-luxury-primary text-white
          transition-all duration-500 hover:shadow-[0_0_20px_rgba(155,135,245,0.4)]
          group"
      >
        <span className="relative flex items-center z-10">
          <PlusCircle className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
          Create Body Contact
        </span>
        <span className="absolute inset-0 bg-[linear-gradient(110deg,rgba(155,135,245,0.3)_0%,rgba(155,135,245,0)_35%,rgba(155,135,245,0)_65%,rgba(155,135,245,0.3)_100%)]
          opacity-0 group-hover:opacity-100 group-hover:animate-shine"></span>
      </Button>

      <DialogContent
        className="border-none bg-gradient-to-br from-[#161B22ef] to-[#0D1117ee] max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl transition-all duration-300 rounded-2xl shadow-2xl flex flex-col p-0"
      >
        {/* Always render a single child, conditionally render content */}
        {isOpen && (
          <div className="w-full min-h-[60vh] flex items-center justify-center p-1 md:p-2">
            <ImmersiveAdCreation
              onClose={() => setIsOpen(false)}
              onSuccess={onSuccess}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
