
import { useState } from "react";
import { ImmersiveAdCreation } from "./ImmersiveAdCreation";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import "./styles.css";

interface CreateBodyContactDialogProps {
  onSuccess?: () => void;
}

export const CreateBodyContactDialog = ({ onSuccess }: CreateBodyContactDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
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

      {isOpen && (
        <ImmersiveAdCreation 
          onClose={() => setIsOpen(false)} 
          onSuccess={onSuccess} 
        />
      )}
    </>
  );
};
