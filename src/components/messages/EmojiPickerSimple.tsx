
import React from 'react';
import { Button } from '@/components/ui/button';

interface EmojiPickerSimpleProps {
  onEmojiSelect: (emoji: { native: string }) => void;
}

// Simple emoji picker with common emojis
export const EmojiPickerSimple: React.FC<EmojiPickerSimpleProps> = ({ onEmojiSelect }) => {
  const commonEmojis = [
    { native: "😊" }, { native: "😂" }, { native: "👍" }, { native: "❤️" }, 
    { native: "🔥" }, { native: "👀" }, { native: "🙌" }, { native: "✅" },
    { native: "😎" }, { native: "🎉" }, { native: "🤔" }, { native: "👏" },
    { native: "🙏" }, { native: "💯" }, { native: "🌟" }, { native: "😍" },
    { native: "💪" }, { native: "🤣" }, { native: "😘" }, { native: "🥰" },
  ];

  return (
    <div className="p-2 grid grid-cols-5 gap-2 bg-luxury-darker rounded-md max-h-[200px] overflow-y-auto">
      {commonEmojis.map((emoji, index) => (
        <Button
          key={index}
          type="button"
          variant="ghost"
          className="h-8 w-8 p-0 flex items-center justify-center text-lg"
          onClick={() => onEmojiSelect(emoji)}
        >
          {emoji.native}
        </Button>
      ))}
    </div>
  );
};
