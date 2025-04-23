
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
    handleSelectCity,
    allCountries
  } = useLocationSearch(selectedCountry, selectedCity);

  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  
  const countryInputRef = useRef<HTMLInputElement>(null);
  const cityInputRef = useRef<HTMLInputElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const { preventFormSubmission, handleKeyDown } = usePreventFormSubmission();

  // Handle clicks outside the dropdowns to close them
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && 
          countryInputRef.current && 
          !countryDropdownRef.current.contains(event.target as Node) &&
          !countryInputRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
      }
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

  // Always show countries when user focuses or types in the field
  useEffect(() => {
    if (countrySearch.length > 0) {
      setShowCountryDropdown(true);
    }
  }, [countrySearch]);

  // Update parent's state when selection is made
  const onSelectCountry = (e: React.MouseEvent, country: string) => {
    e.preventDefault();
    e.stopPropagation();
    handleSelectCountry(country as NordicCountry);
    setSelectedCountry(country as NordicCountry);
    setShowCountryDropdown(false);
  };

  const onSelectCity = (e: React.MouseEvent, city: string) => {
    e.preventDefault();
    e.stopPropagation();
    handleSelectCity(city);
    setSelectedCity(city);
    setShowCityDropdown(false);
  };

  const handleCountryFocus = () => {
    setShowCountryDropdown(true);
    // When user focuses, show all countries if no search term yet
    if (!countrySearch && allCountries.length > 0) {
      setShowCountryDropdown(true);
    }
  };

  const handleCityFocus = () => {
    setShowCityDropdown(true);
  };

  return (
    <form 
      className="space-y-3" 
      onSubmit={preventFormSubmission}
      onClick={preventFormSubmission}
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
          autoComplete="off"
          spellCheck={false}
          onChange={(e) => {
            setCountrySearch(e.target.value);
            setShowCountryDropdown(true);
          }}
          onFocus={handleCountryFocus}
          onKeyDown={handleKeyDown}
          placeholder="Type & search for a country…"
          className="bg-black/20 border-luxury-primary/20 focus:border-luxury-primary/50 pl-3 pr-3 placeholder:text-white/30"
        />
        {/* Always show dropdown when focused or has search content */}
        {showCountryDropdown && (
          <div 
            ref={countryDropdownRef}
            className="absolute z-10 mt-1 w-full max-h-40 overflow-y-auto rounded-md bg-luxury-darker border border-luxury-primary/20 shadow-lg"
          >
            {countrySearch.length === 0 ? (
              // Show all countries when no search term
              allCountries.map((country) => (
                <div
                  key={country}
                  onClick={(e) => onSelectCountry(e, country)}
                  className="px-4 py-2 cursor-pointer hover:bg-luxury-dark hover:text-white transition-colors text-sm"
                >
                  {country}
                </div>
              ))
            ) : filteredCountries.length > 0 ? (
              // Show filtered results when searching
              filteredCountries.map((country) => (
                <div
                  key={country}
                  onClick={(e) => onSelectCountry(e, country)}
                  className="px-4 py-2 cursor-pointer hover:bg-luxury-dark hover:text-white transition-colors text-sm"
                >
                  {country}
                </div>
              ))
            ) : (
              // No matches found
              <div className="px-4 py-2 text-sm text-white/50">No matches found</div>
            )}
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
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => {
              setCitySearch(e.target.value);
              setShowCityDropdown(true);
            }}
            onFocus={handleCityFocus}
            onKeyDown={handleKeyDown}
            placeholder="Type & search for a city…"
            className="bg-black/20 border-luxury-primary/20 focus:border-luxury-primary/50 pl-3 pr-3 placeholder:text-white/30"
          />
          {showCityDropdown && (
            <div 
              ref={cityDropdownRef}
              className="absolute z-10 mt-1 w-full max-h-40 overflow-y-auto rounded-md bg-luxury-darker border border-luxury-primary/20 shadow-lg"
            >
              {filteredCities.length > 0 ? (
                filteredCities.map((city) => (
                  <div
                    key={city}
                    onClick={(e) => onSelectCity(e, city)}
                    className="px-4 py-2 cursor-pointer hover:bg-luxury-dark hover:text-white transition-colors text-sm"
                  >
                    {city}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-white/50">No matches found</div>
              )}
            </div>
          )}
        </div>
      )}
    </form>
  );
};
