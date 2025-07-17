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
    { id: 'voice', name: 'Voice', icon: Mic, action: () => handleVoiceRecording() },
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

  const handleVoiceRecording = () => {
    // Start voice recording
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks: Blob[] = [];

        mediaRecorder.addEventListener('dataavailable', event => {
          audioChunks.push(event.data);
        });

        mediaRecorder.addEventListener('stop', () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          onMediaSelect(audioBlob, 'media');
          stream.getTracks().forEach(track => track.stop());
        });

        mediaRecorder.start();
        
        // Stop recording after 10 seconds or when user stops
        setTimeout(() => {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
        }, 10000);
      })
      .catch(error => {
        console.error('Error accessing microphone:', error);
        alert('Could not access microphone. Please check permissions.');
      });
    
    onClose();
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
    <div className="absolute bottom-full left-1/2 transform -translate-x-2 mb-4 z-50">
      {/* Background overlay */}
      <div 
        className="fixed inset-0 -z-10" 
        onClick={onClose}
      />
      
      <div 
        className="bg-[#0D1117] rounded-md border border-gray-700/50 shadow-2xl overflow-hidden backdrop-blur-lg"
        style={{ width: '200px', maxHeight: '250px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {categories.map((category) => {
          const Icon = category.icon;
          const isSnax = category.id === 'snax';
          
          return (
            <button
              key={category.id}
              className="w-full flex items-center gap-3 px-4 py-3 text-white text-left bg-transparent border-none rounded cursor-pointer relative transition-all duration-300 hover:bg-[#21262C] focus:bg-[#1A1F24] focus:outline-none active:bg-[#1A1F24] before:content-[''] before:absolute before:top-1 before:-left-2 before:w-1 before:h-4/5 before:bg-[#2F81F7] before:rounded before:opacity-0 focus:before:opacity-100 active:before:opacity-100 group"
              onClick={() => handleItemClick(category)}
              style={{
                color: isSnax ? 'hsl(var(--primary))' : 'white'
              }}
            >
              <Icon 
                className="h-4 w-4 flex-shrink-0 transition-all duration-300"
                style={{
                  color: isSnax ? 'hsl(var(--primary))' : 'white'
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