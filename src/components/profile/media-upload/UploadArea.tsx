
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Upload, Camera, ImageIcon, Video } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadAreaProps {
  getRootProps: () => any;
  getInputProps: () => any;
  isDragActive: boolean;
  isUploading: boolean;
  type: 'avatar' | 'banner';
}

export const UploadArea = ({ getRootProps, getInputProps, isDragActive, isUploading, type }: UploadAreaProps) => {
  const isAvatar = type === 'avatar';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="relative"
    >
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-3xl p-16 text-center cursor-pointer transition-all duration-500 group overflow-hidden backdrop-blur-sm",
          isDragActive
            ? "border-luxury-primary bg-gradient-to-br from-luxury-primary/20 to-luxury-accent/10 scale-[1.02] shadow-2xl"
            : "border-luxury-primary/30 hover:border-luxury-primary/60 hover:bg-gradient-to-br hover:from-luxury-primary/10 hover:to-luxury-accent/5",
          isUploading && "opacity-50 cursor-not-allowed pointer-events-none"
        )}
      >
        <input {...getInputProps()} />
        
        {/* Mythological background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 left-4 w-8 h-8 border-2 border-luxury-primary rounded-full" />
          <div className="absolute top-8 right-8 w-6 h-6 border-2 border-luxury-accent rounded-full" />
          <div className="absolute bottom-6 left-12 w-4 h-4 border-2 border-luxury-primary rounded-full" />
          <div className="absolute bottom-12 right-6 w-10 h-10 border-2 border-luxury-accent rounded-full" />
        </div>
        
        <div className="relative space-y-8">
          {isUploading ? (
            <div className="relative w-20 h-20 mx-auto">
              {/* Futuristic Neural Network Upload Animation */}
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-luxury-primary/30"
                animate={{
                  rotate: 360,
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              />
              <motion.div
                className="absolute inset-2 rounded-full border-2 border-luxury-accent/50"
                animate={{
                  rotate: -360,
                  scale: [0.9, 1.2, 0.9],
                }}
                transition={{
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                }}
              />
              <motion.div
                className="absolute inset-4 rounded-full bg-gradient-to-br from-luxury-primary to-luxury-accent"
                animate={{
                  scale: [0.8, 1.3, 0.8],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-luxury-primary rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                    originX: 0.5,
                    originY: 0.5,
                  }}
                  animate={{
                    x: Math.cos(i * 60 * Math.PI / 180) * 35,
                    y: Math.sin(i * 60 * Math.PI / 180) * 35,
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="flex justify-center gap-6">
              <motion.div 
                whileHover={{ scale: 1.2, rotate: 10, y: -5 }}
                className="w-16 h-16 text-luxury-primary/80 relative"
              >
                {isAvatar ? <Camera className="w-full h-full" /> : <ImageIcon className="w-full h-full" />}
                <motion.div
                  className="absolute inset-0 bg-luxury-primary/20 rounded-full blur-xl"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              {!isAvatar && (
                <motion.div 
                  whileHover={{ scale: 1.2, rotate: -10, y: -5 }}
                  className="w-16 h-16 text-luxury-accent/80 relative"
                >
                  <Video className="w-full h-full" />
                  <motion.div
                    className="absolute inset-0 bg-luxury-accent/20 rounded-full blur-xl"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  />
                </motion.div>
              )}
            </div>
          )}
          
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-luxury-neutral">
              {isUploading ? '🌌 Transcending to Digital Olympus...' : 
               isDragActive ? '⚡ Release the Divine Essence!' : 
               '🏛️ Upload Sacred Media to Eros\'s Realm'}
            </h3>
            <p className="text-luxury-muted text-lg">
              {isUploading 
                ? 'Your media is being blessed by the gods of creativity'
                : isDragActive 
                ? 'Let divine inspiration flow through the cosmic channels'
                : 'Drag and drop your offering or click to select from your mortal device'
              }
            </p>
            {!isAvatar && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-6 text-sm text-luxury-muted/80"
              >
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-luxury-primary/10 border border-luxury-primary/20">
                  <ImageIcon className="w-4 h-4" />
                  <span>Sacred Images</span>
                </div>
                <div className="w-2 h-2 bg-luxury-muted/40 rounded-full" />
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-luxury-accent/10 border border-luxury-accent/20">
                  <Video className="w-4 h-4" />
                  <span>Eternal Video Loops</span>
                </div>
              </motion.div>
            )}
          </div>

          {!isUploading && (
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="lg"
                className="border-luxury-primary/40 bg-luxury-dark/60 text-luxury-primary hover:bg-luxury-primary/15 rounded-2xl px-10 py-4 backdrop-blur-sm font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Upload className="w-6 h-6 mr-3" />
                Choose Divine Media
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
