import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, Eye, DollarSign } from "lucide-react";

interface CreatorCard {
  id: number;
  name: string;
  avatar: string;
  category: string;
  earnings: string;
  views: string;
  likes: string;
  isLive?: boolean;
  content: string;
}

const mockCreators: CreatorCard[] = [
  {
    id: 1,
    name: "Emma Rose",
    avatar: "/api/placeholder/150/150",
    category: "Fitness",
    earnings: "$12.5K",
    views: "234K",
    likes: "45K",
    isLive: true,
    content: "Morning yoga session 🧘‍♀️"
  },
  {
    id: 2,
    name: "Alex Nordic",
    avatar: "/api/placeholder/150/150",
    category: "Art",
    earnings: "$8.2K",
    views: "189K",
    likes: "32K",
    content: "Digital art masterclass"
  },
  {
    id: 3,
    name: "Sofia Luna",
    avatar: "/api/placeholder/150/150",
    category: "Music",
    earnings: "$15.7K",
    views: "456K",
    likes: "78K",
    isLive: true,
    content: "Acoustic guitar covers"
  },
  {
    id: 4,
    name: "Viktor Frost",
    avatar: "/api/placeholder/150/150",
    category: "Gaming",
    earnings: "$22.3K",
    views: "892K",
    likes: "156K",
    content: "Gaming livestream"
  },
  {
    id: 5,
    name: "Luna Belle",
    avatar: "/api/placeholder/150/150",
    category: "Lifestyle",
    earnings: "$9.8K",
    views: "298K",
    likes: "67K",
    content: "Nordic lifestyle tips"
  }
];

export const FloatingCreatorCards = () => {
  const [currentCreators, setCurrentCreators] = useState(mockCreators);

  // Animate earnings in real-time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCreators(prev => prev.map(creator => ({
        ...creator,
        earnings: `$${(parseFloat(creator.earnings.slice(1, -1)) + Math.random() * 0.1).toFixed(1)}K`,
        views: `${Math.floor(parseFloat(creator.views.slice(0, -1)) + Math.random() * 10)}K`
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const cardPositions = [
    { x: "10%", y: "20%", delay: 0 },
    { x: "85%", y: "15%", delay: 0.2 },
    { x: "15%", y: "70%", delay: 0.4 },
    { x: "80%", y: "65%", delay: 0.6 },
    { x: "50%", y: "85%", delay: 0.8 }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {currentCreators.map((creator, index) => {
        const position = cardPositions[index];
        
        return (
          <motion.div
            key={creator.id}
            className="absolute pointer-events-auto"
            style={{ 
              left: position.x, 
              top: position.y,
              transform: "translate(-50%, -50%)"
            }}
            initial={{ 
              opacity: 0, 
              scale: 0.5, 
              y: 100,
              rotateX: -30 
            }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              rotateX: 0
            }}
            transition={{ 
              delay: position.delay,
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1]
            }}
            whileHover={{ 
              scale: 1.05,
              y: -10,
              rotateY: 5,
              transition: { duration: 0.3 }
            }}
            drag
            dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
            dragElastic={0.2}
          >
            <div className="relative">
              {/* Creator Card */}
              <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-white/20 rounded-2xl p-4 w-72 shadow-2xl">
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12 border-2 border-luxury-primary/50">
                      <AvatarImage src={creator.avatar} alt={creator.name} />
                      <AvatarFallback>{creator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    {creator.isLive && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-white" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white truncate">{creator.name}</h3>
                      {creator.isLive && (
                        <Badge className="bg-red-500 text-white text-xs px-2 py-0.5">LIVE</Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-400">{creator.category}</p>
                  </div>
                </div>

                {/* Content Preview */}
                <div className="mb-3">
                  <div className="bg-gradient-to-r from-luxury-primary/20 to-luxury-accent/20 rounded-lg p-3 mb-2">
                    <p className="text-sm text-white">{creator.content}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-800/50 rounded-lg p-2">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <DollarSign className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-slate-400">Earned</span>
                    </div>
                    <p className="text-sm font-bold text-green-400">{creator.earnings}</p>
                  </div>
                  
                  <div className="bg-slate-800/50 rounded-lg p-2">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Eye className="w-3 h-3 text-blue-400" />
                      <span className="text-xs text-slate-400">Views</span>
                    </div>
                    <p className="text-sm font-bold text-blue-400">{creator.views}</p>
                  </div>
                  
                  <div className="bg-slate-800/50 rounded-lg p-2">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Heart className="w-3 h-3 text-pink-400" />
                      <span className="text-xs text-slate-400">Likes</span>
                    </div>
                    <p className="text-sm font-bold text-pink-400">{creator.likes}</p>
                  </div>
                </div>
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-luxury-primary/20 to-luxury-accent/20 rounded-2xl blur-xl -z-10 opacity-60" />
            </div>
          </motion.div>
        );
      })}
      
      {/* Floating Emojis */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl opacity-40"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        >
          {['💎', '🔥', '⭐', '💖', '🎯', '✨', '🌟', '💰'][i]}
        </motion.div>
      ))}
    </div>
  );
};