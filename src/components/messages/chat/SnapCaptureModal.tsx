
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SnapCaptureModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (dataURL: string) => void;
}

export function SnapCaptureModal({ open, onClose, onSubmit }: SnapCaptureModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  // Start camera when component mounts
  useEffect(() => {
    if (open) {
      initializeCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [open]);
  
  const initializeCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setStream(mediaStream);
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };
  
  const stopCamera = () => {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      setStream(null);
    }
  };
  
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataURL = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageDataURL);
      }
    }
  };
  
  const handleSend = () => {
    if (capturedImage) {
      onSubmit(capturedImage);
    }
  };
  
  const handleReset = () => {
    setCapturedImage(null);
  };
  
  const handleClose = () => {
    setCapturedImage(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Capture Snap</DialogTitle>
          <DialogDescription>
            Take a photo that will disappear after viewing.
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative aspect-video mt-2 overflow-hidden rounded-md">
          {!capturedImage ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <img 
              src={capturedImage} 
              alt="Captured snap" 
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        <canvas ref={canvasRef} className="hidden" />
        
        <DialogFooter className="flex sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={capturedImage ? handleReset : handleClose}
          >
            <X className="mr-2 h-4 w-4" />
            {capturedImage ? "Retake" : "Cancel"}
          </Button>
          
          {capturedImage ? (
            <Button onClick={handleSend}>
              <Check className="mr-2 h-4 w-4" />
              Send Snap
            </Button>
          ) : (
            <Button onClick={captureImage}>
              <Camera className="mr-2 h-4 w-4" />
              Capture
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
