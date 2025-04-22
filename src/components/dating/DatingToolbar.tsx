
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileFilterToggle } from "@/components/dating/MobileFilterToggle";
import React from "react";
import { useNavigate } from "react-router-dom";

interface DatingToolbarProps {
  onBack: () => void;
  onResetFilters: () => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

export const DatingToolbar: React.FC<DatingToolbarProps> = ({
  onBack,
  onResetFilters,
  showFilters,
  setShowFilters,
}) => (
  <div className="mt-6 flex justify-between items-center">
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="text-luxury-neutral hover:text-luxury-primary"
        onClick={onBack}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      <h2 className="text-xl sm:text-2xl font-semibold text-white">Body Dating</h2>
    </div>

    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="sm"
        className="bg-luxury-dark/50 border-luxury-primary/20 text-luxury-primary hover:bg-luxury-primary/10"
        onClick={onResetFilters}
      >
        Reset Filters
      </Button>
      <MobileFilterToggle
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />
    </div>
  </div>
);
