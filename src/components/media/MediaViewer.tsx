
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2, Trash2 } from 'lucide-react';
import { MediaAsset, MediaService } from '@/services/mediaService';
import { useToast } from '@/hooks/use-toast';

interface MediaViewerProps {
  asset: MediaAsset;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export const MediaViewer = ({ asset, onDelete, showActions = true }: MediaViewerProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    const success = await MediaService.deleteAsset(asset.id);
    
    if (success) {
      toast({
        title: "File deleted",
        description: "The file has been deleted successfully"
      });
      onDelete?.(asset.id);
    } else {
      toast({
        title: "Delete failed",
        description: "Failed to delete the file",
        variant: "destructive"
      });
    }
    setIsDeleting(false);
  };

  const handleShare = () => {
    const url = MediaService.getPublicUrl(asset.storage_path);
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied",
      description: "File link copied to clipboard"
    });
  };

  const handleDownload = () => {
    const url = MediaService.getPublicUrl(asset.storage_path);
    const link = document.createElement('a');
    link.href = url;
    link.download = asset.original_name;
    link.click();
  };

  const renderMedia = () => {
    const url = MediaService.getPublicUrl(asset.storage_path);
    
    switch (asset.media_type) {
      case 'image':
        return (
          <img 
            src={url} 
            alt={asset.original_name}
            className="w-full h-full object-cover"
          />
        );
      case 'video':
        return (
          <video 
            src={url}
            controls
            className="w-full h-full"
          >
            Your browser does not support the video tag.
          </video>
        );
      case 'audio':
        return (
          <div className="flex items-center justify-center h-48">
            <audio src={url} controls className="w-full max-w-md" />
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-48 bg-gray-100">
            <div className="text-center">
              <p className="font-medium">{asset.original_name}</p>
              <p className="text-sm text-gray-500">{asset.mime_type}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        {renderMedia()}
        
        {showActions && (
          <div className="absolute top-2 right-2 flex gap-1">
            <Button size="sm" variant="secondary" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="secondary" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      <div className="p-3">
        <p className="font-medium truncate">{asset.original_name}</p>
        <div className="flex justify-between text-sm text-gray-500 mt-1">
          <span>{asset.media_type}</span>
          <span>{(asset.file_size / 1024 / 1024).toFixed(1)} MB</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Access: {asset.access_level}
        </p>
      </div>
    </Card>
  );
};
