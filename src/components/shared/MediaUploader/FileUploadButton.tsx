
import React, { forwardRef } from 'react';
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadButtonProps {
  buttonText: string;
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'ghost';
  isUploading: boolean;
  mediaTypes: 'image' | 'video' | 'both';
  maxSizeInMB: number;
  onClick: () => void;
  className?: string;
}

export const FileUploadButton = forwardRef<HTMLButtonElement, FileUploadButtonProps>(
  ({ buttonText, buttonVariant = 'default', isUploading, mediaTypes, maxSizeInMB, onClick, className }, ref) => {
    return (
      <Button
        ref={ref}
        variant={buttonVariant}
        onClick={onClick}
        disabled={isUploading}
        className={`w-full h-16 ${className}`}
      >
        <div className="flex flex-col items-center justify-center">
          <Upload className="h-5 w-5 mb-1" />
          <span className="text-sm">{buttonText}</span>
          <span className="text-xs text-muted-foreground mt-1">
            {mediaTypes === 'image' ? 'Images' : 
             mediaTypes === 'video' ? 'Videos' :
             'Images and videos'}
            {` (max ${maxSizeInMB}MB)`}
          </span>
        </div>
      </Button>
    );
  }
);

FileUploadButton.displayName = 'FileUploadButton';
