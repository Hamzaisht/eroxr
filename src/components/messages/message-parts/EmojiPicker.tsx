
import { useState } from "react";
import { motion } from "framer-motion";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
}

export const EmojiPicker = ({ onEmojiSelect, onClose }: EmojiPickerProps) => {
  // Quick emoji set for simple implementation
  const quickEmojis = ["👍", "❤️", "😂", "😢", "😮", "🔥", "👏", "✅"];
  
  // Emoji categories for a more complete picker
  const [activeTab, setActiveTab] = useState(0);
  
  const emojiCategories = [
    {
      name: "Frequently Used",
      emojis: ["👍", "❤️", "😂", "😢", "😮", "🔥", "👏", "✅", "🎉", "🙏"]
    },
    {
      name: "Smileys",
      emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊", "😇", "😍", "🥰", "😘"]
    },
    {
      name: "Gestures",
      emojis: ["👍", "👎", "👌", "✌️", "🤞", "🤟", "🤙", "👈", "👉", "👆", "👇", "👋", "🤚", "🖐️", "✋", "🖖"]
    },
  ];
  
  const currentCategory = emojiCategories[activeTab];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      className="bg-black/70 backdrop-blur-sm rounded-lg border border-white/10 shadow-lg p-2 w-[250px]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-2">
        {emojiCategories.map((category, index) => (
          <button
            key={index}
            className={`text-xs px-3 py-1.5 ${activeTab === index ? 'text-luxury-primary border-b-2 border-luxury-primary' : 'text-white/60'}`}
            onClick={() => setActiveTab(index)}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {/* Emojis grid */}
      <div className="grid grid-cols-8 gap-1">
        {currentCategory.emojis.map((emoji, index) => (
          <button
            key={index}
            className="w-7 h-7 flex items-center justify-center text-lg hover:bg-white/10 rounded transition-colors"
            onClick={() => onEmojiSelect(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>
      
      {/* Search - placeholder for future enhancement */}
      <div className="mt-2 pt-2 border-t border-white/10">
        <input
          type="text"
          placeholder="Search emojis..."
          className="w-full text-xs bg-white/5 border border-white/10 rounded p-1.5 text-white"
        />
      </div>
    </motion.div>
  );
};
