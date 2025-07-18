import { motion, useTransform, MotionValue } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";
import { Play, Eye, DollarSign, Zap, TrendingUp, Users } from "lucide-react";

interface LiveContentMagicProps {
  scrollYProgress: MotionValue<number>;
}

export const LiveContentMagic = ({ scrollYProgress }: LiveContentMagicProps) => {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const [realTimeStats, setRealTimeStats] = useState({
    views: 1247,
    earnings: 342.50,
    tips: 89,
    followers: 12543
  });

  // Simulate real-time updates
  useEffect(() => {
    if (!inView) return;

    const interval = setInterval(() => {
      setRealTimeStats(prev => ({
        views: prev.views + Math.floor(Math.random() * 5) + 1,
        earnings: prev.earnings + (Math.random() * 2),
        tips: prev.tips + (Math.random() > 0.7 ? 1 : 0),
        followers: prev.followers + (Math.random() > 0.8 ? 1 : 0)
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [inView]);

  const y = useTransform(scrollYProgress, [0.5, 0.9], [100, -100]);

  return (
    <section ref={ref} className="relative min-h-screen py-20 bg-gradient-to-b from-black via-gray-950 to-black">
      <motion.div 
        style={{ y }}
        className="max-w-7xl mx-auto px-6"
      >
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Live Content &{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              AI Magic
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Watch your content come alive with real-time analytics, AI-powered insights, and instant monetization.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Live Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Main Dashboard */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 relative overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse" />
                  <span className="text-white font-semibold">Live Dashboard</span>
                </div>
                <div className="flex items-center text-sm text-white/60">
                  <Eye className="w-4 h-4 mr-1" />
                  Live Now
                </div>
              </div>

              {/* Video Preview */}
              <div className="relative aspect-video bg-gray-800 rounded-xl mb-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-pink-900/50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Play className="w-8 h-8 text-white ml-1" />
                  </motion.div>
                </div>

                {/* Live Indicators */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <div className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded">
                    LIVE
                  </div>
                  <div className="px-2 py-1 bg-black/50 text-white text-xs rounded">
                    HD
                  </div>
                </div>

                {/* Viewer Count */}
                <div className="absolute top-4 right-4 px-2 py-1 bg-black/50 text-white text-xs rounded flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  {realTimeStats.views.toLocaleString()}
                </div>
              </div>

              {/* Real-time Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <motion.div 
                  className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-400/20 rounded-xl p-4"
                  animate={{ 
                    boxShadow: ["0 0 0 rgba(34, 197, 94, 0)", "0 0 20px rgba(34, 197, 94, 0.3)", "0 0 0 rgba(34, 197, 94, 0)"]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="flex items-center mb-2">
                    <DollarSign className="w-5 h-5 text-green-400 mr-2" />
                    <span className="text-white/80 text-sm">Earnings</span>
                  </div>
                  <div className="text-2xl font-bold text-green-400">
                    ${realTimeStats.earnings.toFixed(2)}
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-400/20 rounded-xl p-4"
                  animate={{ 
                    boxShadow: ["0 0 0 rgba(168, 85, 247, 0)", "0 0 20px rgba(168, 85, 247, 0.3)", "0 0 0 rgba(168, 85, 247, 0)"]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  <div className="flex items-center mb-2">
                    <Zap className="w-5 h-5 text-purple-400 mr-2" />
                    <span className="text-white/80 text-sm">Tips</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-400">
                    {realTimeStats.tips}
                  </div>
                </motion.div>
              </div>

              {/* AI Insights */}
              <div className="bg-blue-900/20 border border-blue-400/20 rounded-xl p-4">
                <div className="flex items-center mb-3">
                  <TrendingUp className="w-5 h-5 text-blue-400 mr-2" />
                  <span className="text-white font-semibold text-sm">AI Insights</span>
                </div>
                <div className="space-y-2 text-sm text-white/80">
                  <div className="flex items-center justify-between">
                    <span>Engagement Rate</span>
                    <span className="text-blue-400 font-semibold">+23%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Peak Hours</span>
                    <span className="text-blue-400 font-semibold">8-10 PM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Content Score</span>
                    <span className="text-blue-400 font-semibold">9.2/10</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Notifications */}
            <motion.div
              className="absolute -right-4 top-20 bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-semibold shadow-lg"
              animate={{
                x: [0, 10, 0],
                opacity: [0, 1, 1, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2
              }}
            >
              New tip: $25! 💰
            </motion.div>

            <motion.div
              className="absolute -left-4 bottom-20 bg-purple-500 text-white px-3 py-2 rounded-lg text-sm font-semibold shadow-lg"
              animate={{
                x: [0, -10, 0],
                opacity: [0, 1, 1, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 4,
                delay: 1
              }}
            >
              New follower! 🎉
            </motion.div>
          </motion.div>

          {/* Features List */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.div 
                className="flex items-start space-x-4"
                whileHover={{ x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Real-time Analytics</h3>
                  <p className="text-white/70">Track views, earnings, and engagement as they happen. No delays, no guessing.</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-start space-x-4"
                whileHover={{ x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Instant Monetization</h3>
                  <p className="text-white/70">Start earning from your first upload. Tips, subscriptions, and pay-per-view all integrated.</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-start space-x-4"
                whileHover={{ x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">AI-Powered Insights</h3>
                  <p className="text-white/70">Get personalized recommendations to optimize your content and maximize earnings.</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-start space-x-4"
                whileHover={{ x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Community Building</h3>
                  <p className="text-white/70">Build loyal fanbase with direct messaging, exclusive content, and live interactions.</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};