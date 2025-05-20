
import { useState } from 'react';
import { DatingAd } from '@/components/ads/types/dating';
import { Button } from '@/components/ui/button';
import { X, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DatingFilterSidebarProps {
  ads: DatingAd[];
  onFilter: (filteredAds: DatingAd[]) => void;
  showFilterPanel?: boolean;
}

export const DatingFilterSidebar = ({
  ads,
  onFilter,
  showFilterPanel = false
}: DatingFilterSidebarProps) => {
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Handle filter change
  const applyFilters = () => {
    let filtered = [...ads];
    
    // Apply gender filter if selected
    if (selectedGender) {
      filtered = filtered.filter(ad => {
        if (selectedGender === 'male') {
          return ad.relationship_status === 'single' && ad.user_type === 'male';
        } else if (selectedGender === 'female') {
          return ad.relationship_status === 'single' && ad.user_type === 'female';
        } else if (selectedGender === 'couple') {
          return ad.relationship_status === 'couple';
        }
        return true;
      });
    }
    
    // Apply looking for filter if selected
    if (selectedType) {
      filtered = filtered.filter(ad => {
        return ad.looking_for.includes(selectedType);
      });
    }
    
    onFilter(filtered);
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedGender(null);
    setSelectedType(null);
    onFilter(ads);
  };

  return (
    <div className={cn(
      "bg-luxury-darker/80 backdrop-blur-sm rounded-lg border border-luxury-primary/10 p-4 transition-all",
      showFilterPanel ? "block" : "hidden md:block",
      "w-full md:w-64 lg:w-72 xl:w-80 h-fit sticky top-4"
    )}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg text-luxury-primary">Filters</h3>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => onFilter(ads)}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="space-y-6">
        {/* Gender Filter */}
        <div>
          <h4 className="text-sm font-medium text-luxury-neutral mb-2">Gender</h4>
          <div className="flex flex-wrap gap-2">
            {['male', 'female', 'couple'].map((gender) => (
              <Button
                key={gender}
                variant="outline"
                size="sm"
                className={cn(
                  "capitalize",
                  selectedGender === gender 
                    ? "bg-luxury-primary text-white border-luxury-primary"
                    : "bg-luxury-darker border-luxury-primary/20"
                )}
                onClick={() => {
                  setSelectedGender(prev => prev === gender ? null : gender);
                }}
              >
                {gender}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Looking For Filter */}
        <div>
          <h4 className="text-sm font-medium text-luxury-neutral mb-2">Looking For</h4>
          <div className="flex flex-wrap gap-2">
            {['male', 'female', 'couple', 'any'].map((type) => (
              <Button
                key={type}
                variant="outline"
                size="sm"
                className={cn(
                  "capitalize",
                  selectedType === type 
                    ? "bg-luxury-primary text-white border-luxury-primary"
                    : "bg-luxury-darker border-luxury-primary/20"
                )}
                onClick={() => {
                  setSelectedType(prev => prev === type ? null : type);
                }}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1"
            onClick={resetFilters}
          >
            Reset
          </Button>
          <Button 
            variant="default" 
            size="sm"
            className="flex-1 bg-luxury-primary"
            onClick={applyFilters}
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};
