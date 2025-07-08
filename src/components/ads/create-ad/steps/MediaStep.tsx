import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { GlassmorphicCard } from '../components/GlassmorphicCard';
import { StepProps } from '../types';
import { Upload, Camera, Video, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const MediaStep = ({ data, updateData, onNext, onPrevious }: StepProps) => {
  const [dragActive, setDragActive] = useState(false);
  const profileImageRef = useRef<HTMLInputElement>(null);
  const additionalImagesRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const handleProfileImageUpload = (file: File) => {
    updateData({ profileImage: file });
  };

  const handleAdditionalImagesUpload = (files: FileList) => {
    const newImages = Array.from(files).slice(0, 5 - data.additionalImages.length);
    updateData({ additionalImages: [...data.additionalImages, ...newImages] });
  };

  const handleVideoUpload = (file: File) => {
    updateData({ profileVideo: file });
  };

  const removeAdditionalImage = (index: number) => {
    const updated = data.additionalImages.filter((_, i) => i !== index);
    updateData({ additionalImages: updated });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = e.dataTransfer.files;
      if (files[0].type.startsWith('image/')) {
        if (!data.profileImage) {
          handleProfileImageUpload(files[0]);
        } else {
          handleAdditionalImagesUpload(files);
        }
      } else if (files[0].type.startsWith('video/')) {
        handleVideoUpload(files[0]);
      }
    }
  };

  const handleNext = () => {
    if (data.profileImage) {
      onNext();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <motion.h2 
          className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Show your best self
        </motion.h2>
        <motion.p 
          className="text-base text-white/70"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Upload photos and videos to make your profile shine
        </motion.p>
      </div>

      <div className="grid gap-4">
        {/* Profile Image Upload */}
        <GlassmorphicCard variant="gradient" hoverable>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Camera className="w-5 h-5 text-purple-400" />
              <h3 className="text-white/90 font-medium">Profile Photo (Required)</h3>
            </div>
            
            <div
              className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 ${
                dragActive ? 'border-purple-400 bg-purple-500/10' : 'border-white/20 hover:border-white/40'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {data.profileImage ? (
                <div className="flex items-center gap-4">
                  <img
                    src={URL.createObjectURL(data.profileImage)}
                    alt="Profile"
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-white font-medium">{data.profileImage.name}</p>
                    <p className="text-white/60 text-sm">{(data.profileImage.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateData({ profileImage: null })}
                    className="text-white/60 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <p className="text-white/80 mb-2">Drop your profile photo here or</p>
                  <Button
                    variant="outline"
                    onClick={() => profileImageRef.current?.click()}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    Browse Files
                  </Button>
                </div>
              )}
              
              <input
                ref={profileImageRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleProfileImageUpload(e.target.files[0])}
                className="hidden"
              />
            </div>
          </div>
        </GlassmorphicCard>

        {/* Additional Images */}
        <GlassmorphicCard variant="gradient" hoverable>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon className="w-5 h-5 text-pink-400" />
              <h3 className="text-white/90 font-medium">Additional Photos (Optional)</h3>
              <span className="text-white/60 text-sm">({data.additionalImages.length}/5)</span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {data.additionalImages.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Additional ${index}`}
                    className="w-full h-24 rounded-lg object-cover"
                  />
                  <button
                    onClick={() => removeAdditionalImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
              
              {data.additionalImages.length < 5 && (
                <button
                  onClick={() => additionalImagesRef.current?.click()}
                  className="h-24 border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center hover:border-white/40 transition-colors"
                >
                  <Upload className="w-6 h-6 text-white/40" />
                </button>
              )}
            </div>

            <input
              ref={additionalImagesRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => e.target.files && handleAdditionalImagesUpload(e.target.files)}
              className="hidden"
            />
          </div>
        </GlassmorphicCard>

        {/* Video Upload */}
        <GlassmorphicCard variant="gradient" hoverable>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Video className="w-5 h-5 text-blue-400" />
              <h3 className="text-white/90 font-medium">Profile Video (Optional)</h3>
            </div>

            {data.profileVideo ? (
              <div className="flex items-center gap-4">
                <video
                  src={URL.createObjectURL(data.profileVideo)}
                  className="w-20 h-20 rounded-xl object-cover"
                  controls={false}
                />
                <div className="flex-1">
                  <p className="text-white font-medium">{data.profileVideo.name}</p>
                  <p className="text-white/60 text-sm">{(data.profileVideo.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateData({ profileVideo: null })}
                  className="text-white/60 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="text-center border-2 border-dashed border-white/20 rounded-xl p-6 hover:border-white/40 transition-colors">
                <Video className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <p className="text-white/80 mb-2">Upload a short intro video</p>
                <Button
                  variant="outline"
                  onClick={() => videoRef.current?.click()}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Choose Video
                </Button>
              </div>
            )}

            <input
              ref={videoRef}
              type="file"
              accept="video/*"
              onChange={(e) => e.target.files?.[0] && handleVideoUpload(e.target.files[0])}
              className="hidden"
            />
          </div>
        </GlassmorphicCard>
      </div>

      {/* Navigation */}
      <motion.div 
        className="flex justify-between pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          onClick={onPrevious}
          className="px-6 py-3 text-white/70 hover:text-white transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Back
        </motion.button>

        <motion.button
          onClick={handleNext}
          disabled={!data.profileImage}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:scale-105"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Review & Publish
        </motion.button>
      </motion.div>
    </motion.div>
  );
};