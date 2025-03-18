
import { Slider } from "@/components/ui/slider";
import { FilterAccordion } from "./FilterAccordion";
import { FilterOptions } from "../types/dating";

interface AgeRangeFilterProps {
  filterOptions: FilterOptions;
  setFilterOptions: (options: FilterOptions) => void;
}

export const AgeRangeFilter = ({ 
  filterOptions, 
  setFilterOptions 
}: AgeRangeFilterProps) => {
  const handleAgeChange = (values: number[]) => {
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
          <span>{filterOptions.minAge} years</span>
          <span>{filterOptions.maxAge} years</span>
        </div>
        <div 
          onMouseDown={preventFormSubmission}
          onTouchStart={preventFormSubmission}
          onClick={preventFormSubmission}
        >
          <Slider
            defaultValue={[filterOptions.minAge || 18, filterOptions.maxAge || 99]}
            max={99}
            min={18}
            step={1}
            onValueChange={handleAgeChange}
            onValueCommit={(value) => {
              handleAgeChange(value);
            }}
          />
        </div>
      </form>
    </FilterAccordion>
  );
};
