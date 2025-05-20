
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X, Filter } from "lucide-react";
import { DatingFiltersPanel } from './DatingFiltersPanel';
import { DatingAd } from '@/components/ads/types/dating';
import { Dispatch, SetStateAction } from 'react';

export interface DatingFilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  ads: DatingAd[];
  onFilter: Dispatch<SetStateAction<DatingAd[]>>;
}

export function DatingFilterSidebar({ isOpen, onClose, ads, onFilter }: DatingFilterSidebarProps) {
  const [isFilterCollapsed, setIsFilterCollapsed] = React.useState(false);
  const [selectedCountry, setSelectedCountry] = React.useState<"denmark" | "finland" | "iceland" | "norway" | "sweden">("sweden");
  const [selectedGender, setSelectedGender] = React.useState<string | null>(null);
  const [selectedLookingFor, setSelectedLookingFor] = React.useState<string | null>(null);
  const [ageRange, setAgeRange] = React.useState<[number, number]>([18, 99]);
  const [distanceRange, setDistanceRange] = React.useState<[number, number]>([0, 200]);
  const [selectedVerified, setSelectedVerified] = React.useState(false);
  const [selectedPremium, setSelectedPremium] = React.useState(false);
  const [selectedTag, setSelectedTag] = React.useState<string | null>(null);
  
  const handleApplyFilters = () => {
    const filteredAds = ads.filter(ad => {
      // Filter by country
      if (ad.country && ad.country !== selectedCountry) {
        return false;
      }
      
      // Filter by gender/seeker
      if (selectedGender && ad.user_type !== selectedGender) {
        return false;
      }
      
      // Filter by looking for
      if (selectedLookingFor && !ad.looking_for.includes(selectedLookingFor)) {
        return false;
      }
      
      // Filter by age range
      if (ad.age && (ad.age < ageRange[0] || ad.age > ageRange[1])) {
        return false;
      }
      
      // Filter by verified status
      if (selectedVerified && !ad.isVerified) {
        return false;
      }
      
      // Filter by premium status
      if (selectedPremium && !ad.isPremium) {
        return false;
      }
      
      // Filter by tag
      if (selectedTag && (!ad.tags || !ad.tags.includes(selectedTag))) {
        return false;
      }
      
      return true;
    });
    
    onFilter(filteredAds);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={open => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-luxury-darker border-luxury-neutral/20">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle className="text-luxury-neutral flex items-center gap-2">
            <Filter className="w-5 h-5" />
            <span>Filter Dating Ads</span>
          </SheetTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>
        
        <div className="mt-6">
          <DatingFiltersPanel
            isFilterCollapsed={isFilterCollapsed}
            setIsFilterCollapsed={setIsFilterCollapsed}
            showFilters={true}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            selectedGender={selectedGender}
            setSelectedGender={setSelectedGender}
            selectedLookingFor={selectedLookingFor}
            setSelectedLookingFor={setSelectedLookingFor}
            ageRange={ageRange}
            setAgeRange={setAgeRange}
            distanceRange={distanceRange}
            setDistanceRange={setDistanceRange}
            selectedVerified={selectedVerified}
            setSelectedVerified={setSelectedVerified}
            selectedPremium={selectedPremium}
            setSelectedPremium={setSelectedPremium}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
          />
          
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
