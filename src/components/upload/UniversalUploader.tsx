
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Upload, X, Image, Video, FileText, Sparkles, Zap } from 'lucide-react';
import { useUniversalUpload } from '@/hooks/useUniversalUpload';
import { AccessLevelSelector } from './AccessLevelSelector';
import { MediaAccessLevel, MediaType } from '@/utils/media/types';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';

interface UniversalUploaderProps {
  onUploadComplete?: (urls: string[], assetIds: string[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
  defaultAccessLevel?: MediaAccessLevel;
  showAccessSelector?: boolean;
  showPPV?: boolean;
  category?: string;
  className?: string;
}

export const UniversalUploader = ({
  onUploadComplete,
  maxFiles = 5,
  acceptedTypes = ['image/*', 'video/*'],
  defaultAccessLevel = MediaAccessLevel.PUBLIC,
  showAccessSelector = true,
  showPPV = true,
  category = 'general',
  className = ""
}: UniversalUploaderProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [accessLevel, setAccessLevel] = useState(defaultAccessLevel);
  const [ppvAmount, setPpvAmount] = useState<number>(0);
  const [altText, setAltText] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { upload, uploadMultiple, isUploading, progress, error, urls, assetIds, reset } = useUniversalUpload();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxFiles: maxFiles - selectedFiles.length,
    onDrop: (acceptedFiles) => {
      setSelectedFiles(prev => [...prev, ...acceptedFiles]);
    }
  });

  const removeFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    const uploadOptions = {
      accessLevel,
      category,
      altText: altText || undefined,
      metadata: {
        ppvAmount: accessLevel === MediaAccessLevel.PPV ? ppvAmount : undefined,
        category
      }
    };

    let results;
    if (selectedFiles.length === 1) {
      results = [await upload(selectedFiles[0], uploadOptions)];
    } else {
      results = await uploadMultiple(selectedFiles, uploadOptions);
    }

    const successfulUploads = results.filter(r => r.success);
    if (successfulUploads.length > 0) {
      onUploadComplete?.(urls, assetIds);
      setSelectedFiles([]);
      setAltText('');
      setPpvAmount(0);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-5 h-5 text-cyan-400" />;
    if (file.type.startsWith('video/')) return <Video className="w-5 h-5 text-purple-400" />;
    return <FileText className="w-5 h-5 text-pink-400" />;
  };

  // Extract dropzone props to avoid conflicts with motion props
  const dropzoneProps = getRootProps();
  const { onClick, onKeyDown, onFocus, onBlur, ...restDropzoneProps } = dropzoneProps;

  return (
    <div className={`relative ${className}`}>
      {/* Dynamic background glow */}
      <motion.div
        className="absolute -inset-6 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-2xl opacity-40"
        animate={{
          x: (mousePosition.x - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)) * 0.01,
          y: (mousePosition.y - (typeof window !== 'undefined' ? window.innerHeight / 2 : 0)) * 0.01,
          rotate: [0, 1, -1, 0],
        }}
        transition={{ 
          x: { type: "spring", stiffness: 50, damping: 30 },
          y: { type: "spring", stiffness: 50, damping: 30 },
          rotate: { duration: 10, repeat: Infinity, ease: "easeInOut" }
        }}
      />

      <Card className="relative backdrop-blur-xl bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 border border-gray-700/50 overflow-hidden">
        {/* Floating particles */}
        <AnimatePresence>
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                background: `linear-gradient(45deg, ${
                  i % 3 === 0 ? '#06b6d4' : i % 3 === 1 ? '#8b5cf6' : '#ec4899'
                }, transparent)`,
                left: `${25 + i * 20}%`,
                top: `${20 + (i % 2) * 60}%`,
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3 + i * 0.2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut",
              }}
            />
          ))}
        </AnimatePresence>

        <div className="relative p-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-4"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </motion.div>
            <span className="text-sm font-medium bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Universal Media Uploader
            </span>
          </motion.div>

          {/* Drop zone */}
          <div
            onClick={onClick}
            onKeyDown={onKeyDown}
            onFocus={onFocus}
            onBlur={onBlur}
            tabIndex={0}
            role="button"
            aria-label="Upload files"
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 cursor-pointer relative overflow-hidden ${
              isDragActive 
                ? 'border-cyan-400 bg-cyan-400/5' 
                : 'border-gray-600/50 hover:border-cyan-400/40 hover:bg-gray-800/30'
            }`}
          >
            <input {...getInputProps()} />
            
            {/* Background glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 opacity-0"
              animate={isDragActive ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            
            <div className="relative">
              <motion.div
                animate={isDragActive ? { scale: 1.2, rotate: 10 } : { scale: 1, rotate: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Upload className="mx-auto h-8 w-8 text-cyan-400 mb-3" />
              </motion.div>
              
              <motion.p 
                className="text-sm text-gray-300 mb-2"
                animate={isDragActive ? { scale: 1.05 } : { scale: 1 }}
              >
                {isDragActive ? 'Drop files here...' : 'Drag and drop files here or click to browse'}
              </motion.p>
              
              <p className="text-xs text-gray-500">
                Supported: {acceptedTypes.join(', ')} • Max {maxFiles} files
              </p>
            </div>
          </div>

          {selectedFiles.length > 0 && (
            <motion.div 
              className="mt-6 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <h4 className="text-sm font-medium text-white">
                    Selected Files ({selectedFiles.length})
                  </h4>
                </div>
                
                {selectedFiles.map((file, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center justify-between p-3 bg-gray-800/30 border border-gray-700/30 rounded-lg group hover:border-gray-600/50 transition-all duration-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        {getFileIcon(file)}
                      </motion.div>
                      <div>
                        <span className="text-sm text-white truncate block max-w-[200px]">
                          {file.name}
                        </span>
                        <span className="text-xs text-gray-400">
                          ({(file.size / 1024 / 1024).toFixed(1)} MB)
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFile(index)}
                      disabled={isUploading}
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 hover:text-red-400"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>

              {showAccessSelector && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <AccessLevelSelector
                    value={accessLevel}
                    onChange={setAccessLevel}
                    showPPV={showPPV}
                  />
                </motion.div>
              )}

              {accessLevel === MediaAccessLevel.PPV && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Price (USD)
                  </label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={ppvAmount}
                    onChange={(e) => setPpvAmount(Number(e.target.value))}
                    min="0"
                    step="0.01"
                    className="bg-gray-800/50 border-gray-600/50 text-white"
                  />
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Alt Text (Optional)
                </label>
                <Input
                  placeholder="Describe this content for accessibility"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  className="bg-gray-800/50 border-gray-600/50 text-white"
                />
              </motion.div>
              
              {isUploading && (
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-cyan-400 text-center">
                    Uploading... {progress}%
                  </p>
                </motion.div>
              )}

              {error && (
                <motion.div 
                  className="text-sm text-red-400 bg-red-900/20 border border-red-500/30 p-3 rounded-lg"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {error}
                </motion.div>
              )}
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  onClick={handleUpload}
                  disabled={isUploading || selectedFiles.length === 0}
                  className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 border-0"
                >
                  {isUploading ? (
                    <motion.div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Upload className="w-4 h-4" />
                      </motion.div>
                      Uploading... {progress}%
                    </motion.div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Upload {selectedFiles.length} file(s)
                    </div>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </Card>
    </div>
  );
};
