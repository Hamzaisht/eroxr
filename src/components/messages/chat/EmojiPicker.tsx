
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Smile } from "lucide-react";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

// Organize emojis into pages like iPhone
const EMOJI_PAGES = [
  // Page 1: Smileys & People
  ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙", "😋", "😛", "😜", "🤪"],
  // Page 2: More expressions
  ["😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🤐", "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "🤥", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢"],
  // Page 3: Hearts & symbols
  ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "☮️", "✝️", "☪️", "🕉️", "☸️"],
  // Page 4: Hand gestures
  ["👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "☝️", "✋", "🤚", "🖐️", "🖖", "👋", "🤏", "💪", "🦾", "🖕", "✍️", "🙏"]
];

// Text to emoji mapping
const TEXT_TO_EMOJI: Record<string, string> = {
  "<3": "❤️",
  "</3": "💔",
  ":)": "🙂",
  ":-)": "😊",
  ":(": "😞",
  ":-(": "😢",
  ":D": "😃",
  ":-D": "😄",
  ";)": "😉",
  ";-)": "😉",
  ":P": "😛",
  ":-P": "😜",
  ":o": "😮",
  ":-o": "😯",
  ":|": "😐",
  ":-|": "😑",
  ":/": "😕",
  ":-/": "😒",
  "xD": "😆",
  "XD": "😂",
  ":*": "😘",
  ":-*": "😗"
};

export const EmojiPicker = ({ onEmojiSelect }: EmojiPickerProps) => {
  const [currentPage, setCurrentPage] = useState(0);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
  };

  const handleTextToEmoji = (text: string) => {
    return TEXT_TO_EMOJI[text] || text;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-white/70 hover:text-white hover:bg-white/10">
          <Smile className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-3 holographic-card border-white/20 bg-black/80 backdrop-blur-xl" side="top">
        {/* Current page emojis */}
        <div className="grid grid-cols-8 gap-2 mb-4">
          {EMOJI_PAGES[currentPage].map((emoji, index) => (
            <button
              key={`${currentPage}-${index}`}
              onClick={() => handleEmojiClick(emoji)}
              className="text-xl hover:bg-white/10 p-2 rounded-lg transition-colors hover:scale-110"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Page dots navigation */}
        <div className="flex justify-center gap-2">
          {EMOJI_PAGES.map((_, pageIndex) => (
            <button
              key={pageIndex}
              onClick={() => setCurrentPage(pageIndex)}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentPage === pageIndex 
                  ? "bg-white" 
                  : "bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* Text shortcuts info */}
        <div className="mt-3 pt-2 border-t border-white/10">
          <p className="text-xs text-white/50 text-center">
            Type &lt;3 for ❤️, :) for 🙂, :D for 😃
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

// Export the text to emoji function for use in message input
export const transformTextToEmoji = (text: string): string => {
  let result = text;
  Object.entries(TEXT_TO_EMOJI).forEach(([textSymbol, emoji]) => {
    result = result.replace(new RegExp(textSymbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), emoji);
  });
  return result;
};
