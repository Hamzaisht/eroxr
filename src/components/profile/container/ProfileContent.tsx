
import { motion } from "framer-motion";
import { Users, Heart, Share2, MapPin, Calendar } from "lucide-react";

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

export const ProfileContent = ({ profile }: ProfileContentProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-full"></div>
              About
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed">
              {profile.bio || "This user hasn't added a bio yet."}
            </p>
          </motion.div>

          {/* Activity Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-full"></div>
              Recent Activity
            </h2>
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="w-8 h-8 text-slate-500" />
              </div>
              <p className="text-slate-400 text-lg">No recent activity to show</p>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Stats Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
          >
            <h3 className="text-xl font-bold text-white mb-6">Statistics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-slate-300">Followers</span>
                </div>
                <span className="text-white font-bold">0</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-red-400" />
                  </div>
                  <span className="text-slate-300">Likes</span>
                </div>
                <span className="text-white font-bold">0</span>
              </div>
            </div>
          </motion.div>

          {/* Additional Info Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
          >
            <h3 className="text-xl font-bold text-white mb-6">Profile Info</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Member since</span>
                <span className="text-white">{formatDate(profile.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Last updated</span>
                <span className="text-white">{formatDate(profile.updated_at)}</span>
              </div>
              {profile.location && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Location</span>
                  <span className="text-white">{profile.location}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
