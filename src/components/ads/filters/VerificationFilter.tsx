
import { FilterAccordion } from "./FilterAccordion";
import { FilterOptions } from "../types/dating";

interface VerificationFilterProps {
  filterOptions: FilterOptions;
  setFilterOptions: (options: FilterOptions) => void;
}

export const VerificationFilter = ({ 
  filterOptions, 
  setFilterOptions 
}: VerificationFilterProps) => {
  // Update verification filter
  const handleVerifiedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterOptions({
      ...filterOptions,
      isVerified: e.target.checked
    });
  };

  // Update premium filter
  const handlePremiumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterOptions({
      ...filterOptions,
      isPremium: e.target.checked
    });
  };
  
  return (
    <FilterAccordion title="Verification" defaultOpen={true}>
      <div className="space-y-2 mt-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="verified-only"
            className="rounded h-4 w-4 bg-luxury-darker border-luxury-primary/20 text-luxury-primary"
            checked={!!filterOptions.isVerified}
            onChange={handleVerifiedChange}
          />
          <label
            htmlFor="verified-only"
            className="ml-2 text-sm text-luxury-neutral"
          >
            Verified Profiles Only
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="premium-only"
            className="rounded h-4 w-4 bg-luxury-darker border-luxury-primary/20 text-luxury-primary"
            checked={!!filterOptions.isPremium}
            onChange={handlePremiumChange}
          />
          <label
            htmlFor="premium-only"
            className="ml-2 text-sm text-luxury-neutral"
          >
            Premium Profiles Only
          </label>
        </div>
      </div>
    </FilterAccordion>
  );
};
