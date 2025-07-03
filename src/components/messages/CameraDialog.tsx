import React, { useState, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Camera, StopCircle, RotateCcw, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface CameraDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSendCapture: (captureUrl: string, type: 'photo' | 'video') => void;
}

export const CameraDialog = ({ open, onOpenChange, onSendCapture }: CameraDialogProps) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [capturedMedia, setCapturedMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: true
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to take photos or videos",
        variant: "destructive"
      });
    }
  }, [facingMode, toast]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    if (context) {
      context.drawImage(videoRef.current, 0, 0);
      const photoUrl = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedMedia(photoUrl);
      setMediaType('photo');
      stopCamera();
    }
  }, [stopCamera]);

  const startVideoRecording = useCallback(() => {
    if (!stream) return;

    const mediaRecorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/mp4' });
      const videoUrl = URL.createObjectURL(blob);
      setCapturedMedia(videoUrl);
      setMediaType('video');
      stopCamera();
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
  }, [stream, stopCamera]);

  const stopVideoRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const handleSend = () => {
    if (capturedMedia) {
      onSendCapture(capturedMedia, mediaType);
      handleClose();
    }
  };

  const handleClose = () => {
    stopCamera();
    setCapturedMedia(null);
    setIsRecording(false);
    onOpenChange(false);
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    stopCamera();
    setTimeout(startCamera, 100);
  };

  const retake = () => {
    setCapturedMedia(null);
    startCamera();
  };

  React.useEffect(() => {
    if (open && !capturedMedia) {
      startCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [open, startCamera, stopCamera, capturedMedia]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md holographic-card border-white/20 p-0 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10" />
        </div>

        <div className="relative z-10">
          <DialogHeader className="p-4 border-b border-white/10 bg-white/[0.02]">
            <DialogTitle className="text-white flex items-center justify-between">
              <span>Camera</span>
              <button 
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </DialogTitle>
          </DialogHeader>

          <div className="relative aspect-square bg-black">
            {capturedMedia ? (
              <div className="w-full h-full flex items-center justify-center">
                {mediaType === 'photo' ? (
                  <img 
                    src={capturedMedia} 
                    alt="Captured" 
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <video 
                    src={capturedMedia} 
                    controls 
                    className="max-w-full max-h-full"
                  />
                )}
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            )}

            {!capturedMedia && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={capturePhoto}
                    disabled={isRecording}
                    className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg disabled:opacity-50"
                  >
                    <Camera className="w-8 h-8 text-black" />
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={isRecording ? stopVideoRecording : startVideoRecording}
                    className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
                      isRecording 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white text-black'
                    }`}
                  >
                    {isRecording ? (
                      <StopCircle className="w-8 h-8" />
                    ) : (
                      <div className="w-4 h-4 bg-red-500 rounded-full" />
                    )}
                  </motion.button>
                </div>

                <button
                  onClick={switchCamera}
                  className="absolute top-4 right-4 p-2 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {capturedMedia && (
            <div className="p-4 flex gap-3">
              <Button
                onClick={retake}
                variant="outline"
                className="flex-1 border-white/30 text-white hover:bg-white/10"
              >
                Retake
              </Button>
              <Button
                onClick={handleSend}
                className="flex-1 bg-gradient-to-r from-primary to-purple-500"
              >
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};