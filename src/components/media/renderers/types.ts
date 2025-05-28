
interface MediaAsset {
  id: string;
  storage_path: string;
  media_type: string;
  alt_text?: string;
  original_name?: string;
  user_id?: string;
  metadata?: {
    post_id?: string;
    [key: string]: any;
  };
}

export interface RendererProps {
  mediaItem: MediaAsset;
  mediaUrl: string;
  isLoading: boolean;
  showWatermark: boolean;
  onLoad: () => void;
  onError: () => void;
}

export interface VideoRendererProps extends RendererProps {
  controls: boolean;
  autoPlay: boolean;
  isMuted: boolean;
  onMuteToggle: () => void;
}

export interface AudioRendererProps extends RendererProps {
  controls: boolean;
}
