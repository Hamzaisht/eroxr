
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, Image, Video, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useStudioUpload } from '@/hooks/useStudioUpload';
import type { MediaUploadOptions } from './types';

interface MediaUploaderProps {
  type: 'avatar' | 'banner';
  userId: string;
  currentUrl?: string;
  onUploadSuccess: (url: string) => void;
  className?: string;
}

const UPLOAD_OPTIONS: Record<'avatar' | 'banner', MediaUploadOptions> = {
  avatar: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/*'],
    bucket: 'studio-avatars'
  },
  banner: {
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['image/*', 'video/*'],
    bucket: 'studio-banners'
  }
};

export const MediaUploader = ({ 
  type, 
  userId, 
  currentUrl, 
  onUploadSuccess, 
  className = "" 
}: MediaUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const { uploadMedia, progress, resetProgress } = useStudioUpload();
  const options = UPLOAD_OPTIONS[type];

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    // Upload file
    const result = await uploadMedia(file, userId, type, options);
    
    if (result.success && result.url) {
      onUploadSuccess(result.url);
      setTimeout(() => {
        setPreview(null);
        resetProgress();
      }, 2000);
    } else {
      setPreview(null);
    }
  }, [uploadMedia, userId, type, options, onUploadSuccess, resetProgress]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: options.allowedTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxFiles: 1,
    maxSize: options.maxSize
  });

  const isUploading = progress.status === 'uploading';
  const isSuccess = progress.status === 'success';
  const isError = progress.status === 'error';

  return (
    <div className={`relative ${className}`}>
      <motion.div
        {...getRootProps()}
        className={`
          relative overflow-hidden cursor-pointer transition-all duration-300
          ${type === 'avatar' ? 'w-32 h-32 rounded-full' : 'w-full h-48 rounded-2xl'}
          ${isDragActive ? 'scale-105' : 'hover:scale-102'}
          ${isUploading ? 'pointer-events-none' : ''}
        `}
        whileHover={{ scale: type === 'avatar' ? 1.05 : 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input {...getInputProps()} disabled={isUploading} />
        
        {/* Background Image/Video */}
        {(currentUrl || preview) && (
          <div className="absolute inset-0">
            {currentUrl?.includes('.mp4') || currentUrl?.includes('.webm') || preview?.includes('video') ? (
              <video
                src={preview || currentUrl}
                className="w-full h-full object-cover"
                muted
                loop
                autoPlay
              />
            ) : (
              <img
                src={preview || currentUrl}
                alt={`${type} preview`}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        )}

        {/* Overlay */}
        <div className={`
          absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent
          flex items-center justify-center transition-opacity duration-300
          ${isDragActive ? 'opacity-100' : currentUrl || preview ? 'opacity-0 hover:opacity-100' : 'opacity-100'}
        `}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            {isUploading ? (
              <div className="space-y-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Upload className="w-8 h-8 mx-auto" />
                </motion.div>
                <p className="text-sm font-medium">{progress.message}</p>
              </div>
            ) : isSuccess ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="space-y-2"
              >
                <CheckCircle className="w-8 h-8 mx-auto text-green-400" />
                <p className="text-sm font-medium">Upload Complete!</p>
              </motion.div>
            ) : isError ? (
              <div className="space-y-2">
                <AlertCircle className="w-8 h-8 mx-auto text-red-400" />
                <p className="text-sm font-medium">Upload Failed</p>
              </div>
            ) : (
              <div className="space-y-2">
                {type === 'avatar' ? (
                  <Camera className="w-8 h-8 mx-auto" />
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Image className="w-6 h-6" />
                    <Video className="w-6 h-6" />
                  </div>
                )}
                <div className="text-center">
                  <p className="text-sm font-medium">
                    {isDragActive ? 'Drop here' : `Upload ${type}`}
                  </p>
                  <p className="text-xs opacity-75">
                    {type === 'avatar' ? 'Max 10MB' : 'Max 50MB - Image/Video'}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Progress Overlay */}
        <AnimatePresence>
          {isUploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 flex items-end"
            >
              <div className="w-full p-4">
                <Progress value={progress.progress} className="h-2" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Clear button for preview */}
      {preview && !isUploading && (
        <Button
          variant="destructive"
          size="sm"
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
          onClick={(e) => {
            e.stopPropagation();
            setPreview(null);
            resetProgress();
          }}
        >
          <X className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
};
