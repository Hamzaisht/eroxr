
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crop, RotateCcw, ZoomIn, ZoomOut, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageCropDialogProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onCropComplete: (croppedImageBlob: Blob) => void;
  aspectRatio?: number;
  isCircular?: boolean;
}

export const ImageCropDialog = ({ 
  isOpen, 
  onClose, 
  imageUrl, 
  onCropComplete,
  aspectRatio = 1,
  isCircular = true 
}: ImageCropDialogProps) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleCrop = useCallback(async () => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 400;
    canvas.width = size;
    canvas.height = size;

    // Create circular clipping path if needed
    if (isCircular) {
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.clip();
    }

    // Apply transformations
    ctx.save();
    ctx.translate(size / 2, size / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);
    ctx.translate(-size / 2 + position.x, -size / 2 + position.y);

    // Draw the image
    ctx.drawImage(imageRef.current, 0, 0, size, size);
    ctx.restore();

    // Convert to blob
    canvas.toBlob((blob) => {
      if (blob) {
        onCropComplete(blob);
      }
    }, 'image/jpeg', 0.9);
  }, [scale, rotation, position, isCircular, onCropComplete]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Crop className="w-6 h-6 text-cyan-400" />
                Crop Image
              </h2>
              <Button
                onClick={onClose}
                variant="ghost"
                size="icon"
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Image Preview */}
              <div className="relative bg-gray-800 rounded-2xl overflow-hidden aspect-square max-w-md mx-auto">
                <img
                  ref={imageRef}
                  src={imageUrl}
                  alt="Crop preview"
                  className="w-full h-full object-cover"
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
                    transition: 'transform 0.1s ease-out'
                  }}
                  draggable={false}
                />
                
                {/* Crop overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-white/50 ${isCircular ? 'rounded-full' : 'rounded-lg'}`}
                       style={{ 
                         width: '80%', 
                         height: '80%',
                         aspectRatio: aspectRatio 
                       }} 
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Scale</label>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setScale(Math.max(0.5, scale - 0.1))}
                      variant="outline"
                      size="icon"
                      className="w-8 h-8 border-white/20 text-white hover:bg-white/10"
                    >
                      <ZoomOut className="w-3 h-3" />
                    </Button>
                    <input
                      type="range"
                      min="0.5"
                      max="3"
                      step="0.1"
                      value={scale}
                      onChange={(e) => setScale(parseFloat(e.target.value))}
                      className="flex-1 h-2 bg-white/20 rounded-lg appearance-none slider"
                    />
                    <Button
                      onClick={() => setScale(Math.min(3, scale + 0.1))}
                      variant="outline"
                      size="icon"
                      className="w-8 h-8 border-white/20 text-white hover:bg-white/10"
                    >
                      <ZoomIn className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Rotation</label>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setRotation(rotation - 15)}
                      variant="outline"
                      size="icon"
                      className="w-8 h-8 border-white/20 text-white hover:bg-white/10"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </Button>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      step="15"
                      value={rotation}
                      onChange={(e) => setRotation(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-white/20 rounded-lg appearance-none slider"
                    />
                    <span className="text-xs text-white/60 w-8 text-center">{rotation}°</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Position X</label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    step="1"
                    value={position.x}
                    onChange={(e) => setPosition(prev => ({ ...prev, x: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none slider"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Position Y</label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    step="1"
                    value={position.y}
                    onChange={(e) => setPosition(prev => ({ ...prev, y: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none slider"
                  />
                </div>
              </div>

              {/* Hidden canvas for cropping */}
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Actions */}
            <div className="flex gap-4 p-6 border-t border-white/10">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 border-white/30 text-white hover:bg-white/10 rounded-xl h-12"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCrop}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white rounded-xl h-12 font-semibold"
              >
                <Check className="w-4 h-4 mr-2" />
                Apply Crop
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
