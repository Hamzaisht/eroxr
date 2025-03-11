
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
  
  // Prevent form submission on mouse/touch interactions with the slider
  const preventFormSubmission = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false; // Ensure the event doesn't bubble up
  };
  
  return (
    <FilterAccordion title="Maximum Distance" defaultOpen={true}>
      <div className="mt-2 px-1" onMouseDown={preventFormSubmission} onTouchStart={preventFormSubmission}>
        <div className="flex justify-between text-sm text-luxury-neutral mb-2">
          <span>Distance</span>
          <span>{filterOptions.maxDistance} km</span>
        </div>
        <div 
          onMouseDown={preventFormSubmission}
          onTouchStart={preventFormSubmission}
        >
          <Slider
            defaultValue={[filterOptions.maxDistance || 50]}
            max={500}
            min={5}
            step={5}
            onValueChange={handleDistanceChange}
            onValueCommit={(value) => {
              // Final value confirmation on release
              handleDistanceChange(value);
            }}
          />
        </div>
      </div>
    </FilterAccordion>
  );
};
