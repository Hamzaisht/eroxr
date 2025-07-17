import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Send, 
  Type, 
  Sparkles, 
  Timer, 
  Palette,
  Wand2,
  RotateCcw,
  Crop,
  Zap
} from 'lucide-react';

interface EnhancedSnapPreviewProps {
  mediaBlob: Blob;
  duration: number;
  onSend: (blob: Blob, text?: string) => void;
  onClose: () => void;
}

export const EnhancedSnapPreview = ({ mediaBlob, duration, onSend, onClose }: EnhancedSnapPreviewProps) => {
  const [text, setText] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [textSize, setTextSize] = useState([24]);
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [brightness, setBrightness] = useState([100]);
  const [contrast, setContrast] = useState([100]);
  const [saturation, setSaturation] = useState([100]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaUrl = URL.createObjectURL(mediaBlob);
  const isVideo = mediaBlob.type.startsWith('video/');

  const textColors = [
    '#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080'
  ];

  const advancedFilters = [
    { id: 'none', name: 'Original' },
    { id: 'cyberpunk', name: 'Cyberpunk' },
    { id: 'neon', name: 'Neon' },
    { id: 'vintage', name: 'Vintage' },
    { id: 'matrix', name: 'Matrix' },
    { id: 'synthwave', name: 'Synthwave' },
    { id: 'hologram', name: 'Hologram' },
    { id: 'vaporwave', name: 'Vaporwave' }
  ];

  const getFilterStyle = () => {
    let filter = '';
    
    // Base adjustments
    filter += `brightness(${brightness[0]}%) `;
    filter += `contrast(${contrast[0]}%) `;
    filter += `saturate(${saturation[0]}%) `;
    
    // Add special filters
    switch (selectedFilter) {
      case 'cyberpunk':
        filter += 'hue-rotate(270deg) saturate(2) contrast(1.5)';
        break;
      case 'neon':
        filter += 'hue-rotate(90deg) saturate(3) brightness(1.3) contrast(1.4)';
        break;
      case 'vintage':
        filter += 'sepia(0.5) contrast(1.2) brightness(1.1)';
        break;
      case 'matrix':
        filter += 'hue-rotate(120deg) saturate(2) brightness(0.8) contrast(2)';
        break;
      case 'synthwave':
        filter += 'hue-rotate(300deg) saturate(2.5) contrast(1.6) brightness(1.2)';
        break;
      case 'hologram':
        filter += 'hue-rotate(180deg) saturate(2) brightness(1.4) contrast(1.3)';
        break;
      case 'vaporwave':
        filter += 'hue-rotate(270deg) saturate(2) brightness(1.3) contrast(1.2)';
        break;
      default:
        break;
    }
    
    return filter;
  };

  const resetAdjustments = () => {
    setBrightness([100]);
    setContrast([100]);
    setSaturation([100]);
    setSelectedFilter('none');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex flex-col"
    >
      <div className="relative flex-1">
        <div 
          className="w-full h-full relative"
          style={{ filter: getFilterStyle() }}
        >
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
          
          {/* Futuristic overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />
          
          {/* Text overlay */}
          {text && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.p
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-bold text-center px-4 py-2 rounded-lg backdrop-blur-sm"
                style={{ 
                  color: textColor,
                  fontSize: `${textSize[0]}px`,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(255,255,255,0.3)',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}
              >
                {text}
              </motion.p>
            </div>
          )}
        </div>

        {/* Top Controls */}
        <div className="absolute top-4 left-0 right-0 flex justify-between items-center px-4 z-10">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-white bg-black/30 backdrop-blur-sm rounded-full border border-white/20"
          >
            <X className="h-5 w-5 mr-2" />
            Cancel
          </Button>
          
          <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-2 border border-white/20">
            <Timer className="h-4 w-4 text-white" />
            <span className="text-white text-sm">{duration}s</span>
            <Zap className="h-4 w-4 text-yellow-400" />
          </div>
        </div>

        {/* Bottom Controls Panel */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent backdrop-blur-xl">
          <div className="space-y-4">
            
            {/* Filter Selection */}
            <div className="space-y-2">
              <label className="text-white text-sm flex items-center gap-2">
                <Wand2 className="h-4 w-4" />
                Filters
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2 snap-x scrollbar-hide">
                {advancedFilters.map((filter) => (
                  <Button
                    key={filter.id}
                    variant={selectedFilter === filter.id ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setSelectedFilter(filter.id)}
                    className="snap-center whitespace-nowrap bg-white/10 border border-white/20 text-white hover:bg-white/20"
                  >
                    {filter.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Fine-tune adjustments */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-white text-xs mb-1 block">Brightness</label>
                <Slider
                  value={brightness}
                  onValueChange={setBrightness}
                  min={50}
                  max={200}
                  step={5}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-white text-xs mb-1 block">Contrast</label>
                <Slider
                  value={contrast}
                  onValueChange={setContrast}
                  min={50}
                  max={200}
                  step={5}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-white text-xs mb-1 block">Saturation</label>
                <Slider
                  value={saturation}
                  onValueChange={setSaturation}
                  min={0}
                  max={300}
                  step={10}
                  className="w-full"
                />
              </div>
            </div>

            {/* Reset button */}
            <div className="flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetAdjustments}
                className="text-white bg-white/10 border border-white/20 hover:bg-white/20"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>

            {/* Text Input */}
            <div className="space-y-2">
              <label className="text-white text-sm flex items-center gap-2">
                <Type className="h-4 w-4" />
                Add Text
              </label>
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type something..."
                className="bg-black/30 text-white placeholder:text-white/60 border border-white/20 backdrop-blur-sm"
              />
              
              {/* Text customization */}
              {text && (
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {textColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setTextColor(color)}
                        className={`w-6 h-6 rounded-full border-2 ${
                          textColor === color ? 'border-white' : 'border-white/30'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="w-20">
                    <Slider
                      value={textSize}
                      onValueChange={setTextSize}
                      min={16}
                      max={48}
                      step={2}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Send Button */}
            <Button 
              onClick={() => onSend(mediaBlob, text)} 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-none text-white font-semibold"
            >
              <Send className="h-5 w-5 mr-2" />
              Send Snax • Disappears in {duration}s
              <Sparkles className="h-4 w-4 ml-2 animate-pulse" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};