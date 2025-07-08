
import { DatingContentController } from "./DatingContentController";

interface DatingContentProps {
  datingAds: any[];
  isLoading: boolean;
  activeTab: string;
  userProfile: any;
  handleAdCreationSuccess: () => void;
  handleTagClick: (tag: string) => void;
  handleTabChange: (tab: string) => void;
  handleFilterToggle: () => void;
}

/**
 * Main DatingContent wrapper for the body dating experience.
 * Handles only prop passing and composition.
 */
export function DatingContent(props: DatingContentProps) {
  // Map the props to match what DatingContentController expects
  const controllerProps = {
    ads: props.datingAds || [],
    canAccessBodyContact: true, // Default to true for now
    onAdCreationSuccess: props.handleAdCreationSuccess,
    onTagClick: props.handleTagClick,
    isLoading: props.isLoading,
    userProfile: props.userProfile,
    activeTab: props.activeTab,
    onTabChange: props.handleTabChange,
    onFilterToggle: props.handleFilterToggle
  };

  return <DatingContentController {...controllerProps} />;
}
