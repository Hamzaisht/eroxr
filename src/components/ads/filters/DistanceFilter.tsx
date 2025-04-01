
import { Slider } from "@/components/ui/slider";
import { FilterAccordion } from "./FilterAccordion";
import { FilterOptions } from "../types/dating";
import { useState, useEffect } from "react";
import { usePreventFormSubmission } from "@/hooks/use-prevent-form-submission";

interface DistanceFilterProps {
  filterOptions: FilterOptions;
  setFilterOptions: (options: FilterOptions) => void;
}

export const DistanceFilter = ({ 
  filterOptions, 
  setFilterOptions 
}: DistanceFilterProps) => {
  // Use local state to prevent too many rerenders
  const [distance, setDistance] = useState<number>(filterOptions.maxDistance || 50);
  
  // Update local state when props change
  useEffect(() => {
    setDistance(filterOptions.maxDistance || 50);
  }, [filterOptions.maxDistance]);

  const handleDistanceChange = (values: number[]) => {
    if (values.length === 1) {
      setDistance(values[0]);
    }
  };
  
  // Only update parent state on commit to avoid too many rerenders
  const handleDistanceCommit = (values: number[]) => {
    if (values.length === 1) {
      setFilterOptions({
        ...filterOptions,
        maxDistance: values[0]
      });
    }
  };
  
  const { preventFormSubmission } = usePreventFormSubmission();
  
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
          <span>{distance} km</span>
        </div>
        <div>
          <Slider
            value={[distance]}
            max={500}
            min={5}
            step={5}
            onValueChange={handleDistanceChange}
            onValueCommit={handleDistanceCommit}
          />
        </div>
      </form>
    </FilterAccordion>
  );
};
