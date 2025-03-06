
import { Check, Search, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface LookingForFieldProps {
  lookingFor: string[];
  onUpdateLookingFor: (lookingFor: string[]) => void;
}

export const LookingForField = ({ lookingFor, onUpdateLookingFor }: LookingForFieldProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllOptions, setShowAllOptions] = useState(false);

  // Define all relationship option tags
  const tagOptions = [
    // Couple seeking options
    { value: "MF4A", label: "MF4A (Couple seeking Anyone)" },
    { value: "MF4F", label: "MF4F (Couple seeking Female)" },
    { value: "MF4M", label: "MF4M (Couple seeking Male)" },
    { value: "MF4MF", label: "MF4MF (Couple seeking Couple)" },
    { value: "MF4T", label: "MF4T (Couple seeking Trans)" },
    
    // Male seeking options
    { value: "M4A", label: "M4A (Male seeking Anyone)" },
    { value: "M4F", label: "M4F (Male seeking Female)" },
    { value: "M4M", label: "M4M (Male seeking Male)" },
    { value: "M4MF", label: "M4MF (Male seeking Couple)" },
    { value: "M4T", label: "M4T (Male seeking Trans)" },
    
    // Female seeking options
    { value: "F4A", label: "F4A (Female seeking Anyone)" },
    { value: "F4F", label: "F4F (Female seeking Female)" },
    { value: "F4M", label: "F4M (Female seeking Male)" },
    { value: "F4MF", label: "F4MF (Female seeking Couple)" },
    { value: "F4T", label: "F4T (Female seeking Trans)" },
    
    // Generic tags for multi-selection
    { value: "male", label: "Men" },
    { value: "female", label: "Women" },
    { value: "couple", label: "Couples" },
    { value: "trans", label: "Trans" },
    { value: "group", label: "Groups" }
  ];

  // Filter tags based on search term
  const filteredOptions = tagOptions.filter(option => 
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show either all options or a limited set if not searching
  const displayOptions = searchTerm 
    ? filteredOptions 
    : (showAllOptions ? tagOptions : tagOptions.slice(0, 8));

  const toggleOption = (value: string) => {
    if (lookingFor.includes(value)) {
      onUpdateLookingFor(lookingFor.filter(item => item !== value));
    } else {
      onUpdateLookingFor([...lookingFor, value]);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="font-medium">Looking For</Label>
      
      <div className="relative">
        <Input
          type="text"
          placeholder="Search relationship tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        {searchTerm && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
            onClick={() => setSearchTerm("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {displayOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => toggleOption(option.value)}
            className={cn(
              "flex items-center gap-2 px-3 py-1 rounded-full border text-sm transition-all",
              lookingFor.includes(option.value)
                ? "bg-luxury-primary/10 border-luxury-primary text-luxury-primary"
                : "border-border bg-background/60 hover:bg-background/80"
            )}
          >
            {lookingFor.includes(option.value) && (
              <Check className="h-3 w-3" />
            )}
            {option.value}
          </button>
        ))}
      </div>
      
      {!searchTerm && tagOptions.length > 8 && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs text-muted-foreground hover:text-foreground mt-1"
          onClick={() => setShowAllOptions(!showAllOptions)}
        >
          {showAllOptions ? "Show less" : "Show more tags"}
        </Button>
      )}
      
      {lookingFor.length === 0 && (
        <p className="text-sm text-muted-foreground">Select at least one option</p>
      )}
    </div>
  );
};
