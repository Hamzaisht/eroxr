
import { Slider } from "@/components/ui/slider";
import { FilterAccordion } from "./FilterAccordion";
import { FilterOptions } from "../types/dating";
import { useState, useEffect } from "react";

interface AgeRangeFilterProps {
  filterOptions: FilterOptions;
  setFilterOptions: (options: FilterOptions) => void;
}

export const AgeRangeFilter = ({ 
  filterOptions, 
  setFilterOptions 
}: AgeRangeFilterProps) => {
  // Use local state to manage slider values
  const [ageRange, setAgeRange] = useState<[number, number]>([
    filterOptions.minAge || 18, 
    filterOptions.maxAge || 99
  ]);
  
  // Update local state when props change
  useEffect(() => {
    setAgeRange([
      filterOptions.minAge || 18,
      filterOptions.maxAge || 99
    ]);
  }, [filterOptions.minAge, filterOptions.maxAge]);

  const handleAgeChange = (values: number[]) => {
    if (values.length === 2) {
      setAgeRange([values[0], values[1]]);
    }
  };
  
  // Only update parent state on commit to avoid too many rerenders
  const handleAgeCommit = (values: number[]) => {
    if (values.length === 2) {
      setFilterOptions({
        ...filterOptions,
        minAge: values[0],
        maxAge: values[1]
      });
    }
  };
  
  // Comprehensive event prevention
  const preventFormSubmission = (e: React.MouseEvent | React.TouchEvent | React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };
  
  return (
    <FilterAccordion title="Age Range" defaultOpen={true}>
      <form 
        onSubmit={preventFormSubmission}
        onClick={preventFormSubmission}
        onMouseDown={preventFormSubmission}
        onTouchStart={preventFormSubmission}
        className="mt-2 px-1"
      >
        <div className="flex justify-between text-sm text-luxury-neutral mb-2">
          <span>{ageRange[0]} years</span>
          <span>{ageRange[1]} years</span>
        </div>
        <div 
          onMouseDown={preventFormSubmission}
          onTouchStart={preventFormSubmission}
          onClick={preventFormSubmission}
        >
          <Slider
            value={ageRange}
            max={99}
            min={18}
            step={1}
            onValueChange={handleAgeChange}
            onValueCommit={handleAgeCommit}
          />
        </div>
      </form>
    </FilterAccordion>
  );
};
