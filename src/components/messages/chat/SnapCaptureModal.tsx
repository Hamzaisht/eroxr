
import React, { useRef, useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";

interface SnapCaptureModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (dataUrl: string) => void;
}

export const SnapCaptureModal: React.FC<SnapCaptureModalProps> = ({
  open,
  onClose,
  onSubmit
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCaptureReady, setCaptureReady] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Start the camera when the modal opens
  useEffect(() => {
    if (open) {
      startCamera();
    } else {
      stopCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [open]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          setCaptureReady(true);
        };
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      setStream(null);
    }
    setCaptureReady(false);
    setCapturedImage(null);
  };

  const captureImage = () => {
    if (!canvasRef.current || !videoRef.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    // Match canvas size to video dimension
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the current video frame on the canvas
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(dataUrl);
    }
  };

  const handleSubmit = () => {
    if (capturedImage) {
      onSubmit(capturedImage);
      onClose();
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Capture Snap</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="relative">
          {!capturedImage ? (
            <div className="aspect-video bg-black rounded-md overflow-hidden">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>
          ) : (
            <div className="aspect-video bg-black rounded-md overflow-hidden">
              <img 
                src={capturedImage}
                alt="Captured snap" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
        
        <div className="flex justify-center mt-4 space-x-4">
          {!capturedImage ? (
            <Button 
              onClick={captureImage} 
              disabled={!isCaptureReady}
              className="bg-luxury-primary hover:bg-luxury-primary/80"
            >
              <Camera className="mr-2 h-5 w-5" />
              Capture
            </Button>
          ) : (
            <>
              <Button 
                onClick={retakePhoto}
                variant="outline"
              >
                Retake
              </Button>
              <Button 
                onClick={handleSubmit}
                className="bg-luxury-primary hover:bg-luxury-primary/80"
              >
                Send Snap
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
