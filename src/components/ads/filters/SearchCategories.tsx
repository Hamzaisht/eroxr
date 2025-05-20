
import { ReactNode, MouseEvent, TouchEvent } from 'react';
import { SearchCategory, SearchCategoryType } from '@/types/dating';
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
  const handleCategoryClick = (e: MouseEvent, seeker: string, lookingFor: string) => {
    // Prevent any default form behavior
    e.preventDefault();
    e.stopPropagation();
    
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

  // Prevent any form submission
  const preventFormSubmission = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  // Process categories to ensure they are all of correct format
  const processedCategories = searchCategories.map(category => {
    if (typeof category === 'string') {
      // Handle string categories (e.g., 'all', 'premium', etc.)
      return {
        seeker: category,
        lookingFor: 'any',
        label: category.charAt(0).toUpperCase() + category.slice(1)
      };
    }
    return category as SearchCategoryType;
  });

  // Group categories by seeker type
  const categoryGroups: Record<string, SearchCategoryType[]> = {};
  processedCategories.forEach(category => {
    if (typeof category === 'object') {
      if (!categoryGroups[category.seeker]) {
        categoryGroups[category.seeker] = [];
      }
      categoryGroups[category.seeker].push(category);
    }
  });

  return (
    <div 
      className="space-y-4" 
      onMouseDown={preventFormSubmission}
      onTouchStart={preventFormSubmission}
    >
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
                selectedLookingFor === category.lookingFor;
              
              return (
                <button
                  key={`${category.seeker}-${category.lookingFor}`}
                  type="button" // Explicitly set button type to prevent form submission
                  className={`relative flex flex-col items-center justify-center p-2.5 rounded-lg text-xs transition-all ${
                    isSelected 
                      ? "bg-gradient-to-r from-luxury-primary to-luxury-secondary text-white shadow-md shadow-luxury-primary/25" 
                      : "bg-luxury-darker hover:bg-luxury-dark/80 text-luxury-neutral hover:text-white"
                  }`}
                  onClick={(e) => handleCategoryClick(e, category.seeker, category.lookingFor)}
                  onMouseDown={preventFormSubmission}
                  onTouchStart={preventFormSubmission}
                >
                  <div className="mb-1.5">
                    {getCategoryIcon(category)}
                  </div>
                  <span className="text-sm font-medium">
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
function getCategoryIcon(category: SearchCategoryType): ReactNode {
  const iconSize = 18;
  const iconClassName = "opacity-90";

  // Special categories first
  if (category.seeker === "verified") {
    return <CheckCircle size={iconSize} className={iconClassName} />;
  }
  
  if (category.seeker === "premium") {
    return <Star size={iconSize} className={iconClassName} />;
  }

  // For regular categories, show icon based on seeker/lookingFor combination
  if (category.lookingFor === "any") {
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
function formatCategoryLabel(category: SearchCategoryType): string {
  if (category.label) return category.label;
  
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
  const lookingFor = lookingForMap[category.lookingFor] || category.lookingFor;
  
  return `${seeker}4${lookingFor}`;
}
