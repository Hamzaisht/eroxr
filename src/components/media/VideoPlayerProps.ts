
export interface VideoPlayerProps {
  url: string;
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  showWatermark?: boolean;
  showCloseButton?: boolean;
  creatorId?: string;
  onClose?: () => void;
  onClick?: () => void;
  onError?: () => void;
  onLoad?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}
