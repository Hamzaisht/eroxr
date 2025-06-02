
import { motion } from "framer-motion";
import { Grid3X3, Lock, Image, Video, Mic, Heart, Tag, Radio } from "lucide-react";

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isCreator: boolean;
}

const tabs = [
  { id: "all", label: "All Posts", icon: Grid3X3 },
  { id: "public", label: "Public", icon: Grid3X3 },
  { id: "premium", label: "Premium", icon: Lock },
  { id: "photos", label: "Photos", icon: Image },
  { id: "videos", label: "Videos", icon: Video },
  { id: "audio", label: "Audio", icon: Mic },
  { id: "liked", label: "Liked", icon: Heart },
  { id: "tagged", label: "Tagged", icon: Tag },
  { id: "livestreams", label: "Live", icon: Radio }
];

export const ProfileTabs = ({ activeTab, onTabChange, isCreator }: ProfileTabsProps) => {
  // Filter tabs based on user type
  const visibleTabs = tabs.filter(tab => {
    if (tab.id === "premium" && !isCreator) return false;
    if (tab.id === "livestreams" && !isCreator) return false;
    return true;
  });

  return (
    <div className="w-full border-b border-white/10 mt-8">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {visibleTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  relative flex items-center gap-2 px-4 py-3 whitespace-nowrap transition-all duration-200
                  ${isActive 
                    ? 'text-cyan-400' 
                    : 'text-gray-400 hover:text-white'
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
                
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
