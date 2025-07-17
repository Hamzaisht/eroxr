import { useState, useRef, useEffect } from 'react';
import { Camera, X, RotateCcw, Timer, Sparkles, Wand2, Palette, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { EnhancedSnapPreview } from './EnhancedSnapPreview';
import { motion, AnimatePresence } from 'framer-motion';

interface EnhancedSnapCameraProps {
  onCapture: (blob: Blob, duration?: number) => void;
  onClose: () => void;
}

export const EnhancedSnapCamera = ({ onCapture, onClose }: EnhancedSnapCameraProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const recordingTimeoutRef = useRef<NodeJS.Timeout>();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [currentFilter, setCurrentFilter] = useState('none');
  const [facing, setFacing] = useState<'user' | 'environment'>('user');
  const [snapDuration, setSnapDuration] = useState([10]);
  const [showSettings, setShowSettings] = useState(false);

  // 30+ Filters inspired by social media apps
  const filters = [
    { id: 'none', name: 'Original', css: '' },
    { id: 'vintage', name: 'Vintage', css: 'sepia(0.5) contrast(1.2) brightness(1.1)' },
    { id: 'cyberpunk', name: 'Cyberpunk', css: 'hue-rotate(270deg) saturate(2) contrast(1.5)' },
    { id: 'neon', name: 'Neon', css: 'hue-rotate(90deg) saturate(3) brightness(1.3) contrast(1.4)' },
    { id: 'matrix', name: 'Matrix', css: 'hue-rotate(120deg) saturate(2) brightness(0.8) contrast(2)' },
    { id: 'midnight', name: 'Midnight', css: 'brightness(0.6) contrast(1.8) saturate(0.3)' },
    { id: 'sunset', name: 'Sunset', css: 'hue-rotate(15deg) saturate(1.5) brightness(1.2) contrast(1.1)' },
    { id: 'ocean', name: 'Ocean', css: 'hue-rotate(200deg) saturate(1.3) brightness(1.1)' },
    { id: 'synthwave', name: 'Synthwave', css: 'hue-rotate(300deg) saturate(2.5) contrast(1.6) brightness(1.2)' },
    { id: 'chrome', name: 'Chrome', css: 'grayscale(0.3) contrast(1.5) brightness(1.1) saturate(0.8)' },
    { id: 'hologram', name: 'Hologram', css: 'hue-rotate(180deg) saturate(2) brightness(1.4) contrast(1.3)' },
    { id: 'vaporwave', name: 'Vaporwave', css: 'hue-rotate(270deg) saturate(2) brightness(1.3) contrast(1.2)' },
    { id: 'noir', name: 'Noir', css: 'grayscale(1) contrast(1.8) brightness(0.9)' },
    { id: 'thermal', name: 'Thermal', css: 'hue-rotate(60deg) saturate(3) contrast(2) brightness(1.1)' },
    { id: 'xray', name: 'X-Ray', css: 'invert(1) contrast(2) brightness(0.8)' },
    { id: 'plasma', name: 'Plasma', css: 'hue-rotate(240deg) saturate(3) contrast(1.7) brightness(1.3)' },
    { id: 'arctic', name: 'Arctic', css: 'hue-rotate(200deg) saturate(0.7) brightness(1.4) contrast(1.1)' },
    { id: 'desert', name: 'Desert', css: 'hue-rotate(30deg) saturate(1.2) brightness(1.3) contrast(1.1)' },
    { id: 'toxic', name: 'Toxic', css: 'hue-rotate(120deg) saturate(3) brightness(1.2) contrast(1.4)' },
    { id: 'electric', name: 'Electric', css: 'hue-rotate(240deg) saturate(2.5) brightness(1.5) contrast(1.6)' },
    { id: 'golden', name: 'Golden', css: 'hue-rotate(45deg) saturate(1.5) brightness(1.3) contrast(1.2)' },
    { id: 'silver', name: 'Silver', css: 'saturate(0) brightness(1.2) contrast(1.3)' },
    { id: 'fire', name: 'Fire', css: 'hue-rotate(15deg) saturate(2) brightness(1.4) contrast(1.3)' },
    { id: 'ice', name: 'Ice', css: 'hue-rotate(180deg) saturate(0.8) brightness(1.3) contrast(1.1)' },
    { id: 'rainbow', name: 'Rainbow', css: 'hue-rotate(180deg) saturate(2) brightness(1.2) contrast(1.3)' },
    { id: 'sepia', name: 'Sepia', css: 'sepia(1) contrast(1.1) brightness(1.1)' },
    { id: 'blur', name: 'Blur', css: 'blur(2px)' },
    { id: 'sharp', name: 'Sharp', css: 'contrast(2) brightness(1.1)' },
    { id: 'dream', name: 'Dream', css: 'blur(1px) brightness(1.3) saturate(1.5)' },
    { id: 'ghost', name: 'Ghost', css: 'brightness(1.5) contrast(0.8) saturate(0.3)' }
  ];

  const startCamera = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      if (videoDevices.length === 0) {
        throw new Error('No camera found');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: facing,
          width: { min: 640, ideal: 1280, max: 1920 },
          height: { min: 480, ideal: 720, max: 1080 }
        }, 
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        mediaStreamRef.current = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleCapture = () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx && videoRef.current) {
      // Apply filter to canvas
      ctx.filter = filters.find(f => f.id === currentFilter)?.css || '';
      ctx.drawImage(videoRef.current, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) setPreviewBlob(blob);
      }, 'image/jpeg', 0.95);
    }
  };

  const handleSendSnap = (blob: Blob, text?: string) => {
    onCapture(blob, snapDuration[0]);
    setPreviewBlob(null);
  };

  const switchCamera = () => {
    setFacing(prev => prev === 'user' ? 'environment' : 'user');
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [facing]);

  if (previewBlob) {
    return (
      <EnhancedSnapPreview
        mediaBlob={previewBlob}
        duration={snapDuration[0]}
        onSend={handleSendSnap}
        onClose={() => setPreviewBlob(null)}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col overflow-hidden">
      {/* Video with filter overlay */}
      <div className="relative flex-1">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ filter: filters.find(f => f.id === currentFilter)?.css || '' }}
        />
        
        {/* Holographic overlay for futuristic feel */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />
        
        {/* Top Controls */}
        <div className="absolute top-4 left-0 right-0 flex justify-between items-center px-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="text-white bg-black/30 backdrop-blur-sm rounded-full border border-white/20"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white bg-black/30 backdrop-blur-sm rounded-full border border-white/20"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white bg-black/30 backdrop-blur-sm rounded-full border border-white/20"
              onClick={switchCamera}
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="absolute top-16 right-4 bg-black/80 backdrop-blur-xl rounded-2xl p-4 border border-white/20"
            >
              <div className="space-y-4 w-48">
                <div>
                  <label className="text-white text-sm mb-2 block flex items-center gap-2">
                    <Timer className="h-4 w-4" />
                    Snap Duration: {snapDuration[0]}s
                  </label>
                  <Slider
                    value={snapDuration}
                    onValueChange={setSnapDuration}
                    min={10}
                    max={60}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter Carousel */}
        <div className="absolute bottom-32 left-0 right-0 px-4">
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x scrollbar-hide">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setCurrentFilter(filter.id)}
                className={`snap-center flex-shrink-0 w-16 h-16 rounded-xl border-2 transition-all duration-300 ${
                  currentFilter === filter.id
                    ? 'border-cyan-400 bg-cyan-500/20 scale-110'
                    : 'border-white/30 bg-white/10'
                }`}
              >
                <div 
                  className="w-full h-full rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 opacity-80"
                  style={{ filter: filter.css }}
                />
              </button>
            ))}
          </div>
          <p className="text-white text-center text-xs mt-2 opacity-70">
            {filters.find(f => f.id === currentFilter)?.name}
          </p>
        </div>

        {/* Capture Button */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="relative">
            <button
              onClick={handleCapture}
              className="w-20 h-20 rounded-full border-4 border-white bg-white/20 backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center group"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
                <Camera className="h-8 w-8 text-white group-active:scale-75 transition-transform" />
              </div>
            </button>
            
            {/* Sparkle effects */}
            <div className="absolute -top-2 -right-2">
              <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};