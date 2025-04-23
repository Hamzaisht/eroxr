
import { useState, useEffect } from 'react';
import countriesData from '@/data/countries.json';

export type LocationSearchResult = {
  countries: string[];
  cities: string[];
  selectedCountry: string | null;
  selectedCity: string | null;
};

export const useLocationSearch = (initialCountry: string | null = null, initialCity: string | null = null) => {
  const [countrySearch, setCountrySearch] = useState<string>(initialCountry || '');
  const [citySearch, setCitySearch] = useState<string>(initialCity || '');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(initialCountry);
  const [selectedCity, setSelectedCity] = useState<string | null>(initialCity);
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);

  // Get all countries from the data
  const allCountries = Object.keys(countriesData);

  // Normalize text for searching (handle umlauts and accents)
  const normalizeText = (text: string): string => {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  // Filter countries based on search term with improved accent handling
  useEffect(() => {
    if (countrySearch.trim()) {
      const normalizedSearch = normalizeText(countrySearch);
      const filtered = allCountries.filter(country => 
        normalizeText(country).includes(normalizedSearch)
      );
      setFilteredCountries(filtered);
    } else {
      setFilteredCountries(allCountries);
    }
  }, [countrySearch, allCountries]);

  // Filter cities based on selected country and search term with improved accent handling
  useEffect(() => {
    if (selectedCountry && citySearch.trim()) {
      const countryCities = countriesData[selectedCountry as keyof typeof countriesData] || [];
      const normalizedSearch = normalizeText(citySearch);
      const filtered = countryCities.filter(city => 
        normalizeText(city).includes(normalizedSearch)
      );
      setFilteredCities(filtered);
    } else if (selectedCountry) {
      const countryCities = countriesData[selectedCountry as keyof typeof countriesData] || [];
      setFilteredCities(countryCities);
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

  // Update local state when props change
  useEffect(() => {
    if (initialCountry !== selectedCountry && initialCountry !== null) {
      setSelectedCountry(initialCountry);
      setCountrySearch(initialCountry);
    }
    
    if (initialCity !== selectedCity && initialCity !== null) {
      setSelectedCity(initialCity);
      setCitySearch(initialCity);
    }
  }, [initialCountry, initialCity]);

  const handleSelectCountry = (country: string) => {
    setSelectedCountry(country);
    setCountrySearch(country);
  };

  const handleSelectCity = (city: string) => {
    setSelectedCity(city);
    setCitySearch(city);
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
