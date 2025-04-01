
import { useState, useEffect, useRef } from 'react';
import { type Database } from "@/integrations/supabase/types";
import { useLocationSearch } from './hooks/useLocationSearch';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';
import { usePreventFormSubmission } from '@/hooks/use-prevent-form-submission';

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

  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  
  const countryInputRef = useRef<HTMLInputElement>(null);
  const cityInputRef = useRef<HTMLInputElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const { preventFormSubmission } = usePreventFormSubmission();

  // Handle clicks outside the dropdowns to close them
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Handle country dropdown
      if (countryDropdownRef.current && 
          countryInputRef.current && 
          !countryDropdownRef.current.contains(event.target as Node) &&
          !countryInputRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
      }
      
      // Handle city dropdown
      if (cityDropdownRef.current && 
          cityInputRef.current && 
          !cityDropdownRef.current.contains(event.target as Node) &&
          !cityInputRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update the parent component's state when a selection is made
  const onSelectCountry = (e: React.MouseEvent, country: string) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event propagation
    handleSelectCountry(country as NordicCountry);
    setSelectedCountry(country as NordicCountry);
    setShowCountryDropdown(false);
  };

  const onSelectCity = (e: React.MouseEvent, city: string) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event propagation
    handleSelectCity(city);
    setSelectedCity(city);
    setShowCityDropdown(false);
  };

  const handleCountryFocus = () => {
    setShowCountryDropdown(true);
  };

  const handleCityFocus = () => {
    setShowCityDropdown(true);
  };

  return (
    <form 
      className="space-y-3" 
      onSubmit={preventFormSubmission}
      onClick={preventFormSubmission}
      onMouseDown={preventFormSubmission}
      onTouchStart={preventFormSubmission}
    >
      {/* Country Search */}
      <div className="relative">
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="h-4 w-4 text-luxury-primary" />
          <span className="text-sm text-luxury-neutral">Country</span>
        </div>
        <Input
          ref={countryInputRef}
          type="text"
          value={countrySearch}
          onChange={(e) => {
            setCountrySearch(e.target.value);
            setShowCountryDropdown(true);
          }}
          onFocus={handleCountryFocus}
          placeholder="Search for a country..."
          className="bg-black/20 border-luxury-primary/20 focus:border-luxury-primary/50 pl-3 pr-3"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              return false;
            }
          }}
        />
        {filteredCountries.length > 0 && showCountryDropdown && (
          <div 
            ref={countryDropdownRef}
            className="absolute z-10 mt-1 w-full max-h-40 overflow-y-auto rounded-md bg-luxury-darker border border-luxury-primary/20 shadow-lg"
          >
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
            ref={cityInputRef}
            type="text"
            value={citySearch}
            onChange={(e) => {
              setCitySearch(e.target.value);
              setShowCityDropdown(true);
            }}
            onFocus={handleCityFocus}
            placeholder="Search for a city..."
            className="bg-black/20 border-luxury-primary/20 focus:border-luxury-primary/50 pl-3 pr-3"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                return false;
              }
            }}
          />
          {filteredCities.length > 0 && showCityDropdown && (
            <div 
              ref={cityDropdownRef}
              className="absolute z-10 mt-1 w-full max-h-40 overflow-y-auto rounded-md bg-luxury-darker border border-luxury-primary/20 shadow-lg"
            >
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
    </form>
  );
};
