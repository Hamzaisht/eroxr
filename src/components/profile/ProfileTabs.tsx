
import { motion } from "framer-motion";
import { Grid, Image, Video, Music, Heart, Bookmark, Tag } from "lucide-react";

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isCreator: boolean;
}

export const ProfileTabs = ({ activeTab, onTabChange, isCreator }: ProfileTabsProps) => {
  const tabs = [
    { id: "all", label: "All Posts", icon: Grid },
    { id: "photos", label: "Photos", icon: Image },
    { id: "videos", label: "Videos", icon: Video },
    { id: "audio", label: "Audio", icon: Music },
    { id: "liked", label: "Liked", icon: Heart },
    { id: "tagged", label: "Tagged", icon: Tag },
  ];

  return (
    <div className="w-full px-4 md:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-2 border border-white/10">
            <div className="flex items-center gap-2 overflow-x-auto">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
