
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
    e.preventDefault();
    e.stopPropagation();
    setFilterOptions({
      ...filterOptions,
      isVerified: e.target.checked
    });
  };

  // Update premium filter
  const handlePremiumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setFilterOptions({
      ...filterOptions,
      isPremium: e.target.checked
    });
  };
  
  // Prevent form submission
  const preventFormSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };
  
  return (
    <FilterAccordion title="Verification" defaultOpen={true}>
      <form onSubmit={preventFormSubmission} className="space-y-2 mt-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="verified-only"
            className="rounded h-4 w-4 bg-luxury-darker border-luxury-primary/20 text-luxury-primary"
            checked={!!filterOptions.isVerified}
            onChange={handleVerifiedChange}
            onClick={(e) => e.stopPropagation()}
          />
          <label
            htmlFor="verified-only"
            className="ml-2 text-sm text-luxury-neutral"
            onClick={(e) => {
              e.preventDefault();
              setFilterOptions({
                ...filterOptions,
                isVerified: !filterOptions.isVerified
              });
            }}
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
            onClick={(e) => e.stopPropagation()}
          />
          <label
            htmlFor="premium-only"
            className="ml-2 text-sm text-luxury-neutral"
            onClick={(e) => {
              e.preventDefault();
              setFilterOptions({
                ...filterOptions,
                isPremium: !filterOptions.isPremium
              });
            }}
          >
            Premium Profiles Only
          </label>
        </div>
      </form>
    </FilterAccordion>
  );
};
