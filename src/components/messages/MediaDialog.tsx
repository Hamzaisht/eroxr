
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { createUniqueFilePath, uploadFileToStorage } from "@/utils/media/mediaUtils";
import { Loader2, X, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { isVideoFile, isImageFile } from '@/utils/upload/validators';

interface MediaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onMediaSelect: (files: FileList | string[]) => void;
}

export const MediaDialog = ({ isOpen, onClose, onMediaSelect }: MediaDialogProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const session = useSession();
  const { toast } = useToast();

  // Clear state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      // Don't clear while uploading is in progress
      if (!isUploading) {
        setSelectedFiles([]);
        setPreviews([]);
        setUploadProgress([]);
        setErrors([]);
      }
    }
  }, [isOpen, isUploading]);

  // Create preview URLs for selected files
  const createPreviews = (files: File[]) => {
    const newPreviews = files.map(file => {
      const url = URL.createObjectURL(file);
      return url;
    });
    
    setPreviews(prev => [...prev, ...newPreviews]);
    return newPreviews;
  };

  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !session?.user?.id) return;
    
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
    
    // Create previews
    createPreviews(files);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle removing a file before upload
  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
    
    setPreviews(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
    
    setUploadProgress(prev => {
      const newProgress = [...prev];
      newProgress.splice(index, 1);
      return newProgress;
    });
    
    setErrors(prev => {
      const newErrors = [...prev];
      newErrors.splice(index, 1);
      return newErrors;
    });
  };

  // Process all selected files for upload
  const handleUpload = async () => {
    if (selectedFiles.length === 0 || !session?.user?.id) return;
    
    setIsUploading(true);
    
    try {
      // For immediate feedback, pass the FileList to the parent component
      onMediaSelect(selectedFiles);
      
      // Initialize progress array
      setUploadProgress(new Array(selectedFiles.length).fill(0));
      setErrors(new Array(selectedFiles.length).fill(''));
      
      // Upload files to Supabase storage and get URLs
      const uploadPromises = selectedFiles.map(async (file, index) => {
        try {
          const path = createUniqueFilePath(session.user.id, file);
          
          // Update progress periodically for visual feedback
          const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
              const newProgress = [...prev];
              // Simulate progress until we get to 90%
              if (newProgress[index] < 90) {
                newProgress[index] = Math.min(90, newProgress[index] + Math.random() * 15);
              }
              return newProgress;
            });
          }, 300);
          
          const result = await uploadFileToStorage('messages', path, file);
          
          clearInterval(progressInterval);
          
          if (!result.success || !result.url) {
            throw new Error(result.error || "Failed to upload file");
          }
          
          // Set progress to 100% when done
          setUploadProgress(prev => {
            const newProgress = [...prev];
            newProgress[index] = 100;
            return newProgress;
          });
          
          return result.url;
        } catch (error: any) {
          setErrors(prev => {
            const newErrors = [...prev];
            newErrors[index] = error.message || "Upload failed";
            return newErrors;
          });
          throw error;
        }
      });
      
      try {
        const urls = await Promise.all(uploadPromises);
        
        // Now pass the actual storage URLs to the parent component
        onMediaSelect(urls);
        
        toast({
          title: "Media uploaded",
          description: "Your media files have been uploaded successfully",
        });
        
        onClose();
      } catch (error) {
        // Some uploads may have succeeded, but we caught an aggregated error
        // We'll handle individual errors at the file level
        console.error("Some media uploads failed:", error);
      }
    } catch (error: any) {
      console.error("Media upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload media",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Upload Media</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
            
            {/* File previews */}
            {previews.length > 0 && (
              <div className="grid grid-cols-2 gap-2 w-full">
                <AnimatePresence>
                  {previews.map((preview, index) => (
                    <motion.div 
                      key={`${preview}-${index}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative rounded-md overflow-hidden bg-black/5 border border-white/10"
                    >
                      {/* Preview content */}
                      {selectedFiles[index] && isImageFile(selectedFiles[index]) ? (
                        <img 
                          src={preview} 
                          alt={`Preview ${index}`} 
                          className="w-full h-32 object-cover"
                        />
                      ) : selectedFiles[index] && isVideoFile(selectedFiles[index]) ? (
                        <video 
                          src={preview} 
                          className="w-full h-32 object-cover"
                          controls={false}
                        />
                      ) : null}
                      
                      {/* Remove button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 bg-black/40 hover:bg-black/60 text-white rounded-full"
                        onClick={() => handleRemoveFile(index)}
                        disabled={isUploading}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      
                      {/* Upload progress */}
                      {isUploading && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                          <div 
                            className="h-full bg-luxury-primary transition-all"
                            style={{ width: `${uploadProgress[index]}%` }}
                          ></div>
                        </div>
                      )}
                      
                      {/* Error message */}
                      {errors[index] && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-xs text-red-300 text-center p-2">
                            {errors[index]}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
            
            {/* Upload button */}
            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
              disabled={isUploading}
              variant={previews.length > 0 ? "outline" : "default"}
            >
              <Upload className="h-4 w-4 mr-2" />
              Select More Files
            </Button>
            
            {/* Send button */}
            {selectedFiles.length > 0 && (
              <Button 
                onClick={handleUpload}
                className="w-full"
                disabled={isUploading}
                variant="default"
              >
                {isUploading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>
                ) : (
                  <>Send {selectedFiles.length} {selectedFiles.length === 1 ? 'file' : 'files'}</>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
