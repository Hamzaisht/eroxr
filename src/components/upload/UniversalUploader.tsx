
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useUniversalUpload } from '@/hooks/useUniversalUpload';
import { MediaAccessLevel } from '@/utils/media/types';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { AnimatedBackground } from './components/AnimatedBackground';
import { FloatingParticles } from './components/FloatingParticles';
import { DropZone } from './components/DropZone';
import { FileList } from './components/FileList';
import { UploadForm } from './components/UploadForm';

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

  const { upload, uploadMultiple, isUploading, progress, error, urls, assetIds } = useUniversalUpload();

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

  // Extract dropzone props to avoid conflicts with motion props
  const dropzoneProps = getRootProps();
  const { onClick, onKeyDown, onFocus, onBlur } = dropzoneProps;

  return (
    <div className={`relative ${className}`}>
      <AnimatedBackground />

      <Card className="relative backdrop-blur-xl bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 border border-gray-700/50 overflow-hidden">
        <FloatingParticles />

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
          <DropZone
            isDragActive={isDragActive}
            acceptedTypes={acceptedTypes}
            maxFiles={maxFiles}
            onClick={onClick}
            onKeyDown={onKeyDown}
            onFocus={onFocus}
            onBlur={onBlur}
            getInputProps={getInputProps}
          />

          {selectedFiles.length > 0 && (
            <>
              <FileList
                selectedFiles={selectedFiles}
                isUploading={isUploading}
                onRemoveFile={removeFile}
              />

              <UploadForm
                selectedFiles={selectedFiles}
                accessLevel={accessLevel}
                setAccessLevel={setAccessLevel}
                ppvAmount={ppvAmount}
                setPpvAmount={setPpvAmount}
                altText={altText}
                setAltText={setAltText}
                isUploading={isUploading}
                progress={progress}
                error={error}
                showAccessSelector={showAccessSelector}
                showPPV={showPPV}
                onUpload={handleUpload}
              />
            </>
          )}
        </div>
      </Card>
    </div>
  );
};
