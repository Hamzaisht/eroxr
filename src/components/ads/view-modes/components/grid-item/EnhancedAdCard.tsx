import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { DatingAd } from '../../../types/dating';
import { AdActions } from './AdActions';
import { UserInfo } from './UserInfo';
import { AdStats } from './AdStats';
import { AdTags } from './AdTags';
import { VideoThumbnail } from '../VideoThumbnail';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Crown, Shield, MessageCircle, Heart, Eye, Zap, Star } from 'lucide-react';
import { calculateMatchPercentage, getMatchLabel } from '@/components/dating/utils/matchCalculator';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EnhancedAdCardProps {
  ad: DatingAd;
  onSelect: (ad: DatingAd) => void;
  isMobile: boolean;
  userProfile?: DatingAd | null;
  index?: number;
}

export const EnhancedAdCard = ({ ad, onSelect, isMobile, userProfile, index = 0 }: EnhancedAdCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(ad.likes_count || 0); // Use actual likes count
  const [viewCount, setViewCount] = useState(ad.view_count || ad.views || 0); // Separate view count
  const [isViewed, setIsViewed] = useState(false);
  const session = useSession();
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user has already liked this ad
  useEffect(() => {
    if (!session?.user?.id) return;
    
    const checkLikeStatus = async () => {
      const { data } = await supabase
        .from('dating_ad_likes')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('dating_ad_id', ad.id)
        .maybeSingle();
      
      setIsLiked(!!data);
    };
    
    checkLikeStatus();
  }, [session?.user?.id, ad.id]);

  // Calculate match percentage
  const matchPercentage = calculateMatchPercentage(userProfile || null, ad);
  const matchInfo = getMatchLabel(matchPercentage);
  const isHighMatch = matchPercentage > 85;

  // Animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9,
      rotateX: -15
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        type: "spring" as const,
        stiffness: 100
      }
    },
    hover: {
      y: -10,
      scale: 1.02,
      rotateX: 5,
      transition: {
        duration: 0.3,
        type: "spring" as const,
        stiffness: 400
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  // Track view when card becomes visible
  useEffect(() => {
    if (isViewed || !session) return;
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const newViewCount = viewCount + 1;
        setViewCount(newViewCount);
        supabase.from('dating_ads').update({ 
          view_count: newViewCount 
        }).eq('id', ad.id);
        setIsViewed(true);
        observer.disconnect();
      }
    }, { threshold: 0.6 });
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => observer.disconnect();
  }, [ad.id, isViewed, session, viewCount]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!session?.user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to like profiles",
        variant: "destructive",
      });
      return;
    }
    
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikesCount(prev => newLiked ? prev + 1 : prev - 1);

    try {
      if (newLiked) {
        // Add like
        await supabase
          .from('dating_ad_likes')
          .insert({
            user_id: session.user.id,
            dating_ad_id: ad.id
          });
      } else {
        // Remove like
        await supabase
          .from('dating_ad_likes')
          .delete()
          .eq('user_id', session.user.id)
          .eq('dating_ad_id', ad.id);
      }

      toast({
        title: newLiked ? "💕 Divine Connection!" : "💔 Blessing Removed",
        description: newLiked 
          ? `You've blessed ${ad.title} with your divine favor` 
          : `You've removed your blessing from ${ad.title}`,
        duration: 2000,
      });
    } catch (error) {
      // Revert on error
      setIsLiked(!newLiked);
      setLikesCount(prev => newLiked ? prev - 1 : prev + 1);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    }
  };

  const handleMessage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!session?.user?.id) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to send messages",
        variant: "destructive",
      });
      return;
    }

    if (session.user.id === ad.user_id) {
      toast({
        title: "Cannot Message Yourself",
        description: "You cannot send a message to your own ad",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create or find existing message thread
      const { data: existingThreads, error: threadError } = await supabase
        .from('message_threads')
        .select('id')
        .contains('participants', [session.user.id, ad.user_id])
        .eq('thread_type', 'direct')
        .limit(1);

      if (threadError) {
        console.error('Error checking threads:', threadError);
        throw threadError;
      }

      let threadId: string;

      if (existingThreads && existingThreads.length > 0) {
        // Use existing thread
        threadId = existingThreads[0].id;
      } else {
        // Create new thread
        const { data: newThread, error: createError } = await supabase
          .from('message_threads')
          .insert({
            participants: [session.user.id, ad.user_id],
            created_by: session.user.id,
            thread_type: 'direct'
          })
          .select('id')
          .single();

        if (createError) {
          console.error('Error creating thread:', createError);
          throw createError;
        }

        threadId = newThread.id;
      }

      // Navigate to messages with the thread
      navigate(`/messages?thread=${threadId}&user=${ad.user_id}`);
      
      toast({
        title: "Message Thread Opened",
        description: `You can now chat with ${ad.title}`,
      });
    } catch (error) {
      console.error('Error opening message thread:', error);
      toast({
        title: "Error",
        description: "Failed to open message thread. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="group relative perspective-1000"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(ad)}
    >
      {/* Main Card Container */}
      <div className={cn(
        "relative overflow-hidden rounded-2xl cursor-pointer",
        "bg-gradient-to-br from-black/40 via-purple-900/20 to-cyan-900/20",
        "backdrop-filter backdrop-blur-xl",
        "border border-white/10",
        "transition-all duration-500",
        "aspect-[3/4]",
        isHighMatch && "ring-2 ring-yellow-400/50",
        isHovered && "border-cyan-400/40 shadow-2xl shadow-cyan-500/20"
      )}>
        
        {/* Neural Network Background */}
        <div className="absolute inset-0 neural-bg opacity-30" />
        
        {/* Floating Particles */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
            >
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [-20, 20, -20],
                    x: [-10, 10, -10],
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video/Image Content */}
        <div className="relative w-full h-full">
          {ad.videoUrl || ad.avatar_url ? (
            <VideoThumbnail
              videoUrl={ad.videoUrl}
              isHovered={isHovered}
              isMobile={isMobile}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-cyan-900/50 flex items-center justify-center">
              <div className="text-center">
                <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
                <p className="text-white/60 text-sm">Divine Profile</p>
              </div>
            </div>
          )}

          {/* Quantum Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate={isHovered ? "visible" : "hidden"}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"
          />
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1 z-20">
          {ad.isVerified && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Badge className="bg-blue-500/20 border-blue-400/50 text-blue-300 text-xs">
                <Shield className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            </motion.div>
          )}
          
          {ad.isPremium && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Badge className="bg-yellow-500/20 border-yellow-400/50 text-yellow-300 text-xs">
                <Crown className="w-3 h-3 mr-1" />
                Elite
              </Badge>
            </motion.div>
          )}

          {isHighMatch && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Badge className="bg-pink-500/20 border-pink-400/50 text-pink-300 text-xs">
                <Star className="w-3 h-3 mr-1" />
                {matchPercentage}% Match
              </Badge>
            </motion.div>
          )}
        </div>

        {/* Top Right Actions */}
        <div className="absolute top-3 right-3 z-20">
          <AdActions ad={ad} />
        </div>

        {/* Bottom Content Overlay */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-4 z-20"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* User Info */}
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 p-0.5">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white font-bold">
                  {ad.title?.charAt(0) || "U"}
                </div>
              </div>
              {ad.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <Shield className="w-2 h-2 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-lg truncate">
                {ad.title}
              </h3>
              <p className="text-cyan-300 text-sm flex items-center gap-2">
                <Eye className="w-3 h-3" />
                <span>{viewCount} views</span>
                <span>•</span>
                <span>Active now • {ad.location}</span>
              </p>
            </div>
          </div>

          {/* Description */}
          <motion.p
            className="text-white/80 text-sm line-clamp-2 mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0.7 }}
          >
            {ad.description}
          </motion.p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {ad.tags?.slice(0, 3).map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 * i }}
                className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/80"
              >
                {tag}
              </motion.span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLike}
              className={cn(
                "flex-1 py-2 px-3 rounded-lg transition-all duration-300 text-sm font-medium",
                "bg-gradient-to-r from-pink-500/20 to-red-500/20 border border-pink-400/30",
                "hover:from-pink-500/30 hover:to-red-500/30 hover:border-pink-400/50",
                isLiked && "from-pink-500/40 to-red-500/40 border-pink-400/60"
              )}
            >
              <Heart className={cn("w-4 h-4 mr-1 inline", isLiked && "fill-current")} />
              {likesCount}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleMessage}
              className="flex-1 py-2 px-3 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-400/50 transition-all duration-300 text-sm font-medium text-white"
            >
              <MessageCircle className="w-4 h-4 mr-1 inline" />
              Message
            </motion.button>
          </div>
        </motion.div>

        {/* Quantum Glow Effect on Hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            boxShadow: isHovered 
              ? [
                  "0 0 20px rgba(0, 245, 255, 0.3)",
                  "0 0 40px rgba(139, 92, 246, 0.4)",
                  "0 0 20px rgba(0, 245, 255, 0.3)"
                ]
              : "0 0 0px rgba(0, 245, 255, 0)"
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Premium Shimmer Effect */}
        {ad.isPremium && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: [
                "linear-gradient(45deg, transparent, rgba(255, 215, 0, 0.1), transparent)",
                "linear-gradient(225deg, transparent, rgba(255, 215, 0, 0.1), transparent)",
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        )}
      </div>
    </motion.div>
  );
};