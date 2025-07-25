import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Filter } from "lucide-react";
import { DatingAd } from '@/types/dating';
import { motion } from 'framer-motion';

interface DatingFilterSidebarProps {
  ads: DatingAd[];
  onFilter: (ads: DatingAd[] | null) => void;
  onClose: () => void;
}

interface FilterState {
  country: string;
  city: string;
  ageRange: [number, number];
  relationshipStatus: string[];
  lookingFor: string[];
  verified: boolean;
  premium: boolean;
  distance: number;
  bodyType: string[];
  interests: string[];
}

const COUNTRIES = [
  { value: 'denmark', label: 'Denmark 🇩🇰' },
  { value: 'finland', label: 'Finland 🇫🇮' },
  { value: 'iceland', label: 'Iceland 🇮🇸' },
  { value: 'norway', label: 'Norway 🇳🇴' },
  { value: 'sweden', label: 'Sweden 🇸🇪' },
];

const RELATIONSHIP_STATUS = [
  { value: 'single', label: 'Single' },
  { value: 'couple', label: 'Couple' },
  { value: 'other', label: 'Other' },
];

const LOOKING_FOR = [
  { value: 'dating', label: 'Dating' },
  { value: 'relationship', label: 'Relationship' },
  { value: 'casual', label: 'Casual' },
  { value: 'friendship', label: 'Friendship' },
  { value: 'bodycontact', label: 'Body Contact' },
];

const BODY_TYPES = [
  { value: 'slim', label: 'Slim' },
  { value: 'athletic', label: 'Athletic' },
  { value: 'average', label: 'Average' },
  { value: 'curvy', label: 'Curvy' },
  { value: 'plus-size', label: 'Plus Size' },
];

export function DatingFilterSidebar({ 
  ads, 
  onFilter,
  onClose 
}: DatingFilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>({
    country: '',
    city: '',
    ageRange: [18, 65],
    relationshipStatus: [],
    lookingFor: [],
    verified: false,
    premium: false,
    distance: 100,
    bodyType: [],
    interests: [],
  });

  const [appliedFiltersCount, setAppliedFiltersCount] = useState(0);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key: 'relationshipStatus' | 'lookingFor' | 'bodyType' | 'interests', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  const applyFilters = () => {
    let filteredAds = [...ads];
    let filterCount = 0;

    // Country filter
    if (filters.country) {
      filteredAds = filteredAds.filter(ad => ad.country === filters.country);
      filterCount++;
    }

    // City filter
    if (filters.city) {
      filteredAds = filteredAds.filter(ad => 
        ad.city?.toLowerCase().includes(filters.city.toLowerCase())
      );
      filterCount++;
    }

    // Age range filter
    if (filters.ageRange[0] !== 18 || filters.ageRange[1] !== 65) {
      filteredAds = filteredAds.filter(ad => {
        if (!ad.age_range) return true;
        const ageRange = Array.isArray(ad.age_range) ? ad.age_range : [ad.age_range.lower, ad.age_range.upper];
        return ageRange[0] >= filters.ageRange[0] && ageRange[1] <= filters.ageRange[1];
      });
      filterCount++;
    }

    // Relationship status filter
    if (filters.relationshipStatus.length > 0) {
      filteredAds = filteredAds.filter(ad => 
        filters.relationshipStatus.includes(ad.relationship_status || '')
      );
      filterCount++;
    }

    // Looking for filter
    if (filters.lookingFor.length > 0) {
      filteredAds = filteredAds.filter(ad => 
        ad.looking_for?.some(item => filters.lookingFor.includes(item))
      );
      filterCount++;
    }

    // Verified filter
    if (filters.verified) {
      filteredAds = filteredAds.filter(ad => ad.isVerified || ad.is_verified);
      filterCount++;
    }

    // Premium filter
    if (filters.premium) {
      filteredAds = filteredAds.filter(ad => ad.isPremium || ad.is_premium);
      filterCount++;
    }

    // Body type filter
    if (filters.bodyType.length > 0) {
      filteredAds = filteredAds.filter(ad => 
        filters.bodyType.includes(ad.body_type || '')
      );
      filterCount++;
    }

    // Interests filter
    if (filters.interests.length > 0) {
      filteredAds = filteredAds.filter(ad => 
        ad.interests?.some(interest => filters.interests.includes(interest))
      );
      filterCount++;
    }

    setAppliedFiltersCount(filterCount);
    onFilter(filteredAds);
    onClose();
  };

  const resetFilters = () => {
    setFilters({
      country: '',
      city: '',
      ageRange: [18, 65],
      relationshipStatus: [],
      lookingFor: [],
      verified: false,
      premium: false,
      distance: 100,
      bodyType: [],
      interests: [],
    });
    setAppliedFiltersCount(0);
    onFilter(null);
    onClose();
  };

  // Get unique interests from ads
  const availableInterests = Array.from(
    new Set(ads.flatMap(ad => ad.interests || []))
  ).slice(0, 20); // Limit to top 20 interests

  return (
    <Sheet open={true} onOpenChange={() => onClose()}>
      <SheetContent className="w-full sm:max-w-md bg-background border-border overflow-y-auto">
        <SheetHeader className="flex flex-row justify-between items-center pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            <SheetTitle className="text-foreground">Divine Filters</SheetTitle>
            {appliedFiltersCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {appliedFiltersCount} active
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          {/* Location Filters */}
          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Label className="text-sm font-medium text-foreground">Location</Label>
            <Select value={filters.country} onValueChange={(value) => updateFilter('country', value)}>
              <SelectTrigger className="bg-muted/50 border-border">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                {COUNTRIES.map(country => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          {/* Age Range */}
          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Label className="text-sm font-medium text-foreground">
              Age Range: {filters.ageRange[0]} - {filters.ageRange[1]}
            </Label>
            <Slider
              value={filters.ageRange}
              onValueChange={(value) => updateFilter('ageRange', value as [number, number])}
              min={18}
              max={80}
              step={1}
              className="w-full"
            />
          </motion.div>

          {/* Relationship Status */}
          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Label className="text-sm font-medium text-foreground">Relationship Status</Label>
            <div className="flex flex-wrap gap-2">
              {RELATIONSHIP_STATUS.map(status => (
                <Badge
                  key={status.value}
                  variant={filters.relationshipStatus.includes(status.value) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/10 transition-colors"
                  onClick={() => toggleArrayFilter('relationshipStatus', status.value)}
                >
                  {status.label}
                </Badge>
              ))}
            </div>
          </motion.div>

          {/* Looking For */}
          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Label className="text-sm font-medium text-foreground">Looking For</Label>
            <div className="flex flex-wrap gap-2">
              {LOOKING_FOR.map(item => (
                <Badge
                  key={item.value}
                  variant={filters.lookingFor.includes(item.value) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/10 transition-colors"
                  onClick={() => toggleArrayFilter('lookingFor', item.value)}
                >
                  {item.label}
                </Badge>
              ))}
            </div>
          </motion.div>

          {/* Body Type */}
          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Label className="text-sm font-medium text-foreground">Body Type</Label>
            <div className="flex flex-wrap gap-2">
              {BODY_TYPES.map(type => (
                <Badge
                  key={type.value}
                  variant={filters.bodyType.includes(type.value) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/10 transition-colors"
                  onClick={() => toggleArrayFilter('bodyType', type.value)}
                >
                  {type.label}
                </Badge>
              ))}
            </div>
          </motion.div>

          {/* Interests */}
          {availableInterests.length > 0 && (
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Label className="text-sm font-medium text-foreground">Interests</Label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {availableInterests.map(interest => (
                  <Badge
                    key={interest}
                    variant={filters.interests.includes(interest) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/10 transition-colors text-xs"
                    onClick={() => toggleArrayFilter('interests', interest)}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}

          {/* Verification & Premium */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-foreground">Verified Only</Label>
              <Switch
                checked={filters.verified}
                onCheckedChange={(checked) => updateFilter('verified', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-foreground">Premium Only</Label>
              <Switch
                checked={filters.premium}
                onCheckedChange={(checked) => updateFilter('premium', checked)}
              />
            </div>
          </motion.div>
        </div>
        
        <div className="flex gap-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={resetFilters} className="flex-1">
            Reset
          </Button>
          <Button onClick={applyFilters} className="flex-1">
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}