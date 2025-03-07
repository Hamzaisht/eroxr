
import { useState, useEffect } from 'react';
import countriesData from '@/data/countries.json';

export type LocationSearchResult = {
  countries: string[];
  cities: string[];
  selectedCountry: string | null;
  selectedCity: string | null;
};

export const useLocationSearch = (initialCountry: string | null = null, initialCity: string | null = null) => {
  const [countrySearch, setCountrySearch] = useState<string>('');
  const [citySearch, setCitySearch] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(initialCountry);
  const [selectedCity, setSelectedCity] = useState<string | null>(initialCity);
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);

  // Get all countries from the data
  const allCountries = Object.keys(countriesData);

  // Filter countries based on search term
  useEffect(() => {
    if (countrySearch.trim()) {
      const filtered = allCountries.filter(country => 
        country.toLowerCase().includes(countrySearch.toLowerCase())
      );
      setFilteredCountries(filtered);
    } else {
      setFilteredCountries([]);
    }
  }, [countrySearch]);

  // Filter cities based on selected country and search term
  useEffect(() => {
    if (selectedCountry && citySearch.trim()) {
      const countryCities = countriesData[selectedCountry as keyof typeof countriesData] || [];
      const filtered = countryCities.filter(city => 
        city.toLowerCase().includes(citySearch.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
  }, [selectedCountry, citySearch]);

  // Reset city when country changes
  useEffect(() => {
    if (selectedCountry !== initialCountry) {
      setSelectedCity(null);
      setCitySearch('');
    }
  }, [selectedCountry, initialCountry]);

  const handleSelectCountry = (country: string) => {
    setSelectedCountry(country);
    setCountrySearch(country);
    setFilteredCountries([]);
  };

  const handleSelectCity = (city: string) => {
    setSelectedCity(city);
    setCitySearch(city);
    setFilteredCities([]);
  };

  return {
    countrySearch,
    setCountrySearch,
    citySearch,
    setCitySearch,
    selectedCountry,
    selectedCity,
    filteredCountries,
    filteredCities,
    handleSelectCountry,
    handleSelectCity,
    allCountries
  };
};
