
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface MobileFilterToggleProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

export const MobileFilterToggle = ({ showFilters, setShowFilters }: MobileFilterToggleProps) => {
  return (
    <div className="lg:hidden mb-4">
      <Button
        variant="outline"
        onClick={() => setShowFilters(!showFilters)}
        className="w-full flex items-center justify-center gap-2"
        type="button"
      >
        <Filter className="h-4 w-4" />
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </Button>
    </div>
  );
};
