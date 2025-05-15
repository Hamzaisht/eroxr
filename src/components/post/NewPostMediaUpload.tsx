
import { useState } from "react";
import { MediaUploader } from "@/components/shared/MediaUploader";
import { UniversalMedia } from "@/components/media/UniversalMedia";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface NewPostMediaUploadProps {
  onMediaUrlsChange: (urls: string[]) => void;
}

export const NewPostMediaUpload: React.FC<NewPostMediaUploadProps> = ({ 
  onMediaUrlsChange 
}) => {
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [showUploader, setShowUploader] = useState(false);

  const handleMediaComplete = (url: string) => {
    const newMediaUrls = [...mediaUrls, url];
    setMediaUrls(newMediaUrls);
    onMediaUrlsChange(newMediaUrls);
    setShowUploader(false);
  };

  const handleRemoveMedia = (indexToRemove: number) => {
    const newMediaUrls = mediaUrls.filter((_, index) => index !== indexToRemove);
    setMediaUrls(newMediaUrls);
    onMediaUrlsChange(newMediaUrls);
  };

  return (
    <div className="space-y-4">
      {mediaUrls.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mediaUrls.map((url, index) => (
            <div key={index} className="relative group">
              <UniversalMedia
                item={url}
                className="w-full h-48 rounded-md overflow-hidden"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveMedia(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {showUploader ? (
        <div className="border rounded-md p-4">
          <MediaUploader 
            bucketName="posts"
            onComplete={handleMediaComplete}
          />
          <Button
            variant="ghost"
            className="mt-2"
            onClick={() => setShowUploader(false)}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowUploader(true)}
        >
          Add Media
        </Button>
      )}
    </div>
  );
};
