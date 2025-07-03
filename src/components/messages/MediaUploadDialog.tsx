import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Camera, Video, Mic, File, Image } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';

interface MediaUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSendMedia: (mediaUrl: string, mediaType: string, originalName?: string) => void;
}

export const MediaUploadDialog = ({ open, onOpenChange, onSendMedia }: MediaUploadDialogProps) => {
  const [uploading, setUploading] = useState(false);
  const [selectedMediaType, setSelectedMediaType] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const session = useSession();

  const handleFileSelect = async (file: File, mediaType: string) => {
    if (!session?.user?.id) return;
    
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}/${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('messages')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('messages')
        .getPublicUrl(fileName);

      onSendMedia(publicUrl, mediaType, file.name);
      onOpenChange(false);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (mediaType: string) => {
    setSelectedMediaType(mediaType);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedMediaType) {
      handleFileSelect(file, selectedMediaType);
    }
  };

  const getAcceptedTypes = () => {
    switch (selectedMediaType) {
      case 'image':
        return 'image/*';
      case 'video':
        return 'video/*';
      case 'audio':
        return 'audio/*';
      default:
        return '*/*';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md holographic-card border-white/20 p-0 overflow-hidden fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10" />
        </div>

        <div className="relative z-10">
          <DialogHeader className="p-6 border-b border-white/10 bg-white/[0.02]">
            <DialogTitle className="text-white flex items-center justify-between">
              <span>Send Media</span>
              <button 
                onClick={() => onOpenChange(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 grid grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleFileInput('image')}
              disabled={uploading}
              className="group relative overflow-hidden p-6 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 transition-all duration-300 text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Image className="w-8 h-8 text-blue-400 mx-auto mb-2 relative z-10" />
              <span className="text-white text-sm relative z-10">Photos</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleFileInput('video')}
              disabled={uploading}
              className="group relative overflow-hidden p-6 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 transition-all duration-300 text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Video className="w-8 h-8 text-purple-400 mx-auto mb-2 relative z-10" />
              <span className="text-white text-sm relative z-10">Videos</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleFileInput('audio')}
              disabled={uploading}
              className="group relative overflow-hidden p-6 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 transition-all duration-300 text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Mic className="w-8 h-8 text-green-400 mx-auto mb-2 relative z-10" />
              <span className="text-white text-sm relative z-10">Audio</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleFileInput('document')}
              disabled={uploading}
              className="group relative overflow-hidden p-6 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 transition-all duration-300 text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <File className="w-8 h-8 text-orange-400 mx-auto mb-2 relative z-10" />
              <span className="text-white text-sm relative z-10">Documents</span>
            </motion.button>
          </div>

          {uploading && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20">
              <div className="text-center">
                <div className="relative w-12 h-12 mx-auto mb-4">
                  <div className="absolute inset-0 border-2 border-primary/30 rounded-full animate-spin border-t-primary" />
                </div>
                <p className="text-white">Uploading...</p>
              </div>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          accept={getAcceptedTypes()}
          className="hidden"
        />
      </DialogContent>
    </Dialog>
  );
};