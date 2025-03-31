
import { FilterAccordion } from "./FilterAccordion";
import { FilterOptions } from "../types/dating";
import { useState, useEffect } from "react";

interface VerificationFilterProps {
  filterOptions: FilterOptions;
  setFilterOptions: (options: FilterOptions) => void;
}

export const VerificationFilter = ({ 
  filterOptions, 
  setFilterOptions 
}: VerificationFilterProps) => {
  // Use local state for checkboxes
  const [isVerified, setIsVerified] = useState(!!filterOptions.isVerified);
  const [isPremium, setIsPremium] = useState(!!filterOptions.isPremium);
  
  // Update local state when props change
  useEffect(() => {
    setIsVerified(!!filterOptions.isVerified);
    setIsPremium(!!filterOptions.isPremium);
  }, [filterOptions.isVerified, filterOptions.isPremium]);

  // Toggle verified status
  const toggleVerified = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newValue = !isVerified;
    setIsVerified(newValue);
    setFilterOptions({
      ...filterOptions,
      isVerified: newValue
    });
  };

  // Toggle premium status
  const togglePremium = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newValue = !isPremium;
    setIsPremium(newValue);
    setFilterOptions({
      ...filterOptions,
      isPremium: newValue
    });
  };
  
  // Prevent form submission
  const preventFormSubmission = (e: React.FormEvent | React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };
  
  return (
    <FilterAccordion title="Verification" defaultOpen={true}>
      <form 
        onSubmit={preventFormSubmission} 
        onClick={preventFormSubmission}
        onMouseDown={preventFormSubmission}
        onTouchStart={preventFormSubmission}
        className="space-y-2 mt-2"
      >
        <div className="flex items-center">
          <input
            type="checkbox"
            id="verified-only"
            className="rounded h-4 w-4 bg-luxury-darker border-luxury-primary/20 text-luxury-primary"
            checked={isVerified}
            onChange={() => {}} // Empty handler since we're using custom handlers
            onClick={toggleVerified}
          />
          <label
            htmlFor="verified-only"
            className="ml-2 text-sm text-luxury-neutral cursor-pointer"
            onClick={toggleVerified}
          >
            Verified Profiles Only
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="premium-only"
            className="rounded h-4 w-4 bg-luxury-darker border-luxury-primary/20 text-luxury-primary"
            checked={isPremium}
            onChange={() => {}} // Empty handler since we're using custom handlers
            onClick={togglePremium}
          />
          <label
            htmlFor="premium-only"
            className="ml-2 text-sm text-luxury-neutral cursor-pointer"
            onClick={togglePremium}
          >
            Premium Profiles Only
          </label>
        </div>
      </form>
    </FilterAccordion>
  );
};
