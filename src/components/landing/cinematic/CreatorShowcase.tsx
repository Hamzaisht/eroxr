import { motion, useTransform, MotionValue } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState } from "react";
import { Heart, Users, Star } from "lucide-react";

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {creators.map((creator, index) => (
            <motion.div
              key={creator.id}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredCreator(creator.id)}
              onMouseLeave={() => setHoveredCreator(null)}
              className="group cursor-pointer"
            >
              {/* Creator Card */}
              <motion.div
                className="relative bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(236, 72, 153, 0.2)"
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
                      scale: hoveredCreator === creator.id ? 1.1 : 1
                    }}
                  />
                  
                  {/* Blur Overlay */}
                  {blurToggle && creator.isBlurred && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <motion.button
                        className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-full text-sm font-semibold"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        Tap to Reveal
                      </motion.button>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>

                {/* Creator Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center mb-3">
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="w-10 h-10 rounded-full border-2 border-white/30 mr-3"
                    />
                    <div>
                      <h3 className="text-white font-semibold">{creator.name}</h3>
                      <p className="text-white/70 text-sm">{creator.username}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center text-white/80">
                      <Users className="w-4 h-4 mr-1" />
                      {creator.followers}
                    </div>
                    <div className="flex items-center text-white/80">
                      <Heart className="w-4 h-4 mr-1" />
                      {creator.likes}
                    </div>
                    <div className="flex items-center text-yellow-400">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      {creator.rating}
                    </div>
                  </div>
                </div>

                {/* Hover Effect */}
                <motion.div
                  className="absolute inset-0 border-2 border-pink-400/0 rounded-2xl"
                  animate={{
                    borderColor: hoveredCreator === creator.id ? "rgba(236, 72, 153, 0.5)" : "rgba(236, 72, 153, 0)"
                  }}
                />
              </motion.div>
            </motion.div>
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
            className="px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-semibold rounded-full shadow-[0_0_30px_rgba(236,72,153,0.3)]"
            whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(236, 72, 153, 0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            Meet our Founding Creators
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};