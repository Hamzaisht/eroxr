
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { DatingAd } from '@/types/dating';

interface DatingFilterSidebarProps {
  ads: DatingAd[];
  onFilter: (ads: DatingAd[] | null) => void;
  onClose: () => void;
}

export function DatingFilterSidebar({ 
  ads, 
  onFilter,
  onClose 
}: DatingFilterSidebarProps) {
  // Filter logic would go here
  const applyFilters = () => {
    // Example filter - just return all ads
    onFilter(ads);
    onClose();
  };

  const resetFilters = () => {
    onFilter(null);
    onClose();
  };

  return (
    <Sheet open={true} onOpenChange={() => onClose()}>
      <SheetContent className="w-full sm:max-w-md bg-luxury-dark border-luxury-neutral/20">
        <SheetHeader className="flex justify-between items-center">
          <SheetTitle className="text-luxury-neutral">Filters</SheetTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          {/* Filter components would go here */}
          <p className="text-luxury-neutral">
            Filter options coming soon.
          </p>
        </div>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={resetFilters}>
            Reset Filters
          </Button>
          <Button onClick={applyFilters}>
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
