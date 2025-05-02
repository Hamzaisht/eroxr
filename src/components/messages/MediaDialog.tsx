
import React, { useState, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image, Camera, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDropzone } from 'react-dropzone';

interface MediaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onMediaSelect: (files: FileList | string[]) => void;
  maxFiles?: number;
  allowedTypes?: string[];
}

export const MediaDialog = ({
  isOpen,
  onClose,
  onMediaSelect,
  maxFiles = 10,
  allowedTypes = ['image/*', 'video/*']
}: MediaDialogProps) => {
  const [selectedTab, setSelectedTab] = useState('upload');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Limit the number of files
    const filesToAdd = acceptedFiles.slice(0, maxFiles - selectedFiles.length);
    setSelectedFiles(prev => [...prev, ...filesToAdd]);
  }, [maxFiles, selectedFiles]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: allowedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxFiles: maxFiles - selectedFiles.length,
  });
  
  // Remove a selected file
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  // Upload selected files
  const handleUpload = () => {
    if (selectedFiles.length === 0) return;
    
    // Convert to FileList-like object for compatibility
    const dataTransfer = new DataTransfer();
    selectedFiles.forEach(file => dataTransfer.items.add(file));
    
    onMediaSelect(dataTransfer.files);
    onClose();
    setSelectedFiles([]);
  };
  
  // Handle dialog close
  const handleClose = () => {
    setSelectedFiles([]);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Media</DialogTitle>
        </DialogHeader>
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="upload">Upload Files</TabsTrigger>
            <TabsTrigger value="camera">Take Photo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors",
                isDragActive 
                  ? "border-luxury-primary bg-luxury-primary/5" 
                  : "border-luxury-neutral/20 hover:border-luxury-primary/40 hover:bg-luxury-neutral/5"
              )}
            >
              <input {...getInputProps()} />
              <Upload className="h-10 w-10 mb-2 text-luxury-neutral/60" />
              <p className="text-sm text-center mb-1">
                {isDragActive 
                  ? "Drop your files here..." 
                  : "Drag and drop your files here, or click to select"}
              </p>
              <p className="text-xs text-luxury-neutral/60 text-center">
                Supported formats: JPG, PNG, GIF, MP4, MOV
              </p>
            </div>
            
            {/* Selected files preview */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Selected files ({selectedFiles.length})</p>
                <div className="grid grid-cols-4 gap-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-md bg-luxury-neutral/10 overflow-hidden flex items-center justify-center">
                        {file.type.startsWith('image/') ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="h-full w-full object-cover"
                            onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center p-2">
                            <Image className="h-6 w-6 mb-1 text-luxury-neutral/60" />
                            <p className="text-xs text-luxury-neutral/80 truncate max-w-full">
                              {file.name.length > 10 
                                ? `${file.name.substring(0, 7)}...` 
                                : file.name}
                            </p>
                          </div>
                        )}
                      </div>
                      <button
                        className="absolute -top-1 -right-1 bg-luxury-neutral/90 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="camera">
            <div className="flex flex-col items-center justify-center py-8">
              <Camera className="h-12 w-12 mb-4 text-luxury-neutral/60" />
              <p className="text-sm text-center mb-2">
                Camera functionality will be implemented soon.
              </p>
              <p className="text-xs text-luxury-neutral/60 text-center max-w-xs">
                For now, you can upload photos from your device or use the Upload tab.
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload}
            disabled={selectedFiles.length === 0}
          >
            Upload {selectedFiles.length > 0 && `(${selectedFiles.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
