import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Play, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BlurredMediaPreviewProps {
  mediaType: 'image' | 'video';
  mediaCount?: number;
  onUnlock: () => void;
  isLoading?: boolean;
  price?: number;
  previewUrl?: string;
}

export const BlurredMediaPreview = ({ 
  mediaType, 
  mediaCount = 1, 
  onUnlock, 
  isLoading = false,
  price,
  previewUrl
}: BlurredMediaPreviewProps) => {
  return (
    <div className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer">
      {/* Realistic blurred background with subtle content hints */}
      <div className="absolute inset-0">
        {previewUrl ? (
          <img 
            src={previewUrl}
            alt="Blurred preview"
            className="w-full h-full object-cover filter blur-3xl brightness-50 saturate-150"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-600/40 via-pink-500/30 to-orange-400/40" />
        )}
      </div>
      
      {/* Depth layers for realism */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/80" />
      <div className="absolute inset-0 backdrop-blur-3xl" />
      
      {/* Subtle content pattern overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M20 20c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8zm0-20c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8z'/%3E%3C/g%3E%3C/svg%3E")`,
          filter: 'blur(1px)'
        }}
      />
      
      {/* Central lock overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Glow background */}
          <div className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full scale-150" />
          
          {/* Main content card */}
          <div className="relative bg-black/80 backdrop-blur-md rounded-2xl p-8 text-center border border-white/10 shadow-2xl min-w-[280px]">
            <motion.div
              animate={{ 
                rotate: [0, -3, 3, 0],
                scale: [1, 1.05, 1, 1.02, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                repeatType: "reverse" 
              }}
              className="mb-4"
            >
              <Lock className="w-16 h-16 text-yellow-400 mx-auto drop-shadow-2xl" />
            </motion.div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-white">
                {mediaType === 'video' ? (
                  <Play className="w-5 h-5 text-pink-400" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-pink-400" />
                )}
                <span className="font-bold text-xl">
                  {mediaCount} Exclusive {mediaType === 'video' ? 'Video' : 'Photo'}{mediaCount > 1 ? 's' : ''}
                </span>
              </div>
              
              <p className="text-gray-300 text-sm">4K Quality • Uncensored Content</p>
              
              <div className="bg-gradient-to-r from-pink-500/20 to-orange-500/20 border border-pink-500/30 rounded-lg p-3 mt-4">
                <p className="text-pink-300 text-sm font-medium mb-2">What you'll get:</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                    Full resolution
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                    No watermarks
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                    Instant access
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                    Lifetime access
                  </div>
                </div>
              </div>
              
              {price && (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-lg font-bold px-4 py-2 rounded-full mb-4">
                  ${price}
                </div>
              )}
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={onUnlock}
                  disabled={isLoading}
                  size="lg"
                  className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 hover:from-pink-600 hover:via-purple-600 hover:to-orange-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg transform transition-all duration-200 text-lg"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Unlock Now
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Animated shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 animate-shimmer" />
      
      {/* Corner indicators */}
      <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full">
        PREMIUM
      </div>
      
      {/* Bottom glow */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
    </div>
  );
};