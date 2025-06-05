
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Camera, Video, RotateCcw, X, Square, Circle } from 'lucide-react';
import { useCameraRecording } from '@/hooks/useCameraRecording';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onCancel: () => void;
  mode: 'photo' | 'video';
}

export const CameraCapture = ({ onCapture, onCancel, mode }: CameraCaptureProps) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const {
    isRecording,
    recordedBlob,
    recordingTime,
    startRecording,
    stopRecording,
    resetRecording,
  } = useCameraRecording();

  const startCamera = async () => {
    try {
      setError(null);
      const constraints = {
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: mode === 'video'
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setHasPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Camera access denied. Please allow camera permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const switchCamera = () => {
    stopCamera();
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0);
    
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `story-photo-${Date.now()}.jpg`, { 
          type: 'image/jpeg' 
        });
        onCapture(file);
      }
    }, 'image/jpeg', 0.9);
  };

  const handleVideoRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  useEffect(() => {
    if (recordedBlob) {
      const file = new File([recordedBlob], `story-video-${Date.now()}.webm`, {
        type: 'video/webm'
      });
      onCapture(file);
    }
  }, [recordedBlob, onCapture]);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      resetRecording();
    };
  }, [facingMode]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Camera className="w-16 h-16 text-luxury-neutral/50" />
        <p className="text-luxury-neutral text-center">{error}</p>
        <Button onClick={startCamera} variant="outline">
          Try Again
        </Button>
        <Button onClick={onCancel} variant="ghost">
          Cancel
        </Button>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin w-8 h-8 border-2 border-luxury-primary border-t-transparent rounded-full" />
        <p className="text-luxury-neutral">Starting camera...</p>
      </div>
    );
  }

  return (
    <div className="relative bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full aspect-[9/16] object-cover"
      />
      
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Header Controls */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="bg-black/50 text-white hover:bg-black/70"
        >
          <X className="w-5 h-5" />
        </Button>
        
        {mode === 'video' && isRecording && (
          <div className="bg-red-500 px-3 py-1 rounded-full">
            <span className="text-white text-sm font-mono">
              {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
            </span>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          onClick={switchCamera}
          className="bg-black/50 text-white hover:bg-black/70"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center space-x-8">
        {mode === 'photo' ? (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={capturePhoto}
            className="w-16 h-16 rounded-full border-4 border-white bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <Camera className="w-6 h-6 text-white" />
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleVideoRecording}
            className={`w-16 h-16 rounded-full border-4 border-white flex items-center justify-center ${
              isRecording 
                ? 'bg-red-500' 
                : 'bg-white/20 backdrop-blur-sm'
            }`}
          >
            {isRecording ? (
              <Square className="w-6 h-6 text-white" />
            ) : (
              <Circle className="w-6 h-6 text-white" />
            )}
          </motion.button>
        )}
      </div>

      {/* Recording indicator */}
      {isRecording && (
        <motion.div
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 px-3 py-1 rounded-full"
        >
          <span className="text-white text-sm font-medium">Recording</span>
        </motion.div>
      )}
    </div>
  );
};
