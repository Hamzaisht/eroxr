import { useState } from 'react';
import { 
  Camera, 
  Image, 
  FileText, 
  Video, 
  Mic,
  Zap
} from 'lucide-react';
import { SnapCamera } from './SnapCamera';

interface MediaAttachmentHubProps {
  onClose: () => void;
  onMediaSelect: (blob: Blob, type: 'snax' | 'media', duration?: number) => void;
}

export const MediaAttachmentHub = ({ onClose, onMediaSelect }: MediaAttachmentHubProps) => {
  const [showCamera, setShowCamera] = useState(false);

  const categories = [
    { id: 'snax', name: 'Snax', icon: Zap, action: () => setShowCamera(true) },
    { id: 'photos', name: 'Photos', icon: Image, action: () => handleFileUpload('image/*') },
    { id: 'videos', name: 'Videos', icon: Video, action: () => handleFileUpload('video/*') },
    { id: 'voice', name: 'Voice', icon: Mic, action: () => console.log('Voice recording') },
    { id: 'documents', name: 'Files', icon: FileText, action: () => handleFileUpload('*/*') }
  ];

  const handleFileUpload = (accept: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        onMediaSelect(file, 'media');
        onClose();
      }
    };
    input.click();
  };

  const handleCameraCapture = (blob: Blob, isSnax = false, duration?: number) => {
    onMediaSelect(blob, isSnax ? 'snax' : 'media', duration);
    setShowCamera(false);
    onClose();
  };

  const handleItemClick = (category: typeof categories[0]) => {
    console.log('Button clicked:', category.name);
    category.action();
  };

  if (showCamera) {
    return (
      <SnapCamera
        onCapture={(blob) => handleCameraCapture(blob, true)}
        onClose={() => setShowCamera(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pb-16 pointer-events-none">
      {/* Background overlay */}
      <div 
        className="absolute inset-0 pointer-events-auto" 
        onClick={onClose}
      />
      
      {/* Menu container */}
      <div 
        className="relative bg-gray-900 rounded-lg border border-gray-700 shadow-xl overflow-hidden pointer-events-auto"
        style={{ width: '200px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {categories.map((category) => {
          const Icon = category.icon;
          const isSnax = category.id === 'snax';
          
          return (
            <button
              key={category.id}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-800 transition-colors border-none bg-transparent"
              onClick={() => handleItemClick(category)}
              style={{
                color: isSnax ? 'hsl(var(--primary))' : 'white'
              }}
            >
              <Icon 
                className="h-4 w-4 flex-shrink-0"
                style={{
                  color: isSnax ? 'hsl(var(--primary))' : '#9CA3AF'
                }}
              />
              <span className="text-sm font-medium">
                {category.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};