import { useState } from 'react';
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, Image, FileVideo, File } from 'lucide-react';
import { formatFileSize } from '@/utils/upload/fileUtils';
import { uploadMediaToSupabase } from '@/utils/media/uploadUtils';
import { MediaAccessLevel } from '@/utils/media/types';

interface MediaUploadManagerProps {
  bucketName?: string;
  allowedTypes?: string[];
  maxSizeInMB?: number;
  onUploadComplete: (url: string) => void;
  buttonLabel?: string;
  className?: string;
}

export const MediaUploadManager = ({
  allowedTypes = ['image/*', 'video/*', 'audio/*', 'application/pdf'],
  maxSizeInMB = 100,
  onUploadComplete,
  buttonLabel = 'Upload Media',
  className = ''
}: MediaUploadManagerProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const session = useSession();
  const { toast } = useToast();
  
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    if (!session?.user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to upload media',
        variant: 'destructive'
      });
      return;
    }
    
    // Check file type
    const fileTypeAllowed = allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        const mainType = type.split('/')[0];
        return file.type.startsWith(`${mainType}/`);
      }
      return file.type === type;
    });
    
    if (!fileTypeAllowed) {
      toast({
        title: 'Unsupported File Type',
        description: `Please upload one of these formats: ${allowedTypes.join(', ')}`,
        variant: 'destructive'
      });
      return;
    }
    
    // Check file size
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      toast({
        title: 'File Too Large',
        description: `Maximum file size is ${formatFileSize(maxSizeInBytes)}`,
        variant: 'destructive'
      });
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(10);
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 300);
      
      // Use centralized upload utility
      const result = await uploadMediaToSupabase({
        file,
        userId: session.user.id,
        options: {
          bucket: 'media',
          maxSizeMB: maxSizeInMB,
          accessLevel: MediaAccessLevel.PUBLIC
        }
      });
      
      clearInterval(progressInterval);
      
      if (!result.success || !result.url) {
        throw new Error(result.error || 'Upload failed');
      }
      
      setUploadProgress(100);
      
      toast({
        title: 'Upload Complete',
        description: 'Your media file has been uploaded successfully'
      });
      
      // Pass the URL back to the parent component
      onUploadComplete(result.url);
    } catch (error: any) {
      console.error('Media upload error:', error);
      
      toast({
        title: 'Upload Failed',
        description: error.message || 'Failed to upload media file',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Clear the file input
      e.target.value = '';
    }
  };
  
  const getFileTypeIcon = () => {
    if (allowedTypes.includes('image/*')) return <Image className="h-5 w-5 mr-2" />;
    if (allowedTypes.includes('video/*')) return <FileVideo className="h-5 w-5 mr-2" />;
    return <File className="h-5 w-5 mr-2" />;
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      <Label htmlFor="media-upload" className="block mb-2">
        {buttonLabel}
      </Label>
      
      <div className="flex items-center">
        <input
          id="media-upload"
          type="file"
          accept={allowedTypes.join(',')}
          onChange={handleUpload}
          disabled={isUploading}
          className="hidden"
        />
        
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('media-upload')?.click()}
          disabled={isUploading}
          className="flex items-center"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              <span>Uploading... {uploadProgress}%</span>
            </>
          ) : (
            <>
              {getFileTypeIcon()}
              <span>{buttonLabel}</span>
            </>
          )}
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground">
        Supported formats: {allowedTypes.join(', ')} (max. {maxSizeInMB}MB)
      </p>
    </div>
  );
};
