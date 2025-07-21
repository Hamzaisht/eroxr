import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Play, Heart, MessageCircle, Share, Upload, DollarSign, Eye, Users } from 'lucide-react';

interface InteractivePlatformDemoProps {
  scrollYProgress?: any;
}

// Mock data for realistic demo
const mockCreator = {
  name: "Alex Rivera",
  username: "@alexcreates",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  followers: "127K",
  posts: 89,
  earnings: "$12,450",
  engagement: "94%"
};

const mockPosts = [
  {
    id: 1,
    type: "image",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=600&fit=crop",
    likes: 2431,
    comments: 89,
    price: "$9.99",
    title: "Exclusive Behind The Scenes"
  },
  {
    id: 2,
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1598908314298-9ae5bb62f0c5?w=400&h=600&fit=crop",
    likes: 5678,
    comments: 234,
    price: "$14.99",
    title: "Premium Tutorial Series"
  },
  {
    id: 3,
    type: "live",
    thumbnail: "https://images.unsplash.com/photo-1594736797933-d0d00bb2fe65?w=400&h=600&fit=crop",
    likes: 892,
    comments: 45,
    price: "Free",
    title: "Live Q&A Session"
  }
];

export const InteractivePlatformDemo = ({ scrollYProgress }: InteractivePlatformDemoProps) => {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const [activeDemo, setActiveDemo] = useState<'creator' | 'fan' | 'earnings'>('creator');
  const [animatedEarnings, setAnimatedEarnings] = useState(0);

  // Animate earnings counter
  useEffect(() => {
    if (activeDemo === 'earnings' && inView) {
      const target = 12450;
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setAnimatedEarnings(target);
          clearInterval(timer);
        } else {
          setAnimatedEarnings(Math.floor(current));
        }
      }, 16);
      
      return () => clearInterval(timer);
    }
  }, [activeDemo, inView]);

  const demoTabs = [
    { id: 'creator', label: 'Creator Dashboard', icon: Upload },
    { id: 'fan', label: 'Fan Experience', icon: Heart },
    { id: 'earnings', label: 'Revenue Analytics', icon: DollarSign }
  ];

  return (
    <section ref={ref} className="relative min-h-screen py-20 bg-black">
      {/* Modern background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Experience{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              EROXR
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto font-light">
            See how creators and fans interact on our platform. Real features, real experiences.
          </p>
        </motion.div>

        {/* Demo Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="flex bg-gray-900/50 backdrop-blur-sm rounded-2xl p-2 border border-white/10">
            {demoTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveDemo(tab.id as any)}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-grotesk font-medium transition-all duration-300 ${
                  activeDemo === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="hidden sm:block">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Demo Content */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {/* Creator Dashboard Demo */}
            {activeDemo === 'creator' && (
              <motion.div
                key="creator"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="grid lg:grid-cols-2 gap-8"
              >
                {/* Creator Profile */}
                <div className="bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <motion.img
                      src={mockCreator.avatar}
                      alt={mockCreator.name}
                      className="w-16 h-16 rounded-full object-cover"
                      whileHover={{ scale: 1.1 }}
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-white font-grotesk">{mockCreator.name}</h3>
                      <p className="text-purple-400 font-mono">{mockCreator.username}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white font-display">{mockCreator.followers}</div>
                      <div className="text-sm text-white/60">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white font-display">{mockCreator.posts}</div>
                      <div className="text-sm text-white/60">Posts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400 font-display">{mockCreator.engagement}</div>
                      <div className="text-sm text-white/60">Engagement</div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl font-grotesk"
                  >
                    Upload New Content
                  </motion.button>
                </div>

                {/* Content Management */}
                <div className="bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                  <h4 className="text-lg font-semibold text-white mb-6 font-grotesk">Recent Content</h4>
                  <div className="space-y-4">
                    {mockPosts.map((post) => (
                      <motion.div
                        key={post.id}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800/70 transition-colors"
                      >
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h5 className="text-white font-medium font-grotesk">{post.title}</h5>
                          <div className="flex items-center gap-4 text-sm text-white/60 mt-1">
                            <span className="flex items-center gap-1">
                              <Heart className="w-4 h-4" /> {post.likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" /> {post.comments}
                            </span>
                          </div>
                        </div>
                        <div className="text-green-400 font-semibold font-mono">{post.price}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Fan Experience Demo */}
            {activeDemo === 'fan' && (
              <motion.div
                key="fan"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
              >
                <div className="grid md:grid-cols-3 gap-6">
                  {mockPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden"
                    >
                      <div className="relative">
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="w-full h-48 object-cover"
                        />
                        {post.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className="w-16 h-16 bg-black/70 rounded-full flex items-center justify-center backdrop-blur-sm"
                            >
                              <Play className="w-8 h-8 text-white ml-1" />
                            </motion.div>
                          </div>
                        )}
                        {post.type === 'live' && (
                          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                            LIVE
                          </div>
                        )}
                        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
                          {post.price}
                        </div>
                      </div>

                      <div className="p-6">
                        <h5 className="text-white font-semibold mb-4 font-grotesk">{post.title}</h5>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-white/60">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="flex items-center gap-1 hover:text-red-400 transition-colors"
                            >
                              <Heart className="w-5 h-5" />
                              <span className="text-sm">{post.likes}</span>
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="flex items-center gap-1 hover:text-blue-400 transition-colors"
                            >
                              <MessageCircle className="w-5 h-5" />
                              <span className="text-sm">{post.comments}</span>
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="hover:text-green-400 transition-colors"
                            >
                              <Share className="w-5 h-5" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Earnings Demo */}
            {activeDemo === 'earnings' && (
              <motion.div
                key="earnings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
              >
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Earnings Overview */}
                  <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-sm border border-green-400/20 rounded-2xl p-8">
                    <h4 className="text-2xl font-bold text-white mb-2 font-display">Monthly Earnings</h4>
                    <div className="text-5xl font-bold text-green-400 mb-4 font-mono">
                      ${animatedEarnings.toLocaleString()}
                    </div>
                    <p className="text-green-400/80 mb-6">+23% from last month</p>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Subscription Revenue</span>
                        <span className="text-white font-semibold">$8,450</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Tips & Donations</span>
                        <span className="text-white font-semibold">$2,890</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Premium Content</span>
                        <span className="text-white font-semibold">$1,110</span>
                      </div>
                    </div>
                  </div>

                  {/* Platform Comparison */}
                  <div className="bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                    <h4 className="text-xl font-semibold text-white mb-6 font-grotesk">Platform Comparison</h4>
                    
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-purple-400 font-semibold">EROXR (85%)</span>
                          <span className="text-white font-bold">$8,500</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-3">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '85%' }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-400">Platform X (50%)</span>
                          <span className="text-gray-400">$5,000</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-3">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '50%' }}
                            transition={{ duration: 1, delay: 0.7 }}
                            className="bg-gray-500 h-3 rounded-full"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-400">Platform Y (45%)</span>
                          <span className="text-gray-400">$4,500</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-3">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '45%' }}
                            transition={{ duration: 1, delay: 0.9 }}
                            className="bg-gray-500 h-3 rounded-full"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-green-900/20 rounded-xl border border-green-400/20">
                      <p className="text-green-400 font-semibold text-center">
                        Earn $3,500+ more per month with EROXR
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-16"
        >
          <p className="text-white/60 mb-8 font-grotesk">Ready to experience the difference?</p>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full text-lg font-grotesk tracking-wide hover:shadow-2xl transition-all duration-300"
          >
            Try EROXR Free
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};