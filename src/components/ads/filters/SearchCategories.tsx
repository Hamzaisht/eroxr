import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { type SearchCategory } from "../types/dating";

interface SearchCategoriesProps {
  selectedSeeker: string | null;
  selectedLookingFor: string | null;
  setSelectedSeeker: (seeker: string | null) => void;
  setSelectedLookingFor: (lookingFor: string | null) => void;
  searchCategories: SearchCategory[];
}

export const SearchCategories = ({
  selectedSeeker,
  selectedLookingFor,
  setSelectedSeeker,
  setSelectedLookingFor,
  searchCategories,
}: SearchCategoriesProps) => (
  <div className="space-y-3">
    <h3 className="text-sm font-semibold bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] bg-clip-text text-transparent">
      I am...
    </h3>
    <div className="space-y-1">
      {searchCategories.map((category) => (
        <Button
          key={`${category.seeker}-${category.looking_for}`}
          variant={
            selectedSeeker === category.seeker &&
            selectedLookingFor === category.looking_for
              ? "default"
              : "outline"
          }
          size="sm"
          className={`w-full justify-start text-xs transition-all duration-300 ${
            selectedSeeker === category.seeker &&
            selectedLookingFor === category.looking_for
              ? "bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-white border-none"
              : "bg-[#2D2A34]/50 text-gray-300 hover:bg-[#3D3A44] border-none"
          }`}
          onClick={() => {
            setSelectedSeeker(category.seeker);
            setSelectedLookingFor(category.looking_for);
          }}
        >
          <Search className="w-3 h-3 mr-1" />
          {category.seeker} → {category.looking_for}
        </Button>
      ))}
    </div>
  </div>
);