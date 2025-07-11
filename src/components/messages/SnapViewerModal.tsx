import { useState, useEffect, useRef } from 'react';
import { X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { motion } from 'framer-motion';

interface SnapViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  snapUrl: string;
  isVideo?: boolean;
  duration?: number;
}

export const SnapViewerModal = ({ isOpen, onClose, snapUrl, isVideo = false, duration = 10 }: SnapViewerModalProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [hasStarted, setHasStarted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen && !hasStarted) {
      setHasStarted(true);
      setTimeLeft(duration);
      
      // Start countdown
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isOpen, hasStarted, duration, onClose]);

  const handleClose = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-4xl p-0 bg-black border-none">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full h-[80vh] flex items-center justify-center"
        >
          {/* Timer */}
          <div className="absolute top-4 left-4 z-20 bg-black/50 px-3 py-1 rounded-full">
            <span className="text-white font-mono text-sm">{timeLeft}s</span>
          </div>

          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-20 text-white hover:bg-white/20"
            onClick={handleClose}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Content */}
          <div className="w-full h-full flex items-center justify-center">
            {isVideo ? (
              <video
                ref={videoRef}
                src={snapUrl}
                autoPlay
                controls
                className="max-w-full max-h-full object-contain"
                onLoadedData={() => {
                  if (videoRef.current) {
                    videoRef.current.play();
                  }
                }}
              />
            ) : (
              <img
                src={snapUrl}
                alt="Snap"
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: duration, ease: 'linear' }}
              className="h-full bg-white"
            />
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};