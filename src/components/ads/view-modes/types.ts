
import { DatingAd } from "../types/dating";

export interface GridViewModeProps {
  ads: DatingAd[];
  isLoading?: boolean;
  onMediaClick?: (url: string) => void;
  userProfile?: DatingAd | null;
}

export interface GridItemProps {
  ad: DatingAd;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  onSelect: (ad: DatingAd) => void;
  onMediaClick?: (url: string) => void;
  onTagClick?: (tag: string, e: React.MouseEvent) => void;
  isMobile: boolean;
  userProfile?: DatingAd | null;
}

export interface ListViewModeProps {
  ads: DatingAd[];
  isLoading?: boolean;
  onMediaClick?: (url: string) => void;
  userProfile?: DatingAd | null;
}
