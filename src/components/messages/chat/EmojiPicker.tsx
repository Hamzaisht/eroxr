
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Smile } from "lucide-react";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

const COMMON_EMOJIS = ["😊", "😂", "❤️", "👍", "🔥", "😍", "🎉", "🙌", "✨", "💕", "😭", "😘", "🥺", "😅", "👀"];

export const EmojiPicker = ({ onEmojiSelect }: EmojiPickerProps) => {
  return (
    <div className="absolute z-50 bottom-full mb-2">
      <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-2 w-64">
        <div className="grid grid-cols-5 gap-2">
          {COMMON_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => onEmojiSelect(emoji)}
              className="text-2xl hover:bg-accent/50 p-2 rounded-lg transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
