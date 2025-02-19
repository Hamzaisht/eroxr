import { useState, useRef, useEffect } from 'react';
import { Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SnapPreview } from './SnapPreview';

interface SnapCameraProps {
  onCapture: (blob: Blob) => void;
  onClose: () => void;
}

export const SnapCamera = ({ onCapture, onClose }: SnapCameraProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const recordingTimeoutRef = useRef<NodeJS.Timeout>();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' }, 
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

  const handleTouchStart = () => {
    if (!mediaStreamRef.current) return;

    setIsRecording(true);
    chunksRef.current = [];
    
    mediaRecorderRef.current = new MediaRecorder(mediaStreamRef.current);
    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };
    
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      handleCapture(blob);
    };
    
    mediaRecorderRef.current.start();
    
    recordingTimeoutRef.current = setTimeout(() => {
      handleTouchEnd();
    }, 10000); // Max 10 seconds
  };

  const handleTouchEnd = () => {
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
    }
    
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleClick = () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx && videoRef.current) {
      ctx.drawImage(videoRef.current, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) onCapture(blob);
      }, 'image/jpeg', 0.95);
    }
  };

  const handleCapture = (blob: Blob) => {
    setPreviewBlob(blob);
  };

  const handleSendSnap = (blob: Blob, text?: string) => {
    onCapture(blob);
    setPreviewBlob(null);
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  if (previewBlob) {
    return (
      <SnapPreview
        mediaBlob={previewBlob}
        onSend={handleSendSnap}
        onClose={() => setPreviewBlob(null)}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="relative flex-1">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-white hover:bg-white/20"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <button
          className={`w-16 h-16 rounded-full border-4 ${
            isRecording ? 'border-red-500 bg-red-500' : 'border-white bg-white/20'
          } transition-all duration-200`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseUp={handleTouchEnd}
          onClick={handleClick}
        />
      </div>
    </div>
  );
};
