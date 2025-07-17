
import { useState, useRef, useEffect } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
  };

  const handleTextToEmoji = (text: string) => {
    return TEXT_TO_EMOJI[text] || text;
  };

  // Touch/swipe handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    isDragging.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (Math.abs(e.touches[0].clientX - startX.current) > 10) {
      isDragging.current = true;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    
    const endX = e.changedTouches[0].clientX;
    const diffX = startX.current - endX;
    
    if (Math.abs(diffX) > 50) { // Minimum swipe distance
      if (diffX > 0 && currentPage < EMOJI_PAGES.length - 1) {
        // Swipe left - next page
        setCurrentPage(currentPage + 1);
      } else if (diffX < 0 && currentPage > 0) {
        // Swipe right - previous page
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleDotClick = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-white/70 hover:text-white hover:bg-white/10">
          <Smile className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 holographic-card border-white/20 bg-black/90 backdrop-blur-xl" side="top">
        {/* Current page emojis with proper grid layout */}
        <div 
          ref={containerRef}
          className="grid grid-cols-8 gap-1 mb-4 select-none w-full"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {EMOJI_PAGES[currentPage].map((emoji, index) => (
            <button
              key={`${currentPage}-${index}`}
              onClick={() => handleEmojiClick(emoji)}
              className="relative text-xl hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-110 flex items-center justify-center aspect-square w-full h-10 cursor-pointer border-0 bg-transparent"
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none'
              }}
              type="button"
            >
              <span className="pointer-events-none select-none">{emoji}</span>
            </button>
          ))}
        </div>

        {/* Page dots navigation */}
        <div className="flex justify-center gap-2">
          {EMOJI_PAGES.map((_, pageIndex) => (
            <button
              key={pageIndex}
              onClick={() => handleDotClick(pageIndex)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                currentPage === pageIndex 
                  ? "bg-white scale-125" 
                  : "bg-white/30 hover:bg-white/50 hover:scale-110"
              }`}
              aria-label={`Go to emoji page ${pageIndex + 1}`}
            />
          ))}
        </div>

        {/* Text shortcuts info */}
        <div className="mt-3 pt-2 border-t border-white/10">
          <p className="text-xs text-white/50 text-center">
            Type &lt;3 for ❤️, :) for 🙂, :D for 😃 • Swipe to change pages
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
