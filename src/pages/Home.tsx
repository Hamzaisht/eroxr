
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { NewPostCreator } from "@/components/NewPostCreator";
import { CreatorsFeed } from "@/components/CreatorsFeed";
import { FeaturedCreators } from "@/components/FeaturedCreators";
import { StoryReel } from "@/components/StoryReel";
import { TrendingCreators } from "@/components/TrendingCreators";
import PromotedAds from "@/components/PromotedAds";
import { SubscribedCreators } from "@/components/SubscribedCreators";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Crown, Sparkles, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user, profile, isLoading } = useCurrentUser();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate("/profile");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-slate-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 relative">
      {/* Greek Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0 bg-repeat bg-[length:80px_80px]" 
          style={{
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 0L65 35L100 35L72.5 57.5L80 92.5L50 75L20 92.5L27.5 57.5L0 35L35 35Z" fill="#E5E7EB" opacity="0.3"/></svg>')}")`
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-8 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Crown className="w-10 h-10 text-slate-300" />
                <div>
                  <h1 className="text-3xl font-bold text-slate-100">
                    Welcome to the Divine Realm, {profile?.username || 'Creator'}
                  </h1>
                  <p className="text-slate-400 text-lg">
                    Your celestial content awaits
                  </p>
                </div>
              </div>
              
              <Button
                onClick={goToProfile}
                className="bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-500 hover:to-gray-500 text-white px-6 py-3 rounded-2xl font-semibold shadow-2xl"
              >
                <Crown className="w-5 h-5 mr-2" />
                Visit Divine Studio
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                { icon: Users, label: 'Followers', value: '2.4K', color: 'from-slate-500 to-gray-500' },
                { icon: Heart, label: 'Likes', value: '18.7K', color: 'from-slate-600 to-gray-600' },
                { icon: Sparkles, label: 'Posts', value: '127', color: 'from-slate-500 to-gray-500' },
                { icon: Crown, label: 'Divine Score', value: '98%', color: 'from-slate-600 to-gray-600' }
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/20"
                  >
                    <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-slate-200 text-center mb-1">
                      {stat.value}
                    </div>
                    <div className="text-slate-400 text-center text-sm">
                      {stat.label}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Story Reel */}
        <div className="px-4 sm:px-6 lg:px-8 mb-8">
          <div className="max-w-7xl mx-auto">
            <StoryReel />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Left Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <FeaturedCreators />
              <TrendingCreators />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <NewPostCreator onPostCreated={() => setIsCreatePostOpen(true)} />
              <CreatorsFeed />
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <SubscribedCreators />
              <PromotedAds />
            </div>
          </div>
        </div>
      </div>

      <CreatePostDialog 
        open={isCreatePostOpen} 
        onOpenChange={setIsCreatePostOpen}
      />
    </div>
  );
};

export default Home;
