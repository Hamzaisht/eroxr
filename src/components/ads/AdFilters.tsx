
import { useState, useEffect } from "react";
import { type SearchCategory, type FilterOptions } from "./types/dating";
import { SearchCategories } from "./filters/SearchCategories";
import { FilterAccordion } from "./filters/FilterAccordion";
import { X, Tag, Search, Users, CheckCircle, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; 
import { Label } from "@/components/ui/label";

interface AdFiltersProps {
  selectedCountry: string | null;
  setSelectedCountry: (country: string | null) => void;
  selectedSeeker: string | null;
  selectedLookingFor: string | null;
  setSelectedSeeker: (seeker: string | null) => void;
  setSelectedLookingFor: (lookingFor: string | null) => void;
  searchCategories: SearchCategory[];
  countries: string[];
  filterOptions: FilterOptions;
  setFilterOptions: (options: FilterOptions) => void;
  selectedTag?: string | null;
  setSelectedTag?: (tag: string | null) => void;
}

export const AdFilters = ({
  selectedSeeker,
  selectedLookingFor,
  setSelectedSeeker,
  setSelectedLookingFor,
  searchCategories,
  filterOptions,
  setFilterOptions,
  selectedTag,
  setSelectedTag,
}: AdFiltersProps) => {
  const [usernameSearch, setUsernameSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [premiumOnly, setPremiumOnly] = useState(false);
  const bodyTypes = ['athletic', 'average', 'slim', 'curvy', 'muscular', 'plus_size'];
  const educationLevels = ['high_school', 'college', 'bachelor', 'master', 'phd'];

  // Handle verified filter change
  useEffect(() => {
    if (selectedSeeker === 'verified') {
      setVerifiedOnly(true);
    } else if (verifiedOnly) {
      setSelectedSeeker('verified');
      setSelectedLookingFor('any');
    }
  }, [selectedSeeker, verifiedOnly, setSelectedSeeker, setSelectedLookingFor]);

  // Handle premium filter change
  useEffect(() => {
    if (selectedSeeker === 'premium') {
      setPremiumOnly(true);
    } else if (premiumOnly) {
      setSelectedSeeker('premium');
      setSelectedLookingFor('any');
    }
  }, [selectedSeeker, premiumOnly, setSelectedSeeker, setSelectedLookingFor]);

  return (
    <div className="bg-[#1A1F2C]/50 backdrop-blur-sm p-4 rounded-xl shadow-lg space-y-4">
      {/* Username Search */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-luxury-neutral/80 flex items-center gap-1">
          <Users className="h-4 w-4" /> Find by Username
        </h3>
        <div className="relative">
          <Input
            type="text"
            placeholder="Username search..."
            value={usernameSearch}
            onChange={(e) => setUsernameSearch(e.target.value)}
            className="pl-8 bg-luxury-darker/50 border-luxury-primary/20 text-luxury-neutral"
          />
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-luxury-neutral/50" />
          {usernameSearch && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 text-luxury-neutral/50 hover:text-luxury-neutral"
              onClick={() => setUsernameSearch("")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Location Search */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-luxury-neutral/80 flex items-center gap-1">
          <Tag className="h-4 w-4" /> Location
        </h3>
        <div className="relative">
          <Input
            type="text"
            placeholder="City or country..."
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
            className="pl-8 bg-luxury-darker/50 border-luxury-primary/20 text-luxury-neutral"
          />
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-luxury-neutral/50" />
          {locationSearch && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 text-luxury-neutral/50 hover:text-luxury-neutral"
              onClick={() => setLocationSearch("")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Tag Filter Display */}
      {selectedTag && setSelectedTag && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-luxury-neutral/80 flex items-center gap-1">
              <Tag className="h-4 w-4" /> Tag Filter
            </h3>
          </div>
          <div className="flex">
            <Badge 
              className="bg-luxury-primary text-white flex items-center gap-1"
            >
              {selectedTag}
              <button 
                className="ml-1 hover:text-white/80"
                onClick={() => setSelectedTag(null)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          </div>
        </div>
      )}

      {/* Verification & Premium Filters */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-luxury-neutral/80">User Type Filters</h3>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="verified-only" 
            checked={verifiedOnly} 
            onCheckedChange={(checked) => {
              setVerifiedOnly(checked === true);
              if (checked) {
                setSelectedSeeker('verified');
                setSelectedLookingFor('any');
              } else if (selectedSeeker === 'verified') {
                setSelectedSeeker(null);
                setSelectedLookingFor(null);
              }
            }}
          />
          <Label 
            htmlFor="verified-only" 
            className="text-sm text-luxury-neutral flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle className="h-4 w-4 text-green-500" />
            Verified Profiles Only
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="premium-only" 
            checked={premiumOnly} 
            onCheckedChange={(checked) => {
              setPremiumOnly(checked === true);
              if (checked) {
                setSelectedSeeker('premium');
                setSelectedLookingFor('any');
              } else if (selectedSeeker === 'premium') {
                setSelectedSeeker(null);
                setSelectedLookingFor(null);
              }
            }}
          />
          <Label 
            htmlFor="premium-only" 
            className="text-sm text-luxury-neutral flex items-center gap-1.5 cursor-pointer"
          >
            <Crown className="h-4 w-4 text-yellow-500" />
            Premium Profiles Only
          </Label>
        </div>
      </div>

      <SearchCategories 
        selectedSeeker={selectedSeeker}
        selectedLookingFor={selectedLookingFor}
        setSelectedSeeker={setSelectedSeeker}
        setSelectedLookingFor={setSelectedLookingFor}
        searchCategories={searchCategories}
      />

      <FilterAccordion 
        bodyTypes={bodyTypes}
        educationLevels={educationLevels}
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
      />
    </div>
  );
};
