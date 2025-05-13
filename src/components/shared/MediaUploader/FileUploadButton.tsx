
import React from 'react';
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadButtonProps {
  buttonText: string;
  buttonVariant: 'default' | 'outline' | 'ghost' | 'link' | 'secondary' | 'destructive';
  isUploading: boolean;
  mediaTypes: 'image' | 'video' | 'both';
  maxSizeInMB: number;
  onClick: () => void;
}

export const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  buttonText,
  buttonVariant,
  isUploading,
  mediaTypes,
  maxSizeInMB,
  onClick
}) => {
  const mediaTypeLabel = mediaTypes === 'both' 
    ? 'images and videos' 
    : mediaTypes === 'image' ? 'images' : 'videos';
    
  return (
    <Button
      variant={buttonVariant}
      onClick={onClick}
      disabled={isUploading}
      className="w-full"
    >
      <Upload className="h-4 w-4 mr-2" />
      {buttonText}
      <span className="text-xs ml-2 opacity-70">
        ({mediaTypeLabel}, max {maxSizeInMB}MB)
      </span>
    </Button>
  );
};
