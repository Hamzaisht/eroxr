import { motion, MotionValue, useTransform } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Crown, ExternalLink } from "lucide-react";

interface CreatorMosaicProps {
  scrollYProgress: MotionValue<number>;
}

// Mock creator data
const creators = [
  {
    id: 1,
    username: "luna_rose",
    name: "Luna Rose",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    cover: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&h=800&fit=crop",
    subscribers: "47.2K",
    earnings: "$12.8K",
    category: "Lifestyle",
    verified: true,
    preview: "Behind the scenes of my latest photoshoot ✨"
  },
  {
    id: 2,
    username: "alex_fit",
    name: "Alex Fitness",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=800&fit=crop",
    subscribers: "32.1K",
    earnings: "$8.9K",
    category: "Fitness",
    verified: true,
    preview: "New workout routine dropping tomorrow! 💪"
  },
  {
    id: 3,
    username: "sophia_art",
    name: "Sophia",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    cover: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=800&fit=crop",
    subscribers: "28.7K",
    earnings: "$6.4K",
    category: "Art",
    verified: false,
    preview: "Creating magic with watercolors today 🎨"
  },
  {
    id: 4,
    username: "max_music",
    name: "Max Melody",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=800&fit=crop",
    subscribers: "51.3K",
    earnings: "$15.2K",
    category: "Music",
    verified: true,
    preview: "Live acoustic session at 8pm tonight! 🎵"
  },
  {
    id: 5,
    username: "emma_chef",
    name: "Emma Kitchen",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    cover: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=800&fit=crop",
    subscribers: "39.8K",
    earnings: "$9.7K",
    category: "Cooking",
    verified: true,
    preview: "Secret recipe reveal - chocolate soufflé! 🍫"
  },
  {
    id: 6,
    username: "noah_travel",
    name: "Noah Explorer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    cover: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=800&fit=crop",
    subscribers: "44.5K",
    earnings: "$11.3K",
    category: "Travel",
    verified: true,
    preview: "Hidden gems of Iceland - exclusive content! 🏔️"
  }
];

export const CreatorMosaic = ({ scrollYProgress }: CreatorMosaicProps) => {
  const [hoveredCreator, setHoveredCreator] = useState<number | null>(null);
  
  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <motion.section 
      className="min-h-screen bg-black relative overflow-hidden py-20"
      style={{ opacity }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/20 to-black" />
      
      {/* Section Header */}
      <motion.div 
        className="text-center mb-16 px-4"
        style={{ y }}
      >
        <motion.h2 
          className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <span className="bg-gradient-to-r from-white via-purple-300 to-pink-300 bg-clip-text text-transparent">
            Meet Our Creators
          </span>
        </motion.h2>
        <motion.p 
          className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Discover talented creators earning thousands through authentic connections
        </motion.p>
      </motion.div>

      {/* Creator Grid */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creators.map((creator, index) => (
            <motion.div
              key={creator.id}
              className="group relative bg-gradient-to-b from-gray-900 to-black rounded-2xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all duration-500"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              onHoverStart={() => setHoveredCreator(creator.id)}
              onHoverEnd={() => setHoveredCreator(null)}
            >
              {/* Cover Image */}
              <div className="relative h-64 overflow-hidden">
                <motion.img
                  src={creator.cover}
                  alt={creator.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Hover Preview */}
                <motion.div 
                  className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredCreator === creator.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center p-4">
                    <p className="text-white text-sm mb-4">"{creator.preview}"</p>
                    <Button 
                      size="sm" 
                      className="bg-purple-600 hover:bg-purple-500"
                      onClick={() => window.open(`https://eroxr.com/@${creator.username}`, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Profile
                    </Button>
                  </div>
                </motion.div>
              </div>

              {/* Creator Info */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-12 h-12 rounded-full border-2 border-purple-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-bold">{creator.name}</h3>
                      {creator.verified && (
                        <Crown className="w-4 h-4 text-yellow-400" />
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">@{creator.username}</p>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className="bg-purple-500/20 text-purple-300 border-purple-500/30"
                  >
                    {creator.category}
                  </Badge>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{creator.subscribers}</span>
                  </div>
                  <div className="flex items-center gap-1 text-green-400">
                    <span className="text-xs">Earning</span>
                    <span className="font-bold">{creator.earnings}/mo</span>
                  </div>
                </div>
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-pink-500/10 rounded-2xl" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Button 
            size="lg" 
            className="group text-lg py-6 px-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all duration-500 shadow-2xl shadow-purple-500/30"
          >
            <span>Join as Creator</span>
            <Crown className="ml-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
          </Button>
          <p className="text-gray-400 mt-4">Start earning in minutes • No upfront costs • 85% creator revenue share</p>
        </motion.div>
      </div>
    </motion.section>
  );
};