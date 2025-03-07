
import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { MapPin, ChevronDown, X } from 'lucide-react';
import { useLocationSearch } from './hooks/useLocationSearch';
import { Button } from '@/components/ui/button';
import { type Database } from "@/integrations/supabase/types";

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
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const countryInputRef = useRef<HTMLInputElement>(null);
  const cityInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    countrySearch,
    setCountrySearch,
    citySearch,
    setCitySearch,
    filteredCountries,
    filteredCities,
    handleSelectCountry,
    handleSelectCity,
    allCountries
  } = useLocationSearch(selectedCountry, selectedCity);

  // Handle outside clicks to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
        setIsCityDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update parent component when selection changes
  useEffect(() => {
    if (selectedCountry !== countrySearch) {
      setSelectedCountry(countrySearch as NordicCountry);
    }
  }, [countrySearch, selectedCountry, setSelectedCountry]);

  useEffect(() => {
    if (selectedCity !== citySearch) {
      setSelectedCity(citySearch);
    }
  }, [citySearch, selectedCity, setSelectedCity]);

  const handleClearCountry = () => {
    setCountrySearch('');
    setSelectedCountry(null);
    setCitySearch('');
    setSelectedCity(null);
    if (countryInputRef.current) {
      countryInputRef.current.focus();
    }
  };

  const handleClearCity = () => {
    setCitySearch('');
    setSelectedCity(null);
    if (cityInputRef.current) {
      cityInputRef.current.focus();
    }
  };

  return (
    <div className="space-y-4" ref={dropdownRef}>
      <div className="relative">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-luxury-neutral/60" />
          <Input
            ref={countryInputRef}
            value={countrySearch}
            onChange={(e) => {
              setCountrySearch(e.target.value);
              setIsCountryDropdownOpen(true);
            }}
            onFocus={() => setIsCountryDropdownOpen(true)}
            placeholder="Search for a country..."
            className="pl-10 pr-10 bg-black/20 border-luxury-primary/20 focus:border-luxury-primary/50 text-luxury-neutral"
          />
          {countrySearch ? (
            <button 
              onClick={handleClearCountry}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-luxury-neutral/60 hover:text-luxury-neutral"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <ChevronDown 
              className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-luxury-neutral/60"
              onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
            />
          )}
        </div>

        {isCountryDropdownOpen && (filteredCountries.length > 0 || allCountries.length > 0) && (
          <div className="absolute z-50 mt-1 w-full bg-background/95 backdrop-blur-md border border-luxury-primary/20 rounded-md shadow-lg max-h-60 overflow-auto">
            {(filteredCountries.length > 0 ? filteredCountries : allCountries).map(country => (
              <div
                key={country}
                className="px-4 py-2 hover:bg-luxury-dark/50 cursor-pointer text-luxury-neutral"
                onClick={() => {
                  handleSelectCountry(country);
                  setIsCountryDropdownOpen(false);
                  // Focus the city input after selecting country
                  setTimeout(() => {
                    if (cityInputRef.current) cityInputRef.current.focus();
                  }, 100);
                }}
              >
                {country}
              </div>
            ))}
          </div>
        )}
      </div>

      {countrySearch && (
        <div className="relative">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-luxury-neutral/60" />
            <Input
              ref={cityInputRef}
              value={citySearch}
              onChange={(e) => {
                setCitySearch(e.target.value);
                setIsCityDropdownOpen(true);
              }}
              onFocus={() => setIsCityDropdownOpen(true)}
              placeholder="Search for a city..."
              className="pl-10 pr-10 bg-black/20 border-luxury-primary/20 focus:border-luxury-primary/50 text-luxury-neutral"
            />
            {citySearch ? (
              <button 
                onClick={handleClearCity}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-luxury-neutral/60 hover:text-luxury-neutral"
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              <ChevronDown 
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-luxury-neutral/60"
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
              />
            )}
          </div>

          {isCityDropdownOpen && filteredCities.length > 0 && (
            <div className="absolute z-50 mt-1 w-full bg-background/95 backdrop-blur-md border border-luxury-primary/20 rounded-md shadow-lg max-h-60 overflow-auto">
              {filteredCities.map(city => (
                <div
                  key={city}
                  className="px-4 py-2 hover:bg-luxury-dark/50 cursor-pointer text-luxury-neutral"
                  onClick={() => {
                    handleSelectCity(city);
                    setIsCityDropdownOpen(false);
                  }}
                >
                  {city}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedCountry && selectedCity && (
        <div className="flex items-center mt-2 text-sm text-luxury-primary">
          <MapPin className="h-3 w-3 mr-1" />
          <span>
            {selectedCity}, {selectedCountry}
          </span>
        </div>
      )}
    </div>
  );
};
