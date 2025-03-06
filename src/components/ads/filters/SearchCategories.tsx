
import { ReactNode } from 'react';
import { SearchCategory } from "../types/dating";
import { User, Users, Heart, CheckCircle, Star, Sparkles, Flame } from "lucide-react";

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

  // Group categories by seeker type
  const categoryGroups: Record<string, SearchCategory[]> = {};
  searchCategories.forEach(category => {
    if (!categoryGroups[category.seeker]) {
      categoryGroups[category.seeker] = [];
    }
    categoryGroups[category.seeker].push(category);
  });

  return (
    <div className="space-y-4">
      {Object.entries(categoryGroups).map(([seeker, categories]) => (
        <div key={seeker} className="space-y-2">
          <h4 className="text-xs uppercase text-luxury-neutral font-medium tracking-wider flex items-center gap-1.5">
            {getCategoryGroupIcon(seeker)}
            {getCategoryGroupLabel(seeker)}
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {categories.map((category) => {
              const isSelected = 
                selectedSeeker === category.seeker && 
                selectedLookingFor === category.looking_for;
              
              return (
                <button
                  key={`${category.seeker}-${category.looking_for}`}
                  className={`relative flex flex-col items-center justify-center p-2.5 rounded-lg text-xs transition-all ${
                    isSelected 
                      ? "bg-gradient-to-r from-luxury-primary to-luxury-secondary text-white shadow-md shadow-luxury-primary/25" 
                      : "bg-luxury-darker hover:bg-luxury-dark/80 text-luxury-neutral hover:text-white"
                  }`}
                  onClick={() => handleCategoryClick(category.seeker, category.looking_for)}
                >
                  <div className="mb-1.5">
                    {getCategoryIcon(category)}
                  </div>
                  <span className="text-xs font-medium">
                    {formatCategoryLabel(category)}
                  </span>
                  
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-luxury-primary rounded-full animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper functions

// Function to get group icon
function getCategoryGroupIcon(seeker: string): ReactNode {
  const iconSize = 14;
  const iconClassName = "text-luxury-primary";

  switch (seeker) {
    case "male": return <User size={iconSize} className={iconClassName} />;
    case "female": return <User size={iconSize} className={iconClassName} />;
    case "couple": return <Users size={iconSize} className={iconClassName} />;
    case "verified": return <CheckCircle size={iconSize} className={iconClassName} />;
    case "premium": return <Star size={iconSize} className={iconClassName} />;
    default: return <Sparkles size={iconSize} className={iconClassName} />;
  }
}

// Function to get group label
function getCategoryGroupLabel(seeker: string): string {
  switch (seeker) {
    case "male": return "Men";
    case "female": return "Women";
    case "couple": return "Couples";
    case "verified": return "Verified";
    case "premium": return "Premium";
    default: return seeker.charAt(0).toUpperCase() + seeker.slice(1);
  }
}

// Function to get appropriate icon for category
function getCategoryIcon(category: SearchCategory): ReactNode {
  const iconSize = 18;
  const iconClassName = "opacity-90";

  // Special categories first
  if (category.seeker === "verified") {
    return <CheckCircle size={iconSize} className={iconClassName} />;
  }
  
  if (category.seeker === "premium") {
    return <Star size={iconSize} className={iconClassName} />;
  }

  // For regular categories, show icon based on seeker/looking_for combination
  if (category.looking_for === "any") {
    return <Flame size={iconSize} className={iconClassName} />;
  }
  
  switch (category.seeker) {
    case "male":
      return <User size={iconSize} className={iconClassName} />;
    case "female":
      return <User size={iconSize} className={iconClassName} />;
    case "couple":
      return <Users size={iconSize} className={iconClassName} />;
    default:
      return <Heart size={iconSize} className={iconClassName} />;
  }
}

// Format category labels
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
