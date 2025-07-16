import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Mic, X, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface PermissionHandlerProps {
  children: React.ReactNode;
}

type PermissionType = 'camera' | 'microphone' | 'both';

export const PermissionHandler = ({ children }: PermissionHandlerProps) => {
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [permissionType, setPermissionType] = useState<PermissionType>('camera');
  const [permissionDenied, setPermissionDenied] = useState(false);
  const { toast } = useToast();

  // Global permission request handler
  const requestPermissions = async (type: PermissionType) => {
    try {
      let stream: MediaStream | null = null;

      if (type === 'camera') {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      } else if (type === 'microphone') {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } else if (type === 'both') {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      }

      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setShowPermissionDialog(false);
        setPermissionDenied(false);
        return true;
      }
    } catch (error) {
      console.error('Permission denied:', error);
      setPermissionType(type);
      setShowPermissionDialog(true);
      setPermissionDenied(true);
      return false;
    }
    return false;
  };

  // Global error handler for permission errors
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      if (event.message.includes('Permission denied') || event.message.includes('camera') || event.message.includes('microphone')) {
        event.preventDefault();
        setShowPermissionDialog(true);
      }
    };

    window.addEventListener('error', handleGlobalError);
    return () => window.removeEventListener('error', handleGlobalError);
  }, []);

  const handleRequestPermission = async () => {
    const granted = await requestPermissions(permissionType);
    if (granted) {
      toast({
        title: "Permission granted",
        description: `${permissionType === 'both' ? 'Camera and microphone' : permissionType} access enabled`
      });
    }
  };

  const getPermissionIcon = () => {
    switch (permissionType) {
      case 'camera':
        return <Camera className="h-12 w-12 text-white/70" />;
      case 'microphone':
        return <Mic className="h-12 w-12 text-white/70" />;
      case 'both':
        return (
          <div className="flex gap-2">
            <Camera className="h-10 w-10 text-white/70" />
            <Mic className="h-10 w-10 text-white/70" />
          </div>
        );
    }
  };

  const getPermissionText = () => {
    switch (permissionType) {
      case 'camera':
        return {
          title: 'Camera Access Required',
          description: 'Please allow camera access to take photos and videos'
        };
      case 'microphone':
        return {
          title: 'Microphone Access Required',
          description: 'Please allow microphone access for voice messages and calls'
        };
      case 'both':
        return {
          title: 'Camera & Microphone Access Required',
          description: 'Please allow camera and microphone access for video calls'
        };
    }
  };

  const permissionText = getPermissionText();

  return (
    <>
      {children}
      
      <AnimatePresence>
        {showPermissionDialog && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPermissionDialog(false)}
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="text-center">
                <div className="flex justify-center mb-6">
                  {getPermissionIcon()}
                </div>

                <h3 className="text-xl font-bold text-white mb-4">
                  {permissionText.title}
                </h3>
                
                <p className="text-white/70 mb-8 leading-relaxed">
                  {permissionText.description}
                </p>

                <div className="space-y-3">
                  <Button
                    onClick={handleRequestPermission}
                    className="w-full bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-white font-medium py-3 rounded-xl shadow-lg transition-all duration-300 hover:shadow-primary/30"
                  >
                    Allow Access
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => {
                      // Open browser settings help
                      window.open('https://support.google.com/chrome/answer/2693767', '_blank');
                    }}
                    className="w-full text-white/70 hover:text-white hover:bg-white/10 py-3 rounded-xl flex items-center justify-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Browser Settings Help
                  </Button>
                </div>

                <p className="text-xs text-white/50 mt-6">
                  You can also manually enable permissions in your browser settings
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Export the request function for use in other components
export const requestMediaPermission = async (type: PermissionType): Promise<boolean> => {
  try {
    let stream: MediaStream | null = null;

    if (type === 'camera') {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
    } else if (type === 'microphone') {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } else if (type === 'both') {
      stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    }

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      return true;
    }
  } catch (error) {
    console.error('Permission denied:', error);
    return false;
  }
  return false;
};