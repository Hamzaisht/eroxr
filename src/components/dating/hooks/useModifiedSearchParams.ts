
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface UseModifiedSearchParamsProps {
  setSelectedTag: (tag: string | null) => void;
  setSelectedSeeker: (seeker: string | null) => void;
  setSelectedLookingFor: (lookingFor: string | null) => void;
}

export const useModifiedSearchParams = ({
  setSelectedTag,
  setSelectedSeeker,
  setSelectedLookingFor
}: UseModifiedSearchParamsProps) => {
  const location = useLocation();
  
  // Only process URL parameters on initial load, not on user interactions
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tagParam = params.get('tag');
    const seekerParam = params.get('seeker');
    const lookingForParam = params.get('looking_for');
    
    if (tagParam) {
      setSelectedTag(tagParam);
    }
    
    if (seekerParam && lookingForParam) {
      setSelectedSeeker(seekerParam);
      setSelectedLookingFor(lookingForParam);
    }
  }, []); // Empty dependency array to only run once on component mount

  const handleTagClick = (tag: string) => {
    // Just update the state directly without modifying URL
    setSelectedTag(tag);
  };

  return { handleTagClick };
};
