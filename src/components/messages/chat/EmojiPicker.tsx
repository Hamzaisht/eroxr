
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Smile } from "lucide-react";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

const COMMON_EMOJIS = ["😊", "😂", "❤️", "👍", "🔥", "😍", "🎉", "🙌", "✨", "💕", "😭", "😘", "🥺", "😅", "👀"];

export const EmojiPicker = ({ onEmojiSelect }: EmojiPickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
          <Smile className="h-5 w-5 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
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
      </PopoverContent>
    </Popover>
  );
};
