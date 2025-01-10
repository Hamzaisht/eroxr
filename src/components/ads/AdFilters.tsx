import { type SearchCategory, type FilterOptions } from "./types/dating";
import { SearchCategories } from "./filters/SearchCategories";
import { FilterAccordion } from "./filters/FilterAccordion";

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
}

export const AdFilters = ({
  selectedSeeker,
  selectedLookingFor,
  setSelectedSeeker,
  setSelectedLookingFor,
  searchCategories,
  filterOptions,
  setFilterOptions,
}: AdFiltersProps) => {
  const bodyTypes = ['athletic', 'average', 'slim', 'curvy', 'muscular', 'plus_size'];
  const educationLevels = ['high_school', 'college', 'bachelor', 'master', 'phd'];

  return (
    <div className="bg-[#1A1F2C]/50 backdrop-blur-sm p-4 rounded-xl shadow-lg space-y-4">
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