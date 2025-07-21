import { motion, useMotionValue, useTransform, MotionValue } from "framer-motion";
import { useState, useEffect } from "react";
import { LuxuryGlassCard } from "@/components/ui/luxury-glass-card";

interface TopCreatorsShowcaseProps {
  scrollYProgress: MotionValue<number>;
}

interface Creator {
  id: string;
  name: string;
  category: string;
  earnings: string;
  subscribers: string;
  image: string;
  verified: boolean;
  growth: string;
  rank: number;
  specialBadge?: string;
}

const topCreators: Creator[] = [
  {
    id: "1",
    name: "Victoria Sterling",
    category: "Luxury Lifestyle",
    earnings: "$125K",
    subscribers: "850K",
    image: "https://images.unsplash.com/photo-1494790108755-2616c27c0e2a?w=400&h=400&fit=crop&crop=face",
    verified: true,
    growth: "+68%",
    rank: 1,
    specialBadge: "TOP CREATOR"
  },
  {
    id: "2", 
    name: "Alessandro Kane",
    category: "Fashion & Style",
    earnings: "$98K",
    subscribers: "720K",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    verified: true,
    growth: "+54%",
    rank: 2,
    specialBadge: "RISING STAR"
  },
  {
    id: "3",
    name: "Sophia Chen",
    category: "Beauty & Wellness",
    earnings: "$87K",
    subscribers: "680K", 
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    verified: true,
    growth: "+73%",
    rank: 3,
    specialBadge: "FASTEST GROWTH"
  },
  {
    id: "4",
    name: "Marcus Rodriguez",
    category: "Fitness Elite",
    earnings: "$76K",
    subscribers: "590K",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    verified: true,
    growth: "+45%",
    rank: 4
  },
  {
    id: "5",
    name: "Elena Volkov",
    category: "Art & Culture",
    earnings: "$69K",
    subscribers: "540K",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
    verified: true,
    growth: "+39%",
    rank: 5
  },
  {
    id: "6",
    name: "James Morrison",
    category: "Tech & Innovation",
    earnings: "$92K",
    subscribers: "610K",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    verified: true,
    growth: "+61%",
    rank: 6
  },
  {
    id: "7",
    name: "Isabella Santos",
    category: "Travel & Adventure",
    earnings: "$58K",
    subscribers: "480K",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    verified: true,
    growth: "+52%",
    rank: 7
  },
  {
    id: "8",
    name: "David Kim",
    category: "Business & Finance",
    earnings: "$84K",
    subscribers: "520K",
    image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&crop=face",
    verified: true,
    growth: "+41%",
    rank: 8
  },
  {
    id: "9",
    name: "Aria Thompson",
    category: "Music & Entertainment",
    earnings: "$72K",
    subscribers: "630K",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop&crop=face",
    verified: true,
    growth: "+58%",
    rank: 9
  },
  {
    id: "10",
    name: "Rafael Costa",
    category: "Food & Culinary",
    earnings: "$65K",
    subscribers: "450K",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
    verified: true,
    growth: "+47%",
    rank: 10
  }
];

const CreatorCard = ({ creator, index }: { creator: Creator; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-150, 150], [10, -10]);
  const rotateY = useTransform(mouseX, [-150, 150], [-10, 10]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set(event.clientX - centerX);
    mouseY.set(event.clientY - centerY);
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "from-yellow-400 to-amber-600";
    if (rank === 2) return "from-gray-300 to-gray-500";
    if (rank === 3) return "from-amber-600 to-orange-700";
    return "from-purple-400 to-purple-600";
  };

  return (
    <motion.div
      className="flex-shrink-0 w-80 mx-4"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <motion.div
        className="relative perspective-1000"
        style={{ rotateX, rotateY }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.05, z: 50 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <LuxuryGlassCard 
          variant="primary" 
          intensity="heavy" 
          floating={true}
          className="relative h-96 overflow-hidden group cursor-pointer"
        >
          {/* Rank Badge */}
          <div className={`absolute top-4 left-4 z-20 w-12 h-12 rounded-full bg-gradient-to-br ${getRankColor(creator.rank)} flex items-center justify-center shadow-lg`}>
            <span className="text-white font-bold text-lg">#{creator.rank}</span>
          </div>

          {/* Special Badge */}
          {creator.specialBadge && (
            <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
              <span className="text-white font-semibold text-xs">{creator.specialBadge}</span>
            </div>
          )}

          {/* Background Image with Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/80" />
          <motion.img
            src={creator.image}
            alt={creator.name}
            className="absolute inset-0 w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.6 }}
          />

          {/* 3D Floating Elements */}
          <motion.div
            className="absolute top-8 right-8 w-6 h-6 bg-purple-400/30 rounded-full"
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <motion.div
            className="absolute bottom-20 left-6 w-4 h-4 bg-pink-400/30 rounded-full"
            animate={{ 
              x: [0, 10, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-end p-6">
            {/* Profile Section */}
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-2">
                <motion.div
                  className="w-16 h-16 rounded-full border-3 border-white/50 overflow-hidden"
                  whileHover={{ scale: 1.1, borderColor: 'rgba(255,255,255,0.8)' }}
                >
                  <img
                    src={creator.image}
                    alt={creator.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                
                {creator.verified && (
                  <motion.div
                    className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                  >
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-1">{creator.name}</h3>
              <p className="text-purple-300 text-sm font-medium">{creator.category}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <motion.div 
                className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
              >
                <p className="text-gray-300 text-xs mb-1">Monthly Earnings</p>
                <p className="text-green-400 font-bold text-lg">{creator.earnings}</p>
              </motion.div>
              
              <motion.div 
                className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
              >
                <p className="text-gray-300 text-xs mb-1">Subscribers</p>
                <p className="text-white font-bold text-lg">{creator.subscribers}</p>
              </motion.div>
            </div>

            {/* Growth Indicator */}
            <motion.div
              className="flex items-center justify-between bg-gradient-to-r from-emerald-500/20 to-green-500/20 backdrop-blur-sm rounded-lg p-3 border border-emerald-400/30"
              whileHover={{ scale: 1.02, borderColor: 'rgba(52, 211, 153, 0.5)' }}
            >
              <span className="text-gray-300 text-sm">Growth Rate</span>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">{creator.growth}</span>
                <motion.svg 
                  className="w-4 h-4 text-emerald-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </motion.svg>
              </div>
            </motion.div>
          </div>

          {/* Animated Border */}
          <motion.div
            className="absolute inset-0 rounded-3xl"
            style={{
              background: `conic-gradient(from ${isHovered ? '0deg' : '180deg'}, 
                transparent, 
                rgba(139, 92, 246, 0.5), 
                transparent, 
                rgba(236, 72, 153, 0.5), 
                transparent)`
            }}
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 2, ease: "linear" }}
          />
        </LuxuryGlassCard>
      </motion.div>
    </motion.div>
  );
};

export const TopCreatorsShowcase = ({ scrollYProgress }: TopCreatorsShowcaseProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const parallaxY = useTransform(scrollYProgress, [0.3, 0.7], [100, -100]);
  const backgroundScale = useTransform(scrollYProgress, [0.3, 0.7], [1, 1.2]);

  // Auto-scroll marquee
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % topCreators.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen bg-black overflow-hidden py-24">
      {/* Cinematic Background */}
      <motion.div 
        className="absolute inset-0"
        style={{ scale: backgroundScale }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent" />
      </motion.div>

      {/* Floating Orbs */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-xl"
        animate={{ 
          y: [0, -30, 0],
          x: [0, 20, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div
        className="absolute bottom-32 right-20 w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-lg"
        animate={{ 
          y: [0, 20, 0],
          x: [0, -15, 0],
          scale: [1, 0.8, 1]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-16"
          style={{ y: parallaxY }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-6 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-full border border-purple-400/30 text-purple-300 font-semibold mb-6">
              CREATORS SPOTLIGHT • BONUS TRAFFIC
            </span>
            
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              TOP <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">10</span>
              <br />
              <span className="text-3xl md:text-5xl bg-gradient-to-r from-gray-300 to-white bg-clip-text text-transparent">
                Elite Creators
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Meet the creators who've transformed their passion into extraordinary success. 
              <br className="hidden md:block" />
              Join their ranks and unlock your earning potential.
            </p>
          </motion.div>
        </motion.div>

        {/* Cinematic Marquee */}
        <div className="relative">
          <motion.div 
            className="flex"
            animate={{ x: -currentIndex * 320 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {[...topCreators, ...topCreators].map((creator, index) => (
              <CreatorCard 
                key={`${creator.id}-${index}`} 
                creator={creator} 
                index={index} 
              />
            ))}
          </motion.div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-12 gap-3">
            {topCreators.map((_, index) => (
              <motion.button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  index === currentIndex 
                    ? 'bg-gradient-to-r from-purple-400 to-pink-400' 
                    : 'bg-white/30'
                }`}
                onClick={() => setCurrentIndex(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.button
            className="group relative px-12 py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white font-bold text-lg rounded-full overflow-hidden shadow-2xl"
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)" }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600"
              initial={{ x: '-100%' }}
              whileHover={{ x: '0%' }}
              transition={{ duration: 0.5 }}
            />
            <span className="relative z-10 flex items-center gap-3">
              Start Your Creator Journey
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ✨
              </motion.span>
            </span>
          </motion.button>
          
          <p className="mt-4 text-gray-400">
            Join thousands of successful creators earning <span className="text-green-400 font-semibold">$50K+</span> monthly
          </p>
        </motion.div>
      </div>
    </section>
  );
};