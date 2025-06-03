
import { motion } from "framer-motion";
import { Grid3X3, Lock, Image, Video, Mic, Heart, Tag, Radio, Zap } from "lucide-react";

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isCreator: boolean;
}

const tabs = [
  { id: "all", label: "All Posts", icon: Grid3X3, color: "from-cyan-500 to-blue-500" },
  { id: "public", label: "Public", icon: Zap, color: "from-green-500 to-emerald-500" },
  { id: "premium", label: "Premium", icon: Lock, color: "from-purple-500 to-pink-500" },
  { id: "photos", label: "Photos", icon: Image, color: "from-orange-500 to-red-500" },
  { id: "videos", label: "Videos", icon: Video, color: "from-red-500 to-pink-500" },
  { id: "audio", label: "Audio", icon: Mic, color: "from-yellow-500 to-orange-500" },
  { id: "liked", label: "Liked", icon: Heart, color: "from-pink-500 to-rose-500" },
  { id: "tagged", label: "Tagged", icon: Tag, color: "from-indigo-500 to-purple-500" },
  { id: "livestreams", label: "Live", icon: Radio, color: "from-red-500 to-pink-500" }
];

export const ProfileTabs = ({ activeTab, onTabChange, isCreator }: ProfileTabsProps) => {
  // Filter tabs based on user type
  const visibleTabs = tabs.filter(tab => {
    if (tab.id === "premium" && !isCreator) return false;
    if (tab.id === "livestreams" && !isCreator) return false;
    return true;
  });

  return (
    <div className="w-full border-b border-white/10 mt-8 sticky top-0 z-40 backdrop-blur-xl bg-gray-900/80">
      <div className="w-full px-4 md:px-8">
        {/* Glassmorphism tab container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-4"
        >
          {visibleTabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -2,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
                className={`
                  relative flex items-center gap-3 px-6 py-3 whitespace-nowrap rounded-2xl transition-all duration-300 border backdrop-blur-sm
                  ${isActive 
                    ? `bg-gradient-to-r ${tab.color} text-white border-transparent shadow-lg shadow-white/20` 
                    : 'text-gray-400 hover:text-white bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                <span className="font-medium text-sm">{tab.label}</span>
                
                {/* Animated background for active tab */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabBackground"
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/10 to-transparent"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                
                {/* Live indicator for livestreams tab */}
                {tab.id === "livestreams" && isActive && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
                  />
                )}
                
                {/* Premium glow effect */}
                {tab.id === "premium" && isActive && (
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-sm"
                  />
                )}
              </motion.button>
            );
          })}
        </motion.div>
        
        {/* Animated underline */}
        <div className="relative h-1">
          <motion.div
            className="absolute bottom-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full"
            style={{
              width: `${100 / visibleTabs.length}%`,
              left: `${(visibleTabs.findIndex(tab => tab.id === activeTab) * 100) / visibleTabs.length}%`
            }}
            initial={false}
            animate={{
              left: `${(visibleTabs.findIndex(tab => tab.id === activeTab) * 100) / visibleTabs.length}%`
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
      </div>
    </div>
  );
};
