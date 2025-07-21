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
    <section ref={ref} className="relative min-h-screen py-20 bg-black">
      {/* Modern Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black">
        {/* Floating orbs */}
        <motion.div 
          className="absolute top-32 right-32 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl"
          animate={{ 
            y: [0, -20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute bottom-32 left-32 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-xl"
          animate={{ 
            y: [0, 15, 0],
            x: [0, 10, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>
      
      <div className="relative w-full max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Meet Our{" "}
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Creators
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-8 font-light">
            Discover talented creators earning thousands through premium content and direct fan connections.
          </p>
          
          {/* Modern toggle button */}
          <motion.button
            onClick={() => setBlurToggle(!blurToggle)}
            className="px-6 py-3 bg-gray-900/50 hover:bg-gray-800/50 border border-white/20 hover:border-white/30 rounded-full text-white transition-all duration-300 backdrop-blur-sm"
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
            className="px-8 py-4 bg-white text-black text-base font-medium rounded-full hover:shadow-2xl hover:shadow-white/20 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Meet our Founding Creators
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};