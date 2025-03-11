
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
    // Prevent default behavior
    if (values.length === 1) {
      setFilterOptions({
        ...filterOptions,
        maxDistance: values[0]
      });
    }
  };
  
  return (
    <FilterAccordion title="Maximum Distance" defaultOpen={true}>
      <div className="mt-2 px-1">
        <div className="flex justify-between text-sm text-luxury-neutral mb-2">
          <span>Distance</span>
          <span>{filterOptions.maxDistance} km</span>
        </div>
        <Slider
          defaultValue={[filterOptions.maxDistance || 50]}
          max={500}
          min={5}
          step={5}
          onValueChange={(values) => {
            // Explicitly prevent any default behavior
            handleDistanceChange(values);
          }}
        />
      </div>
    </FilterAccordion>
  );
};
