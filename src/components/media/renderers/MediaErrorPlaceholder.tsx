
import { AlertCircle } from 'lucide-react';

interface MediaAsset {
  id: string;
  storage_path: string;
  media_type: string;
  user_id?: string;
  metadata?: {
    post_id?: string;
    [key: string]: any;
  };
}

interface MediaErrorPlaceholderProps {
  mediaItem: MediaAsset;
  error?: string;
}

export const MediaErrorPlaceholder = ({ mediaItem, error }: MediaErrorPlaceholderProps) => {
  return (
    <div className="flex items-center justify-center bg-gray-900 text-white p-8 min-h-[200px]">
      <div className="text-center">
        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-400" />
        <p className="text-sm text-gray-400 mb-1">Failed to load media</p>
        {error && <p className="text-xs text-gray-500 mb-1">{error}</p>}
        <p className="text-xs text-gray-500 font-mono">{mediaItem.storage_path}</p>
        {mediaItem.id && <p className="text-xs text-gray-600 mt-1">ID: {mediaItem.id}</p>}
        {mediaItem.user_id && <p className="text-xs text-gray-600">User: {mediaItem.user_id}</p>}
        {mediaItem.metadata?.post_id && <p className="text-xs text-gray-600">Post: {mediaItem.metadata.post_id}</p>}
      </div>
    </div>
  );
};
