
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterOptions, SearchCategory } from '@/types/dating';

export function useSearchParamsFilter(
  setFilterOptions: (options: FilterOptions) => void,
  setSelectedCountry: (country: string | null) => void,
  setSelectedCity: (city: string | null) => void,
  setSelectedSeeker: (seeker: string | null) => void,
  setSelectedLookingFor: (lookingFor: string | null) => void,
  setSelectedTag: (tag: string | null) => void
) {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tag = searchParams.get('tag');
    const country = searchParams.get('country');
    const city = searchParams.get('city');
    const seeker = searchParams.get('seeker');
    const lookingFor = searchParams.get('lookingFor');
    const minAge = searchParams.get('minAge');
    const maxAge = searchParams.get('maxAge');
    const verified = searchParams.get('verified');
    const premium = searchParams.get('premium');
    const search = searchParams.get('search');

    // Update filters based on search params
    if (tag) setSelectedTag(tag);
    if (country) setSelectedCountry(country);
    if (city) setSelectedCity(city);
    if (seeker) setSelectedSeeker(seeker);
    if (lookingFor) setSelectedLookingFor(lookingFor);

    // Update search options
    const updatedFilterOptions: Partial<FilterOptions> = {};
    
    if (minAge) updatedFilterOptions.minAge = parseInt(minAge);
    if (maxAge) updatedFilterOptions.maxAge = parseInt(maxAge);
    if (verified) updatedFilterOptions.isVerified = verified === 'true';
    if (premium) updatedFilterOptions.isPremium = premium === 'true';
    if (search) updatedFilterOptions.keyword = search;

    if (Object.keys(updatedFilterOptions).length > 0) {
      setFilterOptions({
        minAge: updatedFilterOptions.minAge || 18,
        maxAge: updatedFilterOptions.maxAge || 80,
        minDistance: 0,
        maxDistance: 100,
        verifiedOnly: Boolean(updatedFilterOptions.isVerified),
        premiumOnly: Boolean(updatedFilterOptions.isPremium),
        keyword: updatedFilterOptions.keyword || '',
        username: '',
        isVerified: updatedFilterOptions.isVerified,
        isPremium: updatedFilterOptions.isPremium,
      });
    }
  }, [searchParams, setFilterOptions, setSelectedCountry, setSelectedCity, setSelectedSeeker, setSelectedLookingFor, setSelectedTag]);
}
