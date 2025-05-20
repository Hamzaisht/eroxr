
import React from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";

interface DatingFiltersPanelProps {
  isFilterCollapsed: boolean;
  setIsFilterCollapsed: (collapsed: boolean) => void;
  showFilters: boolean;
  selectedCountry: "denmark" | "finland" | "iceland" | "norway" | "sweden";
  setSelectedCountry: (country: "denmark" | "finland" | "iceland" | "norway" | "sweden") => void;
  selectedGender: string | null;
  setSelectedGender: (gender: string | null) => void;
  selectedLookingFor: string[] | null;
  setSelectedLookingFor: (lookingFor: string[] | null) => void;
  minAge: number;
  setMinAge: (age: number) => void;
  maxAge: number;
  setMaxAge: (age: number) => void;
  distanceRange: [number, number];
  setDistanceRange: (range: [number, number]) => void;
  selectedVerified: boolean;
  setSelectedVerified: (verified: boolean) => void;
  selectedPremium: boolean;
  setSelectedPremium: (premium: boolean) => void;
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  selectedCity?: string;
  setSelectedCity?: (city: string) => void;
  isFilterApplied?: boolean;
  handleApplyFilters?: () => void;
  handleResetFilters?: () => void;
}

export function DatingFiltersPanel({
  isFilterCollapsed,
  setIsFilterCollapsed,
  showFilters,
  selectedCountry,
  setSelectedCountry,
  selectedGender,
  setSelectedGender,
  selectedLookingFor,
  setSelectedLookingFor,
  minAge,
  setMinAge,
  maxAge,
  setMaxAge,
  distanceRange,
  setDistanceRange,
  selectedVerified,
  setSelectedVerified,
  selectedPremium,
  setSelectedPremium,
  selectedTag,
  setSelectedTag,
  selectedCity,
  setSelectedCity,
  isFilterApplied,
  handleApplyFilters,
  handleResetFilters,
}: DatingFiltersPanelProps) {
  // Common tags that might be used for filtering
  const popularTags = [
    "casual", "serious", "friendship", "adventure", "travel", 
    "fitness", "foodie", "outdoors", "gaming", "creative"
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-luxury-neutral">Filters</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsFilterCollapsed(!isFilterCollapsed)}
          className="h-8 px-2"
        >
          {isFilterCollapsed ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </Button>
      </div>

      {!isFilterCollapsed && showFilters && (
        <div className="space-y-6">
          {/* Country Filter */}
          <div className="space-y-2">
            <Label>Country</Label>
            <Select 
              value={selectedCountry} 
              onValueChange={(value: "denmark" | "finland" | "iceland" | "norway" | "sweden") => setSelectedCountry(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="denmark">Denmark</SelectItem>
                <SelectItem value="finland">Finland</SelectItem>
                <SelectItem value="iceland">Iceland</SelectItem>
                <SelectItem value="norway">Norway</SelectItem>
                <SelectItem value="sweden">Sweden</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Gender/Seeker Filter */}
          <div className="space-y-2">
            <Label>I am</Label>
            <div className="flex flex-wrap gap-2">
              {["male", "female", "couple"].map((gender) => (
                <Button
                  key={gender}
                  variant={selectedGender === gender ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedGender(selectedGender === gender ? null : gender)}
                  className="capitalize"
                >
                  {gender}
                </Button>
              ))}
            </div>
          </div>

          {/* Looking For Filter */}
          <div className="space-y-2">
            <Label>Looking for</Label>
            <div className="flex flex-wrap gap-2">
              {["male", "female", "couple", "any"].map((lookingFor) => (
                <Button
                  key={lookingFor}
                  variant={selectedLookingFor?.includes(lookingFor) ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (selectedLookingFor?.includes(lookingFor)) {
                      setSelectedLookingFor(
                        selectedLookingFor.filter(item => item !== lookingFor)
                      );
                    } else {
                      setSelectedLookingFor(
                        selectedLookingFor ? [...selectedLookingFor, lookingFor] : [lookingFor]
                      );
                    }
                  }}
                  className="capitalize"
                >
                  {lookingFor}
                </Button>
              ))}
            </div>
          </div>

          {/* Age Range Filter */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <Label>Age range</Label>
              <span className="text-sm text-luxury-neutral">
                {minAge} - {maxAge} years
              </span>
            </div>
            <Slider 
              defaultValue={[minAge, maxAge]} 
              min={18} 
              max={99} 
              step={1}
              onValueChange={(value) => {
                if (Array.isArray(value) && value.length === 2) {
                  setMinAge(value[0]);
                  setMaxAge(value[1]);
                }
              }}
              className="my-6"
            />
          </div>

          {/* Distance Range Filter */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <Label>Distance</Label>
              <span className="text-sm text-luxury-neutral">
                {distanceRange[0]} - {distanceRange[1]} km
              </span>
            </div>
            <Slider 
              defaultValue={distanceRange} 
              min={0} 
              max={200} 
              step={5}
              onValueChange={(value) => setDistanceRange([value[0], value[1]])}
              className="my-6"
            />
          </div>

          {/* Verification Filters */}
          <div className="space-y-4">
            <Label>Verification</Label>
            <div className="flex flex-col gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="verified" 
                  checked={selectedVerified}
                  onCheckedChange={(checked) => setSelectedVerified(checked === true)}
                />
                <label htmlFor="verified" className="text-sm">Verified profiles only</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="premium" 
                  checked={selectedPremium}
                  onCheckedChange={(checked) => setSelectedPremium(checked === true)}
                />
                <label htmlFor="premium" className="text-sm">Premium profiles only</label>
              </div>
            </div>
          </div>

          {/* Tags Filter */}
          <div className="space-y-2">
            <Label>Interests</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {popularTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* City filter, if available */}
          {setSelectedCity && (
            <div className="space-y-2">
              <Label>City</Label>
              <Select 
                value={selectedCity || ''} 
                onValueChange={(value: string) => setSelectedCity(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any city</SelectItem>
                  <SelectItem value="Copenhagen">Copenhagen</SelectItem>
                  <SelectItem value="Stockholm">Stockholm</SelectItem>
                  <SelectItem value="Oslo">Oslo</SelectItem>
                  <SelectItem value="Helsinki">Helsinki</SelectItem>
                  <SelectItem value="Reykjavik">Reykjavik</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
