
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface MessageEditFormProps {
  content: string;
  onChange: (value: string) => void;
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
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSave();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Input
        ref={inputRef}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="bg-transparent border-white/20 text-white"
        disabled={isUpdating}
        autoFocus
      />
      <div className="flex justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isUpdating}
          className="text-xs h-7"
        >
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={onSave}
          disabled={!content.trim() || isUpdating}
          className="text-xs h-7"
        >
          {isUpdating ? (
            <>
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              Saving...
            </>
          ) : (
            "Save"
          )}
        </Button>
      </div>
    </div>
  );
};
