
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { shortcutMap } from "../utils/datingUtils";

interface UseSearchParamsProps {
  setSelectedTag: (tag: string | null) => void;
  setSelectedSeeker: (seeker: string | null) => void;
  setSelectedLookingFor: (lookingFor: string | null) => void;
}

export const useSearchParams = ({ 
  setSelectedTag, 
  setSelectedSeeker, 
  setSelectedLookingFor 
}: UseSearchParamsProps) => {
  const location = useLocation();
  const navigate = useNavigate();

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
    } else if (seekerParam && shortcutMap[seekerParam.toUpperCase()]) {
      const { seeker, looking_for } = shortcutMap[seekerParam.toUpperCase()];
      setSelectedSeeker(seeker);
      setSelectedLookingFor(looking_for);
    }
  }, [location.search, setSelectedTag, setSelectedSeeker, setSelectedLookingFor]);

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    const params = new URLSearchParams(location.search);
    params.set('tag', tag);
    navigate(`${location.pathname}?${params.toString()}`);
  };

  return { handleTagClick };
};
