import { motion, useInView } from "framer-motion";
import { Play, Heart, MessageCircle, Share, Eye } from "lucide-react";
import { useRef, useState, useEffect } from "react";

interface LiveFeedItem {
  id: string;
  creator: {
    name: string;
    avatar: string;
    username: string;
    verified: boolean;
  };
  preview: string;
  thumbnail: string;
  title: string;
  likes: number;
  comments: number;
  views: string;
  timeAgo: string;
  category: string;
}

const liveFeeds: LiveFeedItem[] = [
  {
    id: "1",
    creator: {
      name: "Emma Rose",
      avatar: "/api/placeholder/50/50",
      username: "emmarose",
      verified: true
    },
    preview: "/api/placeholder/400/600",
    thumbnail: "/api/placeholder/400/600",
    title: "Behind the Scenes Photoshoot",
    likes: 1247,
    comments: 89,
    views: "12.5K",
    timeAgo: "2h",
    category: "Photography"
  },
  {
    id: "2",
    creator: {
      name: "Alex Storm",
      avatar: "/api/placeholder/50/50",
      username: "alexstorm",
      verified: true
    },
    preview: "/api/placeholder/400/600",
    thumbnail: "/api/placeholder/400/600",
    title: "Workout Routine Reveal",
    likes: 956,
    comments: 124,
    views: "8.9K",
    timeAgo: "4h",
    category: "Fitness"
  },
  {
    id: "3",
    creator: {
      name: "Luna Night",
      avatar: "/api/placeholder/50/50",
      username: "lunanight",
      verified: true
    },
    preview: "/api/placeholder/400/600",
    thumbnail: "/api/placeholder/400/600",
    title: "Late Night Art Session",
    likes: 2103,
    comments: 167,
    views: "15.2K",
    timeAgo: "6h",
    category: "Art"
  },
  {
    id: "4",
    creator: {
      name: "Maya Zen",
      avatar: "/api/placeholder/50/50",
      username: "mayazen",
      verified: false
    },
    preview: "/api/placeholder/400/600",
    thumbnail: "/api/placeholder/400/600",
    title: "Meditation & Mindfulness",
    likes: 743,
    comments: 45,
    views: "6.1K",
    timeAgo: "8h",
    category: "Wellness"
  },
  {
    id: "5",
    creator: {
      name: "Zoe Wild",
      avatar: "/api/placeholder/50/50",
      username: "zoewild",
      verified: true
    },
    preview: "/api/placeholder/400/600",
    thumbnail: "/api/placeholder/400/600",
    title: "Adventure Travel Vlog",
    likes: 1891,
    comments: 203,
    views: "22.3K",
    timeAgo: "12h",
    category: "Travel"
  }
];

export const LiveFeedSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-200px" });
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll functionality
  useEffect(() => {
    if (!isInView) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % liveFeeds.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isInView]);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center py-24 overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-indigo-900/10 to-black" />
      
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-6xl font-display font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
            Live Creator Feed
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover fresh content from your favorite creators, updated in real-time
          </p>
        </motion.div>

        {/* Featured Content Carousel */}
        <motion.div 
          className="relative mb-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="overflow-hidden rounded-3xl">
            <div 
              className="flex transition-transform duration-1000 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {liveFeeds.map((item, index) => (
                <div key={item.id} className="w-full flex-shrink-0">
                  <div className="relative aspect-video bg-gray-900 rounded-3xl overflow-hidden group">
                    <img 
                      src={item.thumbnail} 
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    {/* Play Button */}
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                    </motion.div>

                    {/* Content Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <div className="flex items-center gap-4 mb-4">
                        <img 
                          src={item.creator.avatar} 
                          alt={item.creator.name}
                          className="w-12 h-12 rounded-full border-2 border-white/30"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-white font-semibold">{item.creator.name}</h3>
                            {item.creator.verified && (
                              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <p className="text-gray-300 text-sm">@{item.creator.username}</p>
                        </div>
                      </div>
                      
                      <h2 className="text-2xl font-bold text-white mb-4">{item.title}</h2>
                      
                      <div className="flex items-center gap-6 text-gray-300">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          <span>{item.views}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4" />
                          <span>{formatNumber(item.likes)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4" />
                          <span>{item.comments}</span>
                        </div>
                        <span className="text-gray-400">{item.timeAgo} ago</span>
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-6 left-6">
                      <span className="px-3 py-1 bg-purple-600/80 backdrop-blur-md text-white text-sm rounded-full border border-white/20">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {liveFeeds.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-purple-500 scale-125' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Creator Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
        >
          {liveFeeds.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
              className="glass-card rounded-2xl p-4 hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <div className="aspect-[3/4] rounded-xl overflow-hidden mb-3 relative group">
                <img 
                  src={item.preview} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Live Badge */}
                <div className="absolute top-2 right-2">
                  <div className="px-2 py-1 bg-red-500 text-white text-xs rounded-full font-medium flex items-center gap-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    LIVE
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-white font-medium text-sm mb-1 line-clamp-2">{item.title}</h3>
                <p className="text-gray-400 text-xs">{item.creator.name}</p>
                <div className="flex items-center justify-center gap-3 mt-2 text-xs text-gray-500">
                  <span>{item.views} views</span>
                  <span>{formatNumber(item.likes)} likes</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore All Creators
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};