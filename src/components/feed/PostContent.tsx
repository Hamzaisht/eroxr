
import { useState } from "react";
import { Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FullscreenMediaViewer } from "@/components/media/FullscreenMediaViewer";

interface PostContentProps {
  content: string;
  mediaAssets?: Array<{
    id: string;
    media_type: string;
    storage_path: string;
    alt_text?: string;
  }>;
  className?: string;
}

export const PostContent = ({ content, mediaAssets, className = "" }: PostContentProps) => {
  const [fullscreenMedia, setFullscreenMedia] = useState<{
    url: string;
    type: 'image' | 'video';
    alt: string;
  } | null>(null);

  const getMediaUrl = (storagePath: string) => {
    return `https://ysqbdaeohlupucdmivkt.supabase.co/storage/v1/object/public/media/${storagePath}`;
  };

  const openFullscreen = (asset: any) => {
    setFullscreenMedia({
      url: getMediaUrl(asset.storage_path),
      type: asset.media_type.startsWith('video') ? 'video' : 'image',
      alt: asset.alt_text || 'Media content'
    });
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Text Content */}
      {content && (
        <div className="text-sm text-gray-900 leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
      )}

      {/* Media Assets */}
      {mediaAssets && mediaAssets.length > 0 && (
        <div className="space-y-2">
          {mediaAssets.map((asset) => (
            <div key={asset.id} className="relative group">
              {asset.media_type.startsWith('image') ? (
                <div className="relative">
                  <img
                    src={getMediaUrl(asset.storage_path)}
                    alt={asset.alt_text || 'Post image'}
                    className="w-full max-h-96 object-cover rounded-lg cursor-pointer"
                    onClick={() => openFullscreen(asset)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openFullscreen(asset)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/70 text-white"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </div>
              ) : asset.media_type.startsWith('video') ? (
                <div className="relative">
                  <video
                    src={getMediaUrl(asset.storage_path)}
                    className="w-full max-h-96 object-cover rounded-lg cursor-pointer"
                    controls
                    onClick={() => openFullscreen(asset)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openFullscreen(asset)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/70 text-white"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Media Viewer */}
      {fullscreenMedia && (
        <FullscreenMediaViewer
          isOpen={!!fullscreenMedia}
          onClose={() => setFullscreenMedia(null)}
          mediaUrl={fullscreenMedia.url}
          mediaType={fullscreenMedia.type}
          alt={fullscreenMedia.alt}
        />
      )}
    </div>
  );
};
