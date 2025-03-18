
import { Slider } from "@/components/ui/slider";
import { FilterAccordion } from "./FilterAccordion";
import { FilterOptions } from "../types/dating";

interface DistanceFilterProps {
  filterOptions: FilterOptions;
  setFilterOptions: (options: FilterOptions) => void;
}

export const DistanceFilter = ({ 
  filterOptions, 
  setFilterOptions 
}: DistanceFilterProps) => {
  const handleDistanceChange = (values: number[]) => {
    if (values.length === 1) {
      setFilterOptions({
        ...filterOptions,
        maxDistance: values[0]
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
    <FilterAccordion title="Maximum Distance" defaultOpen={true}>
      <form 
        onSubmit={preventFormSubmission} 
        onClick={preventFormSubmission}
        onMouseDown={preventFormSubmission}
        onTouchStart={preventFormSubmission}
        className="mt-2 px-1"
      >
        <div className="flex justify-between text-sm text-luxury-neutral mb-2">
          <span>Distance</span>
          <span>{filterOptions.maxDistance} km</span>
        </div>
        <div 
          onMouseDown={preventFormSubmission}
          onTouchStart={preventFormSubmission}
          onClick={preventFormSubmission}
        >
          <Slider
            defaultValue={[filterOptions.maxDistance || 50]}
            max={500}
            min={5}
            step={5}
            onValueChange={handleDistanceChange}
            onValueCommit={(value) => {
              handleDistanceChange(value);
            }}
          />
        </div>
      </form>
    </FilterAccordion>
  );
};
