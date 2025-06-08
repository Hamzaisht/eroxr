
import { useState } from "react";
import { motion } from "framer-motion";
import { PostsFeed } from "../PostsFeed";
import { 
  Grid, 
  User, 
  Heart, 
  Bookmark, 
  Settings, 
  Camera,
  Video,
  Music,
  Star,
  Crown,
  Zap
} from "lucide-react";

interface ProfileData {
  id: string;
  username: string;
  bio?: string;
  avatar_url?: string;
  banner_url?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

interface ProfileContentProps {
  profile: ProfileData;
  isOwnProfile: boolean;
}

export const ProfileContent = ({ profile, isOwnProfile }: ProfileContentProps) => {
  const [activeTab, setActiveTab] = useState('posts');

  const tabs = [
    {
      id: 'posts',
      label: 'Posts',
      icon: Grid,
      count: 0, // Will be updated with real data
      premium: false
    },
    {
      id: 'media',
      label: 'Media',
      icon: Camera,
      count: 0,
      premium: false
    },
    {
      id: 'videos',
      label: 'Videos',
      icon: Video,
      count: 0,
      premium: true
    },
    {
      id: 'audio',
      label: 'Audio',
      icon: Music,
      count: 0,
      premium: true
    },
    {
      id: 'liked',
      label: 'Liked',
      icon: Heart,
      count: 0,
      premium: false,
      private: true
    },
    {
      id: 'saved',
      label: 'Saved',
      icon: Bookmark,
      count: 0,
      premium: false,
      private: true
    }
  ];

  const visibleTabs = tabs.filter(tab => !tab.private || isOwnProfile);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'posts':
      case 'media':
      case 'videos':
      case 'audio':
        return <PostsFeed profileId={profile.id} isOwnProfile={isOwnProfile} />;
      
      case 'liked':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-luxury-dark/50 backdrop-blur-xl border border-red-400/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-luxury-neutral mb-3">Liked Posts</h3>
            <p className="text-luxury-muted">Your liked content will appear here</p>
          </motion.div>
        );
      
      case 'saved':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-luxury-dark/50 backdrop-blur-xl border border-yellow-400/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Bookmark className="w-12 h-12 text-yellow-400" />
            </div>
            <h3 className="text-2xl font-bold text-luxury-neutral mb-3">Saved Posts</h3>
            <p className="text-luxury-muted">Your saved content will appear here</p>
          </motion.div>
        );
      
      default:
        return <PostsFeed profileId={profile.id} isOwnProfile={isOwnProfile} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      {/* Premium Content Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-12"
      >
        <div className="bg-luxury-dark/50 backdrop-blur-xl border border-luxury-primary/20 rounded-2xl p-2 shadow-luxury">
          <div className="flex flex-wrap items-center gap-2">
            {visibleTabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-button-gradient text-white shadow-button'
                    : 'text-luxury-muted hover:text-luxury-neutral hover:bg-luxury-primary/10'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
                
                {/* Premium Badge */}
                {tab.premium && (
                  <div className="flex items-center gap-1">
                    <Crown className="w-4 h-4 text-yellow-500" />
                  </div>
                )}
                
                {/* Count Badge */}
                {tab.count > 0 && (
                  <div className="px-2 py-1 bg-luxury-primary/20 text-luxury-primary text-xs font-bold rounded-full">
                    {tab.count}
                  </div>
                )}
                
                {/* Active Indicator */}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-button-gradient rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Content Area */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="min-h-[600px]"
      >
        {renderTabContent()}
      </motion.div>

      {/* About Section at the Bottom */}
      {activeTab === 'posts' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 bg-luxury-dark/30 backdrop-blur-xl border border-luxury-primary/20 rounded-3xl p-8"
        >
          <h2 className="text-3xl font-bold text-luxury-neutral mb-6 flex items-center gap-3">
            <div className="w-2 h-8 bg-button-gradient rounded-full" />
            About @{profile.username}
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-luxury-neutral mb-4">Bio</h3>
              <p className="text-luxury-muted text-lg leading-relaxed">
                {profile.bio || "This creator hasn't added a bio yet."}
              </p>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-luxury-neutral mb-4">Profile Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-luxury-muted">Member since</span>
                    <span className="text-luxury-neutral font-medium">{formatDate(profile.created_at)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-luxury-muted">Last updated</span>
                    <span className="text-luxury-neutral font-medium">{formatDate(profile.updated_at)}</span>
                  </div>
                  {profile.location && (
                    <div className="flex justify-between items-center">
                      <span className="text-luxury-muted">Location</span>
                      <span className="text-luxury-neutral font-medium">{profile.location}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-luxury-muted">Creator Tier</span>
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-yellow-500" />
                      <span className="text-luxury-neutral font-medium">Premium</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
