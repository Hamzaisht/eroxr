
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Type, Sparkles, Sticker, Wand2 } from 'lucide-react';

interface SnapPreviewProps {
  mediaBlob: Blob;
  onSend: (blob: Blob, text?: string) => void;
  onClose: () => void;
}

export const SnapPreview = ({ mediaBlob, onSend, onClose }: SnapPreviewProps) => {
  const [text, setText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('none');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaUrl = URL.createObjectURL(mediaBlob);
  const isVideo = mediaBlob.type.startsWith('video/');

  const filters = [
    { name: 'none', label: 'Normal' },
    { name: 'grayscale', label: 'B&W' },
    { name: 'sepia', label: 'Sepia' },
    { name: 'saturate', label: 'Vibrant' },
    { name: 'blur', label: 'Blur' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex flex-col"
    >
      <div className="relative flex-1">
        <div className={`w-full h-full relative ${selectedFilter !== 'none' ? `filter ${selectedFilter}` : ''}`}>
          {isVideo ? (
            <video
              src={mediaUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={mediaUrl}
              alt="Snap preview"
              className="w-full h-full object-cover"
            />
          )}
          {text && (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.p
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-white text-4xl font-bold text-center px-4 py-2 rounded shadow-lg"
                style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
              >
                {text}
              </motion.p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 snap-x">
              {filters.map((filter) => (
                <Button
                  key={filter.name}
                  variant={selectedFilter === filter.name ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter.name)}
                  className="snap-center whitespace-nowrap"
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  {filter.label}
                </Button>
              ))}
            </div>

            {/* Text Input */}
            <div className="flex gap-2">
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Add text..."
                className="bg-white/20 text-white placeholder:text-white/60 border-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <Button variant="ghost" onClick={onClose} className="text-white">
                <X className="h-5 w-5 mr-2" />
                Cancel
              </Button>
              <Button onClick={() => onSend(mediaBlob, text)} className="bg-luxury-primary">
                <Send className="h-5 w-5 mr-2" />
                Send Snap
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
