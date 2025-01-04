import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { type SearchCategory, type FilterOptions } from "./types/dating";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

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
}

export const AdFilters = ({
  selectedSeeker,
  selectedLookingFor,
  setSelectedSeeker,
  setSelectedLookingFor,
  searchCategories,
  filterOptions,
  setFilterOptions,
}: AdFiltersProps) => {
  const bodyTypes = ['athletic', 'average', 'slim', 'curvy', 'muscular', 'plus_size'];
  const educationLevels = ['high_school', 'college', 'bachelor', 'master', 'phd'];

  return (
    <div className="bg-[#1A1F2C]/50 backdrop-blur-sm p-4 rounded-xl shadow-lg space-y-4">
      <div className="space-y-3">
        <h3 className="text-sm font-semibold bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] bg-clip-text text-transparent">
          I am...
        </h3>
        <div className="space-y-1">
          {searchCategories
            .filter((cat) => cat.seeker === "couple")
            .map((category) => (
              <Button
                key={`couple-${category.looking_for}`}
                variant={
                  selectedSeeker === "couple" &&
                  selectedLookingFor === category.looking_for
                    ? "default"
                    : "outline"
                }
                size="sm"
                className={`w-full justify-start text-xs transition-all duration-300 ${
                  selectedSeeker === "couple" &&
                  selectedLookingFor === category.looking_for
                    ? "bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-white border-none"
                    : "bg-[#2D2A34]/50 text-gray-300 hover:bg-[#3D3A44] border-none"
                }`}
                onClick={() => {
                  setSelectedSeeker("couple");
                  setSelectedLookingFor(category.looking_for);
                }}
              >
                <Search className="w-3 h-3 mr-1" />
                Couple → {category.looking_for}
              </Button>
            ))}
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="age">
          <AccordionTrigger className="text-sm">Age Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                defaultValue={[filterOptions.minAge || 18, filterOptions.maxAge || 99]}
                min={18}
                max={99}
                step={1}
                onValueChange={([min, max]) => 
                  setFilterOptions({ ...filterOptions, minAge: min, maxAge: max })
                }
              />
              <div className="text-xs text-gray-400">
                {filterOptions.minAge || 18} - {filterOptions.maxAge || 99} years
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="body-type">
          <AccordionTrigger className="text-sm">Body Type</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {bodyTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={type}
                    checked={filterOptions.bodyType?.includes(type)}
                    onCheckedChange={(checked) => {
                      const newTypes = checked
                        ? [...(filterOptions.bodyType || []), type]
                        : filterOptions.bodyType?.filter((t) => t !== type) || [];
                      setFilterOptions({ ...filterOptions, bodyType: newTypes });
                    }}
                  />
                  <Label htmlFor={type} className="text-sm capitalize">
                    {type.replace('_', ' ')}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="education">
          <AccordionTrigger className="text-sm">Education</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {educationLevels.map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <Checkbox
                    id={level}
                    checked={filterOptions.educationLevel?.includes(level)}
                    onCheckedChange={(checked) => {
                      const newLevels = checked
                        ? [...(filterOptions.educationLevel || []), level]
                        : filterOptions.educationLevel?.filter((l) => l !== level) || [];
                      setFilterOptions({ ...filterOptions, educationLevel: newLevels });
                    }}
                  />
                  <Label htmlFor={level} className="text-sm capitalize">
                    {level.replace('_', ' ')}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="activity">
          <AccordionTrigger className="text-sm">Last Active</AccordionTrigger>
          <AccordionContent>
            <Select
              value={filterOptions.lastActive}
              onValueChange={(value: 'today' | 'week' | 'month' | 'all') => 
                setFilterOptions({ ...filterOptions, lastActive: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="verification">
          <AccordionTrigger className="text-sm">Verification</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="verified"
                  checked={filterOptions.isVerified}
                  onCheckedChange={(checked) => 
                    setFilterOptions({ ...filterOptions, isVerified: !!checked })
                  }
                />
                <Label htmlFor="verified" className="text-sm">
                  Verified Profiles Only
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="premium"
                  checked={filterOptions.isPremium}
                  onCheckedChange={(checked) => 
                    setFilterOptions({ ...filterOptions, isPremium: !!checked })
                  }
                />
                <Label htmlFor="premium" className="text-sm">
                  Premium Profiles Only
                </Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};