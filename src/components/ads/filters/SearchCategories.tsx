
import { SearchCategory } from "../types/dating";

export interface SearchCategoriesProps {
  searchCategories: SearchCategory[];
  selectedSeeker: string | null;
  selectedLookingFor: string | null;
  setSelectedSeeker: (seeker: string | null) => void;
  setSelectedLookingFor: (lookingFor: string | null) => void;
}

export const SearchCategories = ({
  searchCategories,
  selectedSeeker,
  selectedLookingFor,
  setSelectedSeeker,
  setSelectedLookingFor,
}: SearchCategoriesProps) => {
  const handleCategoryClick = (seeker: string, lookingFor: string) => {
    if (selectedSeeker === seeker && selectedLookingFor === lookingFor) {
      // Toggle off if already selected
      setSelectedSeeker(null);
      setSelectedLookingFor(null);
    } else {
      // Set new selection
      setSelectedSeeker(seeker);
      setSelectedLookingFor(lookingFor);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
      {searchCategories.map((category) => {
        const isSelected = 
          selectedSeeker === category.seeker && 
          selectedLookingFor === category.looking_for;
        
        return (
          <button
            key={`${category.seeker}-${category.looking_for}`}
            className={`text-sm py-1.5 px-2 rounded-md transition-colors ${
              isSelected 
                ? "bg-luxury-primary text-white" 
                : "bg-luxury-darker text-luxury-neutral hover:bg-luxury-dark"
            }`}
            onClick={() => handleCategoryClick(category.seeker, category.looking_for)}
          >
            {formatCategoryLabel(category)}
          </button>
        );
      })}
    </div>
  );
};

// Helper function to format category labels
function formatCategoryLabel(category: SearchCategory): string {
  if (category.seeker === "verified") return "Verified";
  if (category.seeker === "premium") return "Premium";
  
  const seekerMap: Record<string, string> = {
    male: "M",
    female: "F",
    couple: "MF",
    trans: "T"
  };
  
  const lookingForMap: Record<string, string> = {
    male: "M",
    female: "F",
    couple: "MF",
    trans: "T",
    any: "A"
  };
  
  const seeker = seekerMap[category.seeker] || category.seeker;
  const lookingFor = lookingForMap[category.looking_for] || category.looking_for;
  
  return `${seeker}4${lookingFor}`;
}
