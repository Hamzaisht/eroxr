import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Heart, Users, Star, Play } from "lucide-react";

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

interface EnhancedCreatorCardProps {
  creator: Creator;
  index: number;
  hoveredCreator: string | null;
  blurToggle: boolean;
  onHover: (id: string | null) => void;
}

export const EnhancedCreatorCard = ({ 
  creator, 
  index, 
  hoveredCreator, 
  blurToggle,
  onHover 
}: EnhancedCreatorCardProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover(creator.id);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHover(null);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group cursor-pointer relative"
    >
      {/* RGB Glow Effect */}
      {isHovered && (
        <div
          className="absolute inset-0 rounded-2xl opacity-75 blur-sm"
          style={{
            background: `conic-gradient(from 0deg at ${mousePosition.x}px ${mousePosition.y}px, 
              #ff0080, #ff8000, #ffff00, #80ff00, #00ff80, #0080ff, #8000ff, #ff0080)`,
            animation: 'rgb-spin 2s linear infinite',
          }}
        />
      )}

      {/* Main Card */}
      <motion.div
        className="relative bg-gray-900/80 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden z-10"
        whileHover={{ 
          scale: 1.02,
          boxShadow: isHovered 
            ? "0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)"
            : "0 20px 40px rgba(236, 72, 153, 0.2)"
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Preview Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <motion.img
            src={creator.preview}
            alt={`${creator.name} preview`}
            className={`w-full h-full object-cover transition-all duration-500 ${
              blurToggle && creator.isBlurred ? 'blur-lg scale-110' : ''
            }`}
            animate={{
              scale: hoveredCreator === creator.id ? 1.08 : 1
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://images.unsplash.com/photo-${1500000000000 + Math.random() * 100000000}?w=400&h=600&fit=crop`;
            }}
          />
          
          {/* Interactive Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"
            animate={{
              opacity: isHovered ? 0.9 : 0.7
            }}
          />

          {/* Play Button (appears on hover) */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0.8
            }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="w-16 h-16 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            </motion.div>
          </motion.div>
          
          {/* Blur Overlay */}
          {blurToggle && creator.isBlurred && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <motion.button
                className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-full text-sm font-semibold shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Tap to Reveal
              </motion.button>
            </div>
          )}

          {/* Verification Badge */}
          <div className="absolute top-4 right-4">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Creator Info */}
        <div className="p-5">
          <div className="flex items-center mb-4">
            <div className="relative">
              <img
                src={creator.avatar}
                alt={creator.name}
                className="w-12 h-12 rounded-full border-2 border-white/30"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://images.unsplash.com/photo-${1500000000000 + Math.random() * 100000000}?w=150&h=150&fit=crop&crop=face`;
                }}
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-900 rounded-full"></div>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-white font-semibold text-lg">{creator.name}</h3>
              <p className="text-white/70 text-sm">{creator.username}</p>
            </div>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center text-white/90 mb-1">
                <Users className="w-4 h-4" />
              </div>
              <div className="text-white font-semibold text-sm">{creator.followers}</div>
              <div className="text-white/60 text-xs">Fans</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center text-pink-400 mb-1">
                <Heart className="w-4 h-4" />
              </div>
              <div className="text-white font-semibold text-sm">{creator.likes}</div>
              <div className="text-white/60 text-xs">Likes</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center text-yellow-400 mb-1">
                <Star className="w-4 h-4 fill-current" />
              </div>
              <div className="text-white font-semibold text-sm">{creator.rating}</div>
              <div className="text-white/60 text-xs">Rating</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <motion.button
              className="flex-1 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-sm font-semibold rounded-lg transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Follow
            </motion.button>
            <motion.button
              className="flex-1 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold rounded-lg transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Message
            </motion.button>
          </div>
        </div>

        {/* RGB Border Effect */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: `conic-gradient(from 0deg at ${mousePosition.x}px ${mousePosition.y}px, 
                transparent 340deg, #ff0080 360deg)`,
              padding: '2px',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'xor',
            }}
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        )}
      </motion.div>

    </motion.div>
  );
};