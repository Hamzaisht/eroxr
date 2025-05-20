
import { DatingAd } from '@/types/dating';

export interface VideoContentProps {
  ad: DatingAd;
  isActive?: boolean;
  isPreviewMode?: boolean;
  isHovered?: boolean;
  isAnimation?: boolean;
}

export interface ProfileBadgesProps {
  ad: DatingAd;
}

export interface ProfileInfoProps {
  ad: DatingAd;
  isPreviewMode?: boolean;
}

export interface VideoProfileCardProps {
  ad: DatingAd;
  isPreviewMode?: boolean;
  isAnimation?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}
