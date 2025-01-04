import { Search } from "lucide-react";

interface CountrySelectProps {
  selectedCountry: string | null;
  setSelectedCountry: (country: string | null) => void;
  countries: string[];
}

export const CountrySelect = ({
  selectedCountry,
  setSelectedCountry,
  countries,
}: CountrySelectProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#9b87f5] h-3 w-3" />
      <select
        className="pl-7 pr-3 py-1.5 bg-[#2D2A34]/50 text-white border-none rounded-lg focus:ring-2 focus:ring-[#9b87f5] focus:outline-none transition-all duration-300 text-sm"
        value={selectedCountry || ""}
        onChange={(e) => setSelectedCountry(e.target.value || null)}
      >
        <option value="">All Countries</option>
        {countries.map((country) => (
          <option key={country} value={country} className="capitalize">
            {country.charAt(0).toUpperCase() + country.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};