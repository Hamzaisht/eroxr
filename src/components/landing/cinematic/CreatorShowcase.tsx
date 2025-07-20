import { motion, useTransform, MotionValue } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState, useRef, useEffect } from "react";
import { Heart, Users, Star } from "lucide-react";
import { EnhancedCreatorCard } from "./EnhancedCreatorCard";

interface CreatorShowcaseProps {
  scrollYProgress: MotionValue<number>;
}

interface Creator {
  id: string;
  name: string;
  username: string;
  followers: string;
  likes: string;
  rating: number;
  avatar: string;
  preview: string;
  isBlurred: boolean;
}

export const CreatorShowcase = ({ scrollYProgress }: CreatorShowcaseProps) => {
  const [ref, inView] = useInView({ threshold: 0.2 });
  const [hoveredCreator, setHoveredCreator] = useState<string | null>(null);
  const [blurToggle, setBlurToggle] = useState(true);

  const creators: Creator[] = [
    {
      id: "1",
      name: "Aurora Rose",
      username: "@aurora_rose",
      followers: "127K",
      likes: "2.4M",
      rating: 4.9,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1c7?w=150&h=150&fit=crop&crop=face",
      preview: "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=400&h=600&fit=crop",
      isBlurred: true
    },
    {
      id: "2",
      name: "Nyx Midnight",
      username: "@nyx_midnight",
      followers: "89K",
      likes: "1.8M",
      rating: 4.8,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      preview: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=600&fit=crop",
      isBlurred: true
    },
    {
      id: "3",
      name: "Scarlett Noir",
      username: "@scarlett_noir",
      followers: "203K",
      likes: "3.1M",
      rating: 5.0,
      avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&h=150&fit=crop&crop=face",
      preview: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop",
      isBlurred: true
    },
    {
      id: "4",
      name: "Venus Divine",
      username: "@venus_divine",
      followers: "156K",
      likes: "2.7M",
      rating: 4.9,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      preview: "https://images.unsplash.com/photo-1502323777036-f29e3972d82f?w=400&h=600&fit=crop",
      isBlurred: true
    }
  ];

  const y = useTransform(scrollYProgress, [0.2, 0.6], [50, -50]);

  return (
    <section ref={ref} className="relative min-h-screen py-20 bg-gradient-to-b from-black via-purple-950/10 to-black">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-l from-pink-900/20 to-purple-900/20" />
        
        {/* Enhanced grid pattern with glow */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(155, 135, 245, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(155, 135, 245, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            filter: 'drop-shadow(0 0 1px hsl(var(--primary)))',
          }}
        />
        
        {/* Spotlight effects */}
        <div className="absolute inset-0">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`spotlight-${i}`}
              className="absolute rounded-full opacity-10"
              style={{
                left: `${25 + i * 25}%`,
                top: `${20 + Math.random() * 40}%`,
                width: 200 + Math.random() * 100,
                height: 200 + Math.random() * 100,
                background: `radial-gradient(circle, hsl(var(--primary)) 0%, transparent 60%)`,
                filter: 'blur(40px)',
              }}
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.05, 0.15, 0.05],
              }}
              transition={{
                duration: 6 + i * 2,
                repeat: Infinity,
                delay: i * 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
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
            Meet Our{" "}
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Creators
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
            Discover talented creators earning thousands through premium content and direct fan connections.
          </p>
          
          {/* Blur Toggle */}
          <motion.button
            onClick={() => setBlurToggle(!blurToggle)}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {blurToggle ? "Reveal Previews" : "Blur Previews"}
          </motion.button>
        </motion.div>

        {/* Creator Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {creators.map((creator, index) => (
            <EnhancedCreatorCard
              key={creator.id}
              creator={creator}
              index={index}
              hoveredCreator={hoveredCreator}
              blurToggle={blurToggle}
              onHover={setHoveredCreator}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-16"
        >
          <motion.button
            className="group relative px-8 py-4 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500 text-white font-semibold rounded-full overflow-hidden"
            style={{
              boxShadow: 'var(--glow-primary), 0 0 30px rgba(139, 92, 246, 0.3)',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Meet our Founding Creators</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};