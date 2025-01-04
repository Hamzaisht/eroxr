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
  selectedCountry,
  setSelectedCountry,
  selectedSeeker,
  selectedLookingFor,
  setSelectedSeeker,
  setSelectedLookingFor,
  searchCategories,
  countries,
}: AdFiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#2A2731] p-6 rounded-lg">
      <div className="space-y-4">
        <h3 className="text-[#1EAEDB] font-semibold">Couple seeking</h3>
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
              className="w-full justify-start"
              onClick={() => {
                setSelectedSeeker("couple");
                setSelectedLookingFor(category.looking_for);
              }}
            >
              Couple → {category.looking_for}
            </Button>
          ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-[#1EAEDB] font-semibold">Female seeking</h3>
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
              className="w-full justify-start"
              onClick={() => {
                setSelectedSeeker("female");
                setSelectedLookingFor(category.looking_for);
              }}
            >
              Female → {category.looking_for}
            </Button>
          ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-[#1EAEDB] font-semibold">Male seeking</h3>
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
              className="w-full justify-start"
              onClick={() => {
                setSelectedSeeker("male");
                setSelectedLookingFor(category.looking_for);
              }}
            >
              Male → {category.looking_for}
            </Button>
          ))}
      </div>
    </div>
  );
};