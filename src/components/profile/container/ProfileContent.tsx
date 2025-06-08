
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
  Zap,
  TrendingUp,
  Award
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
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-24 h-24 bg-luxury-dark/50 backdrop-blur-xl border border-red-400/20 rounded-3xl flex items-center justify-center mx-auto mb-6"
            >
              <Heart className="w-12 h-12 text-red-400" />
            </motion.div>
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
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                y: [0, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-24 h-24 bg-luxury-dark/50 backdrop-blur-xl border border-yellow-400/20 rounded-3xl flex items-center justify-center mx-auto mb-6"
            >
              <Bookmark className="w-12 h-12 text-yellow-400" />
            </motion.div>
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
      {/* Premium Content Tabs with enhanced animations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-12"
      >
        <div className="bg-luxury-dark/50 backdrop-blur-xl border border-luxury-primary/20 rounded-2xl p-2 shadow-luxury">
          <div className="flex flex-wrap items-center gap-2">
            {visibleTabs.map((tab, index) => (
              <motion.button
                key={tab.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 group ${
                  activeTab === tab.id
                    ? 'bg-button-gradient text-white shadow-button'
                    : 'text-luxury-muted hover:text-luxury-neutral hover:bg-luxury-primary/10'
                }`}
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <tab.icon className="w-5 h-5" />
                </motion.div>
                <span>{tab.label}</span>
                
                {/* Premium Badge with pulse animation */}
                {tab.premium && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex items-center gap-1"
                  >
                    <Crown className="w-4 h-4 text-yellow-500" />
                  </motion.div>
                )}
                
                {/* Count Badge */}
                {tab.count > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.2 }}
                    className="px-2 py-1 bg-luxury-primary/20 text-luxury-primary text-xs font-bold rounded-full"
                  >
                    {tab.count}
                  </motion.div>
                )}
                
                {/* Active Indicator with smooth transition */}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-button-gradient rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Hover glow effect */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-luxury-primary/10 rounded-xl -z-10 blur-sm"
                />
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Content Area with smooth transitions */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="min-h-[600px]"
      >
        {renderTabContent()}
      </motion.div>

      {/* About Section with enhanced styling */}
      {activeTab === 'posts' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 bg-luxury-dark/30 backdrop-blur-xl border border-luxury-primary/20 rounded-3xl p-8 relative overflow-hidden"
        >
          {/* Animated background pattern */}
          <motion.div
            animate={{ 
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute inset-0 opacity-5 bg-gradient-to-br from-luxury-primary via-luxury-accent to-luxury-secondary"
            style={{ backgroundSize: '400% 400%' }}
          />

          <div className="relative z-10">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="text-3xl font-bold text-luxury-neutral mb-6 flex items-center gap-3"
            >
              <motion.div
                animate={{ 
                  height: ['2rem', '2.5rem', '2rem'],
                  background: ['linear-gradient(45deg, #9b87f5, #d946ef)', 'linear-gradient(45deg, #d946ef, #9b87f5)', 'linear-gradient(45deg, #9b87f5, #d946ef)']
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-2 rounded-full"
              />
              About @{profile.username}
            </motion.h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
              >
                <h3 className="text-xl font-semibold text-luxury-neutral mb-4 flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <Star className="w-5 h-5 text-luxury-accent" />
                  </motion.div>
                  Bio
                </h3>
                <p className="text-luxury-muted text-lg leading-relaxed">
                  {profile.bio || "This creator hasn't added a bio yet."}
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-semibold text-luxury-neutral mb-4 flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Award className="w-5 h-5 text-luxury-primary" />
                    </motion.div>
                    Profile Info
                  </h3>
                  <div className="space-y-3">
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex justify-between items-center p-3 rounded-xl hover:bg-luxury-primary/5 transition-all duration-300"
                    >
                      <span className="text-luxury-muted">Member since</span>
                      <span className="text-luxury-neutral font-medium">{formatDate(profile.created_at)}</span>
                    </motion.div>
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex justify-between items-center p-3 rounded-xl hover:bg-luxury-primary/5 transition-all duration-300"
                    >
                      <span className="text-luxury-muted">Last updated</span>
                      <span className="text-luxury-neutral font-medium">{formatDate(profile.updated_at)}</span>
                    </motion.div>
                    {profile.location && (
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="flex justify-between items-center p-3 rounded-xl hover:bg-luxury-primary/5 transition-all duration-300"
                      >
                        <span className="text-luxury-muted">Location</span>
                        <span className="text-luxury-neutral font-medium">{profile.location}</span>
                      </motion.div>
                    )}
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex justify-between items-center p-3 rounded-xl hover:bg-luxury-primary/5 transition-all duration-300"
                    >
                      <span className="text-luxury-muted">Creator Tier</span>
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 4, repeat: Infinity }}
                        >
                          <Crown className="w-4 h-4 text-yellow-500" />
                        </motion.div>
                        <span className="text-luxury-neutral font-medium">Premium</span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
