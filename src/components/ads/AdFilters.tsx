import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { type SearchCategory } from "./types";

interface AdFiltersProps {
  selectedCountry: string | null;
  setSelectedCountry: (country: string | null) => void;
  selectedSeeker: string | null;
  selectedLookingFor: string | null;
  setSelectedSeeker: (seeker: string | null) => void;
  setSelectedLookingFor: (lookingFor: string | null) => void;
  searchCategories: SearchCategory[];
  countries: string[];
}

export const AdFilters = ({
  selectedSeeker,
  selectedLookingFor,
  setSelectedSeeker,
  setSelectedLookingFor,
  searchCategories,
}: AdFiltersProps) => {
  return (
    <div className="bg-[#1A1F2C]/50 backdrop-blur-sm p-4 rounded-xl shadow-lg space-y-4">
      <div className="space-y-3">
        <h3 className="text-sm font-semibold bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] bg-clip-text text-transparent">
          Couple seeking
        </h3>
        <div className="space-y-1">
          {searchCategories
            .filter((cat) => cat.seeker === "couple")
            .map((category) => (
              <Button
                key={`couple-${category.looking_for}`}
                variant={
                  selectedSeeker === "couple" &&
                  selectedLookingFor === category.looking_for
                    ? "default"
                    : "outline"
                }
                size="sm"
                className={`w-full justify-start text-xs transition-all duration-300 ${
                  selectedSeeker === "couple" &&
                  selectedLookingFor === category.looking_for
                    ? "bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-white border-none"
                    : "bg-[#2D2A34]/50 text-gray-300 hover:bg-[#3D3A44] border-none"
                }`}
                onClick={() => {
                  setSelectedSeeker("couple");
                  setSelectedLookingFor(category.looking_for);
                }}
              >
                <Search className="w-3 h-3 mr-1" />
                Couple → {category.looking_for}
              </Button>
            ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] bg-clip-text text-transparent">
          Female seeking
        </h3>
        <div className="space-y-1">
          {searchCategories
            .filter((cat) => cat.seeker === "female")
            .map((category) => (
              <Button
                key={`female-${category.looking_for}`}
                variant={
                  selectedSeeker === "female" &&
                  selectedLookingFor === category.looking_for
                    ? "default"
                    : "outline"
                }
                size="sm"
                className={`w-full justify-start text-xs transition-all duration-300 ${
                  selectedSeeker === "female" &&
                  selectedLookingFor === category.looking_for
                    ? "bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-white border-none"
                    : "bg-[#2D2A34]/50 text-gray-300 hover:bg-[#3D3A44] border-none"
                }`}
                onClick={() => {
                  setSelectedSeeker("female");
                  setSelectedLookingFor(category.looking_for);
                }}
              >
                <Search className="w-3 h-3 mr-1" />
                Female → {category.looking_for}
              </Button>
            ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] bg-clip-text text-transparent">
          Male seeking
        </h3>
        <div className="space-y-1">
          {searchCategories
            .filter((cat) => cat.seeker === "male")
            .map((category) => (
              <Button
                key={`male-${category.looking_for}`}
                variant={
                  selectedSeeker === "male" &&
                  selectedLookingFor === category.looking_for
                    ? "default"
                    : "outline"
                }
                size="sm"
                className={`w-full justify-start text-xs transition-all duration-300 ${
                  selectedSeeker === "male" &&
                  selectedLookingFor === category.looking_for
                    ? "bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-white border-none"
                    : "bg-[#2D2A34]/50 text-gray-300 hover:bg-[#3D3A44] border-none"
                }`}
                onClick={() => {
                  setSelectedSeeker("male");
                  setSelectedLookingFor(category.looking_for);
                }}
              >
                <Search className="w-3 h-3 mr-1" />
                Male → {category.looking_for}
              </Button>
            ))}
        </div>
      </div>
    </div>
  );
};