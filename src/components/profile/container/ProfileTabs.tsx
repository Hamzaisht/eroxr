
import { motion } from "framer-motion";
import { Grid, Bookmark, Users, Heart } from "lucide-react";
import { ProfilePosts } from "./ProfilePosts";
import { ProfileBookmarks } from "./ProfileBookmarks";
import { ProfileFollowing } from "./ProfileFollowing";
import { ProfileLikes } from "./ProfileLikes";

interface ProfileTabsProps {
  profile: any;
  isOwnProfile: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const ProfileTabs = ({ profile, isOwnProfile, activeTab, setActiveTab }: ProfileTabsProps) => {
  const tabs = [
    { id: "posts", label: "Posts", icon: Grid, public: true },
    { id: "bookmarks", label: "Saved", icon: Bookmark, public: false },
    { id: "following", label: "Following", icon: Users, public: false },
    { id: "likes", label: "Likes", icon: Heart, public: false },
  ];

  const visibleTabs = tabs.filter(tab => tab.public || isOwnProfile);

  return (
    <div className="px-6 pb-6">
      {/* Tab Navigation */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex bg-luxury-dark/30 backdrop-blur-xl rounded-2xl p-2 border border-luxury-primary/10">
          {visibleTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'text-luxury-neutral'
                    : 'text-luxury-muted hover:text-luxury-neutral'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-luxury-primary/20 to-luxury-accent/20 rounded-xl border border-luxury-primary/30"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon className="h-4 w-4 relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        {activeTab === "posts" && <ProfilePosts profileId={profile.id} />}
        {activeTab === "bookmarks" && isOwnProfile && <ProfileBookmarks userId={profile.id} />}
        {activeTab === "following" && isOwnProfile && <ProfileFollowing userId={profile.id} />}
        {activeTab === "likes" && isOwnProfile && <ProfileLikes userId={profile.id} />}
      </motion.div>
    </div>
  );
};
