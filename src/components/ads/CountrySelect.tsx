import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { type Database } from "@/integrations/supabase/types";

type NordicCountry = Database['public']['Enums']['nordic_country'];

interface CountrySelectProps {
  selectedCountry: NordicCountry | null;
  setSelectedCountry: (country: NordicCountry | null) => void;
  countries: NordicCountry[];
}

export const CountrySelect = ({
  selectedCountry,
  setSelectedCountry,
  countries,
}: CountrySelectProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {countries.map((country) => (
        <Button
          key={country}
          variant={selectedCountry === country ? "default" : "outline"}
          className={cn(
            "capitalize transition-all duration-300",
            selectedCountry === country
              ? "bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-white border-none"
              : "bg-[#2D2A34]/50 text-gray-300 hover:bg-[#3D3A44] border-none"
          )}
          onClick={() => setSelectedCountry(country === selectedCountry ? null : country)}
        >
          {country}
          {selectedCountry === country && <Check className="ml-2 h-4 w-4" />}
        </Button>
      ))}
    </div>
  );
};