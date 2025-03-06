
import { type SearchCategory, type FilterOptions } from "./types/dating";
import { SearchCategories } from "./filters/SearchCategories";
import { FilterAccordion } from "./filters/FilterAccordion";
import { X, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AdFiltersProps {
  selectedCountry: string | null;
  setSelectedCountry: (country: string | null) => void;
  selectedSeeker: string | null;
  selectedLookingFor: string | null;
  setSelectedSeeker: (seeker: string | null) => void;
  setSelectedLookingFor: (lookingFor: string | null) => void;
  searchCategories: SearchCategory[];
  countries: string[];
  filterOptions: FilterOptions;
  setFilterOptions: (options: FilterOptions) => void;
  selectedTag?: string | null;
  setSelectedTag?: (tag: string | null) => void;
}

export const AdFilters = ({
  selectedSeeker,
  selectedLookingFor,
  setSelectedSeeker,
  setSelectedLookingFor,
  searchCategories,
  filterOptions,
  setFilterOptions,
  selectedTag,
  setSelectedTag,
}: AdFiltersProps) => {
  const bodyTypes = ['athletic', 'average', 'slim', 'curvy', 'muscular', 'plus_size'];
  const educationLevels = ['high_school', 'college', 'bachelor', 'master', 'phd'];

  return (
    <div className="bg-[#1A1F2C]/50 backdrop-blur-sm p-4 rounded-xl shadow-lg space-y-4">
      {/* Tag Filter Display */}
      {selectedTag && setSelectedTag && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-luxury-neutral/80 flex items-center gap-1">
              <Tag className="h-4 w-4" /> Tag Filter
            </h3>
          </div>
          <div className="flex">
            <Badge 
              className="bg-luxury-primary text-white flex items-center gap-1"
            >
              {selectedTag}
              <button 
                className="ml-1 hover:text-white/80"
                onClick={() => setSelectedTag(null)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          </div>
        </div>
      )}

      <SearchCategories 
        selectedSeeker={selectedSeeker}
        selectedLookingFor={selectedLookingFor}
        setSelectedSeeker={setSelectedSeeker}
        setSelectedLookingFor={setSelectedLookingFor}
        searchCategories={searchCategories}
      />

      <FilterAccordion 
        bodyTypes={bodyTypes}
        educationLevels={educationLevels}
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
      />
    </div>
  );
};
