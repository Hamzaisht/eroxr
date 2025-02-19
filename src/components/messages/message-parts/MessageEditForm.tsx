
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface MessageEditFormProps {
  content: string;
  onChange: (content: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isUpdating: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const MessageEditForm = ({
  content,
  onChange,
  onSave,
  onCancel,
  isUpdating,
  inputRef
}: MessageEditFormProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-3 p-4 rounded-xl bg-luxury-darker/90 backdrop-blur-md border border-luxury-primary/10 shadow-lg min-w-[280px] max-w-[400px]"
    >
      <Input
        ref={inputRef}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSave();
          }
          if (e.key === 'Escape') {
            onCancel();
          }
        }}
        className="w-full bg-luxury-darker/50 border-none focus:ring-1 focus:ring-luxury-primary/50 rounded-lg px-4 py-2"
        autoFocus
      />
      <div className="flex items-center justify-end gap-2">
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={onCancel}
          className="text-luxury-neutral hover:text-white rounded-lg px-4"
          disabled={isUpdating}
        >
          Cancel
        </Button>
        <Button 
          size="sm" 
          onClick={onSave} 
          className="bg-luxury-primary hover:bg-luxury-primary/90 rounded-lg px-4"
          disabled={isUpdating}
        >
          {isUpdating ? (
            <span className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Check className="h-4 w-4" />
              </motion.div>
              Saving...
            </span>
          ) : (
            'Save'
          )}
        </Button>
      </div>
    </motion.div>
  );
};
