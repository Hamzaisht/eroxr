
import { AlertCircle, ImageOff } from "lucide-react";

interface MediaErrorPlaceholderProps {
  mediaItem: {
    id: string;
    storage_path: string;
    media_type: string;
    mime_type?: string;
    original_name?: string;
  };
  error: string;
}

export const MediaErrorPlaceholder = ({ mediaItem, error }: MediaErrorPlaceholderProps) => {
  console.log("MediaErrorPlaceholder - Showing error for:", { mediaItem, error });

  return (
    <div className="flex items-center justify-center bg-luxury-darker border border-luxury-neutral/20 rounded-lg p-8 min-h-[200px]">
      <div className="text-center">
        <ImageOff className="w-12 h-12 text-luxury-neutral/40 mx-auto mb-3" />
        <p className="text-luxury-neutral/60 text-sm mb-2">Media not available</p>
        <p className="text-luxury-neutral/40 text-xs">
          {mediaItem.original_name || 'Unknown file'}
        </p>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-2 text-xs text-red-400">
            <summary className="cursor-pointer">Debug Info</summary>
            <p className="mt-1">Error: {error}</p>
            <p>Path: {mediaItem.storage_path}</p>
            <p>Type: {mediaItem.media_type}</p>
            {mediaItem.mime_type && <p>MIME: {mediaItem.mime_type}</p>}
          </details>
        )}
      </div>
    </div>
  );
};
