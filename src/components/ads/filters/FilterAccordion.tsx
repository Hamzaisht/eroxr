
import { useState, useEffect } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { type FilterOptions } from "../types/dating";
import { Badge } from "@/components/ui/badge";
import { X, Filter, Map, Calendar, Users, Award, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FilterAccordionProps {
  bodyTypes: string[];
  educationLevels: string[];
  filterOptions: FilterOptions;
  setFilterOptions: (options: FilterOptions) => void;
}

export const FilterAccordion = ({
  bodyTypes,
  educationLevels,
  filterOptions,
  setFilterOptions,
}: FilterAccordionProps) => {
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  
  // Count active filters for badge
  useEffect(() => {
    let count = 0;
    if (filterOptions.minAge && filterOptions.minAge > 18) count++;
    if (filterOptions.maxAge && filterOptions.maxAge < 99) count++;
    if (filterOptions.maxDistance && filterOptions.maxDistance < 500) count++;
    if (filterOptions.bodyType && Array.isArray(filterOptions.bodyType) && filterOptions.bodyType.length > 0) count++;
    if (filterOptions.isVerified) count++;
    if (filterOptions.isPremium) count++;
    
    setActiveFiltersCount(count);
  }, [filterOptions]);
  
  // Clear all filters
  const handleClearFilters = () => {
    setFilterOptions({
      minAge: 18,
      maxAge: 99,
      maxDistance: 50,
      bodyType: [],
      isVerified: false,
      isPremium: false
    });
  };
  
  // Remove individual filter
  const removeFilter = (filterKey: string) => {
    const newOptions = { ...filterOptions };
    
    if (filterKey === 'age') {
      newOptions.minAge = 18;
      newOptions.maxAge = 99;
    } else if (filterKey === 'distance') {
      newOptions.maxDistance = 50;
    } else if (filterKey === 'bodyType') {
      newOptions.bodyType = [];
    } else if (filterKey === 'verified') {
      newOptions.isVerified = false;
    } else if (filterKey === 'premium') {
      newOptions.isPremium = false;
    }
    
    setFilterOptions(newOptions);
  };

  return (
    <div className="space-y-4">
      {/* Filter Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-luxury-primary" />
          <h3 className="text-lg font-semibold text-luxury-neutral">Filters</h3>
          {activeFiltersCount > 0 && (
            <Badge className="bg-luxury-primary text-white">{activeFiltersCount}</Badge>
          )}
        </div>
        
        {activeFiltersCount > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClearFilters}
            className="text-sm text-luxury-primary hover:text-luxury-secondary transition-colors"
          >
            Clear all
          </motion.button>
        )}
      </div>
      
      {/* Active Filters Display */}
      <AnimatePresence>
        {activeFiltersCount > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 mb-4"
          >
            {filterOptions.minAge && filterOptions.minAge > 18 && (
              <Badge 
                variant="outline" 
                className="flex items-center gap-1 bg-luxury-dark/20 text-luxury-neutral border-luxury-primary/30 pl-2"
              >
                <Calendar className="h-3 w-3 mr-1" />
                Age: {filterOptions.minAge}-{filterOptions.maxAge || 99}
                <button 
                  onClick={() => removeFilter('age')}
                  className="ml-1 hover:bg-luxury-primary/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            
            {filterOptions.maxDistance && filterOptions.maxDistance < 500 && (
              <Badge 
                variant="outline" 
                className="flex items-center gap-1 bg-luxury-dark/20 text-luxury-neutral border-luxury-primary/30 pl-2"
              >
                <Map className="h-3 w-3 mr-1" />
                Within {filterOptions.maxDistance} km
                <button 
                  onClick={() => removeFilter('distance')}
                  className="ml-1 hover:bg-luxury-primary/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            
            {filterOptions.bodyType && Array.isArray(filterOptions.bodyType) && filterOptions.bodyType.length > 0 && (
              <Badge 
                variant="outline" 
                className="flex items-center gap-1 bg-luxury-dark/20 text-luxury-neutral border-luxury-primary/30 pl-2"
              >
                <Users className="h-3 w-3 mr-1" />
                Body: {filterOptions.bodyType.length} selected
                <button 
                  onClick={() => removeFilter('bodyType')}
                  className="ml-1 hover:bg-luxury-primary/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            
            {filterOptions.isVerified && (
              <Badge 
                variant="outline" 
                className="flex items-center gap-1 bg-luxury-dark/20 text-luxury-neutral border-luxury-primary/30 pl-2"
              >
                <Shield className="h-3 w-3 mr-1" />
                Verified Only
                <button 
                  onClick={() => removeFilter('verified')}
                  className="ml-1 hover:bg-luxury-primary/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            
            {filterOptions.isPremium && (
              <Badge 
                variant="outline" 
                className="flex items-center gap-1 bg-luxury-dark/20 text-luxury-neutral border-luxury-primary/30 pl-2"
              >
                <Award className="h-3 w-3 mr-1" />
                Premium Only
                <button 
                  onClick={() => removeFilter('premium')}
                  className="ml-1 hover:bg-luxury-primary/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Filter Accordion */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="age" className="border-luxury-primary/10">
          <AccordionTrigger className="text-sm text-luxury-neutral hover:text-luxury-primary">
            Age Range
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                defaultValue={[filterOptions.minAge || 18, filterOptions.maxAge || 99]}
                value={[filterOptions.minAge || 18, filterOptions.maxAge || 99]}
                min={18}
                max={99}
                step={1}
                className="[&_[role=slider]]:bg-luxury-primary [&_[role=slider]]:border-luxury-primary"
                onValueChange={([min, max]) => 
                  setFilterOptions({ ...filterOptions, minAge: min, maxAge: max })
                }
              />
              <div className="text-xs text-luxury-neutral flex justify-between items-center">
                <span className="bg-luxury-primary/10 px-2 py-1 rounded">
                  Min: {filterOptions.minAge || 18}
                </span>
                <span className="bg-luxury-primary/10 px-2 py-1 rounded">
                  Max: {filterOptions.maxAge || 99}
                </span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="location" className="border-luxury-primary/10">
          <AccordionTrigger className="text-sm text-luxury-neutral hover:text-luxury-primary">
            Distance
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                defaultValue={[filterOptions.maxDistance || 50]}
                value={[filterOptions.maxDistance || 50]}
                min={1}
                max={500}
                step={1}
                className="[&_[role=slider]]:bg-luxury-primary [&_[role=slider]]:border-luxury-primary"
                onValueChange={([value]) => 
                  setFilterOptions({ ...filterOptions, maxDistance: value })
                }
              />
              <div className="text-xs text-luxury-neutral flex justify-between items-center">
                <span>1 km</span>
                <span className="bg-luxury-primary/10 px-2 py-1 rounded">
                  {filterOptions.maxDistance || 50} km
                </span>
                <span>500 km</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="body-type" className="border-luxury-primary/10">
          <AccordionTrigger className="text-sm text-luxury-neutral hover:text-luxury-primary">
            Body Type
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2">
              {bodyTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2 p-2 rounded hover:bg-luxury-dark/10 transition-colors">
                  <Checkbox
                    id={type}
                    checked={Array.isArray(filterOptions.bodyType) && filterOptions.bodyType.includes(type)}
                    onCheckedChange={(checked) => {
                      const newTypes = checked
                        ? [...(Array.isArray(filterOptions.bodyType) ? filterOptions.bodyType : []), type]
                        : Array.isArray(filterOptions.bodyType) ? filterOptions.bodyType.filter((t) => t !== type) : [];
                      setFilterOptions({ ...filterOptions, bodyType: newTypes });
                    }}
                    className="border-luxury-primary/50 data-[state=checked]:bg-luxury-primary data-[state=checked]:border-luxury-primary"
                  />
                  <Label htmlFor={type} className="text-sm capitalize text-luxury-neutral">
                    {type.replace('_', ' ')}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="verification" className="border-luxury-primary/10">
          <AccordionTrigger className="text-sm text-luxury-neutral hover:text-luxury-primary">
            Verification
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-luxury-dark/10 transition-colors">
                <Checkbox
                  id="verified"
                  checked={filterOptions.isVerified || false}
                  onCheckedChange={(checked) => 
                    setFilterOptions({ ...filterOptions, isVerified: !!checked })
                  }
                  className="border-luxury-primary/50 data-[state=checked]:bg-luxury-primary data-[state=checked]:border-luxury-primary"
                />
                <Label htmlFor="verified" className="text-sm text-luxury-neutral flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-blue-500" />
                  Verified Profiles Only
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-luxury-dark/10 transition-colors">
                <Checkbox
                  id="premium"
                  checked={filterOptions.isPremium || false}
                  onCheckedChange={(checked) => 
                    setFilterOptions({ ...filterOptions, isPremium: !!checked })
                  }
                  className="border-luxury-primary/50 data-[state=checked]:bg-luxury-primary data-[state=checked]:border-luxury-primary"
                />
                <Label htmlFor="premium" className="text-sm text-luxury-neutral flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-purple-500" />
                  Premium Profiles Only
                </Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      {/* Premium CTA */}
      <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-700/20 border border-purple-500/30">
        <div className="flex items-center gap-2 mb-2">
          <Award className="h-5 w-5 text-purple-400" />
          <h4 className="font-medium text-white">Premium Benefits</h4>
        </div>
        <p className="text-sm text-luxury-neutral mb-3">
          Create your own Body Contact ads and connect with verified users.
        </p>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-md font-medium text-sm flex items-center justify-center gap-2"
        >
          Unlock BD Ads for 59 SEK/month
        </motion.button>
        <p className="text-xs text-luxury-neutral/70 text-center mt-2">
          Cancel anytime
        </p>
      </div>
    </div>
  );
};
