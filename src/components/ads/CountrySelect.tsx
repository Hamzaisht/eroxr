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
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <select
        className="pl-10 pr-4 py-2 bg-[#403E43] text-white border border-[#8A898C] rounded-md focus:ring-2 focus:ring-[#1EAEDB] focus:border-transparent"
        value={selectedCountry || ""}
        onChange={(e) => setSelectedCountry(e.target.value || null)}
      >
        <option value="">All Countries</option>
        {countries.map((country) => (
          <option key={country} value={country}>
            {country.charAt(0).toUpperCase() + country.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};