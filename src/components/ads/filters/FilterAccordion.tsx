
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { type FilterOptions } from "../types/dating";

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
}: FilterAccordionProps) => (
  <Accordion type="single" collapsible className="w-full">
    <AccordionItem value="age" className="border-luxury-primary/10">
      <AccordionTrigger className="text-sm text-luxury-neutral hover:text-luxury-primary">
        Age Range
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4">
          <Slider
            defaultValue={[filterOptions.minAge || 18, filterOptions.maxAge || 99]}
            min={18}
            max={99}
            step={1}
            className="[&_[role=slider]]:bg-luxury-primary [&_[role=slider]]:border-luxury-primary"
            onValueChange={([min, max]) => 
              setFilterOptions({ ...filterOptions, minAge: min, maxAge: max })
            }
          />
          <div className="text-xs text-luxury-neutral">
            {filterOptions.minAge || 18} - {filterOptions.maxAge || 99} years
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
            min={1}
            max={500}
            step={1}
            className="[&_[role=slider]]:bg-luxury-primary [&_[role=slider]]:border-luxury-primary"
            onValueChange={([value]) => 
              setFilterOptions({ ...filterOptions, maxDistance: value })
            }
          />
          <div className="text-xs text-luxury-neutral">
            Within {filterOptions.maxDistance || 50} km
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>

    <AccordionItem value="body-type" className="border-luxury-primary/10">
      <AccordionTrigger className="text-sm text-luxury-neutral hover:text-luxury-primary">
        Body Type
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-2">
          {bodyTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
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
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="verified"
              checked={filterOptions.isVerified || false}
              onCheckedChange={(checked) => 
                setFilterOptions({ ...filterOptions, isVerified: !!checked })
              }
              className="border-luxury-primary/50 data-[state=checked]:bg-luxury-primary data-[state=checked]:border-luxury-primary"
            />
            <Label htmlFor="verified" className="text-sm text-luxury-neutral">
              Verified Profiles Only
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="premium"
              checked={filterOptions.isPremium || false}
              onCheckedChange={(checked) => 
                setFilterOptions({ ...filterOptions, isPremium: !!checked })
              }
              className="border-luxury-primary/50 data-[state=checked]:bg-luxury-primary data-[state=checked]:border-luxury-primary"
            />
            <Label htmlFor="premium" className="text-sm text-luxury-neutral">
              Premium Profiles Only
            </Label>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);
