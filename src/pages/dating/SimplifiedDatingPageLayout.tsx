
import { useDatingFilters } from "@/components/dating/hooks/useDatingFilters";
import DatingMainContent from "../DatingMainContent";
import { DatingAd } from "@/types/dating";
import { NavigateFunction } from "react-router-dom";

interface DatingPageLayoutProps {
  datingAds?: DatingAd[];
  isLoading?: boolean;
  userProfile?: DatingAd | null;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  handleAdCreationSuccess?: () => void;
  handleTagClick?: (tag: string) => void;
  navigate?: NavigateFunction;
}

export const SimplifiedDatingPageLayout = (props: DatingPageLayoutProps) => {
  const filters = useDatingFilters();
  
  // Combine props with our filter hooks
  const combinedProps = {
    ...props,
    ...filters
  };

  return (
    <DatingMainContent {...combinedProps} />
  );
};

export default SimplifiedDatingPageLayout;
