
import { useState, useEffect } from 'react';
import { type Database } from "@/integrations/supabase/types";
import { useLocationSearch } from './hooks/useLocationSearch';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';

type NordicCountry = Database['public']['Enums']['nordic_country'];

interface LocationSearchProps {
  selectedCountry: NordicCountry | null;
  setSelectedCountry: (country: NordicCountry | null) => void;
  selectedCity: string | null;
  setSelectedCity: (city: string | null) => void;
  filterByDistance?: boolean;
}

export const LocationSearch = ({
  selectedCountry,
  setSelectedCountry,
  selectedCity,
  setSelectedCity,
  filterByDistance = false
}: LocationSearchProps) => {
  const {
    countrySearch,
    setCountrySearch,
    citySearch,
    setCitySearch,
    filteredCountries,
    filteredCities,
    handleSelectCountry,
    handleSelectCity
  } = useLocationSearch(selectedCountry, selectedCity);

  // Sync the external state with our internal state
  useEffect(() => {
    if (selectedCountry) {
      setCountrySearch(selectedCountry);
    }
    
    if (selectedCity) {
      setCitySearch(selectedCity);
    }
  }, [selectedCountry, selectedCity]);

  // Update the parent component's state when a selection is made
  const onSelectCountry = (e: React.MouseEvent, country: string) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event propagation
    handleSelectCountry(country as NordicCountry);
    setSelectedCountry(country as NordicCountry);
  };

  const onSelectCity = (e: React.MouseEvent, city: string) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event propagation
    handleSelectCity(city);
    setSelectedCity(city);
  };

  return (
    <div className="space-y-3">
      {/* Country Search */}
      <div className="relative">
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="h-4 w-4 text-luxury-primary" />
          <span className="text-sm text-luxury-neutral">Country</span>
        </div>
        <Input
          value={countrySearch}
          onChange={(e) => {
            e.preventDefault(); // Prevent any form submission
            setCountrySearch(e.target.value);
          }}
          placeholder="Search for a country..."
          className="bg-black/20 border-luxury-primary/20 focus:border-luxury-primary/50 pl-3 pr-3"
        />
        {filteredCountries.length > 0 && (
          <div className="absolute z-10 mt-1 w-full max-h-40 overflow-y-auto rounded-md bg-luxury-darker border border-luxury-primary/20 shadow-lg">
            {filteredCountries.map((country) => (
              <div
                key={country}
                onClick={(e) => onSelectCountry(e, country)}
                className="px-4 py-2 cursor-pointer hover:bg-luxury-dark hover:text-white transition-colors text-sm"
              >
                {country}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* City Search - Only show if country is selected */}
      {selectedCountry && (
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-4 w-4 text-luxury-primary" />
            <span className="text-sm text-luxury-neutral">City</span>
          </div>
          <Input
            value={citySearch}
            onChange={(e) => {
              e.preventDefault(); // Prevent any form submission
              setCitySearch(e.target.value);
            }}
            placeholder="Search for a city..."
            className="bg-black/20 border-luxury-primary/20 focus:border-luxury-primary/50 pl-3 pr-3"
          />
          {filteredCities.length > 0 && (
            <div className="absolute z-10 mt-1 w-full max-h-40 overflow-y-auto rounded-md bg-luxury-darker border border-luxury-primary/20 shadow-lg">
              {filteredCities.map((city) => (
                <div
                  key={city}
                  onClick={(e) => onSelectCity(e, city)}
                  className="px-4 py-2 cursor-pointer hover:bg-luxury-dark hover:text-white transition-colors text-sm"
                >
                  {city}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
