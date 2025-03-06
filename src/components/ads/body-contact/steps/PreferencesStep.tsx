
import { useState } from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AdFormValues } from "../types";
import { Check, Search, X, Tag, Plus } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PreferencesStepProps {
  values: AdFormValues;
  onUpdateValues: (values: Partial<AdFormValues>) => void;
}

export const PreferencesStep = ({ values, onUpdateValues }: PreferencesStepProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTag, setCurrentTag] = useState("");
  const [showAllOptions, setShowAllOptions] = useState(false);
  
  // Define relationship option tags
  const tagOptions = [
    // Relationship tags (alphabetically sorted)
    { value: "F4A", label: "F4A (Female seeking Any)" },
    { value: "F4F", label: "F4F (Female seeking Female)" },
    { value: "F4M", label: "F4M (Female seeking Male)" },
    { value: "F4MF", label: "F4MF (Female seeking Couple)" },
    { value: "F4T", label: "F4T (Female seeking Trans)" },
    { value: "M4A", label: "M4A (Male seeking Any)" },
    { value: "M4F", label: "M4F (Male seeking Female)" },
    { value: "M4M", label: "M4M (Male seeking Male)" },
    { value: "M4MF", label: "M4MF (Male seeking Couple)" },
    { value: "M4T", label: "M4T (Male seeking Trans)" },
    { value: "MF4A", label: "MF4A (Couple seeking Any)" },
    { value: "MF4F", label: "MF4F (Couple seeking Female)" },
    { value: "MF4M", label: "MF4M (Couple seeking Male)" },
    { value: "MF4MF", label: "MF4MF (Couple seeking Couple)" },
    { value: "MF4T", label: "MF4T (Couple seeking Trans)" },
    
    // Generic categories for multi-selection
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

  const toggleLookingForOption = (value: string) => {
    if (values.lookingFor.includes(value)) {
      onUpdateValues({ 
        lookingFor: values.lookingFor.filter(item => item !== value) 
      });
    } else {
      onUpdateValues({ 
        lookingFor: [...values.lookingFor, value] 
      });
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!values.tags.includes(currentTag.trim())) {
        onUpdateValues({ tags: [...values.tags, currentTag.trim()] });
      }
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onUpdateValues({ 
      tags: values.tags.filter(tag => tag !== tagToRemove) 
    });
  };

  const tagVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
    hover: { scale: 1.05, y: -2 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-10"
    >
      {/* Age Range Selector */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <Label className="text-luxury-neutral text-md font-medium">Age Range</Label>
        <div className="pt-6 pb-2">
          <Slider
            value={[values.ageRange.lower, values.ageRange.upper]}
            min={18}
            max={99}
            step={1}
            className="[&_[role=slider]]:bg-luxury-primary [&_[role=slider]]:border-luxury-primary 
              [&_[role=slider]]:hover:shadow-[0_0_10px_rgba(155,135,245,0.6)]
              [&_[role=slider]]:transition-all [&_[role=slider]]:duration-300"
            onValueChange={([lower, upper]) => 
              onUpdateValues({ ageRange: { lower, upper } })
            }
          />
        </div>
        <div className="flex justify-between text-sm">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-luxury-primary">{values.ageRange.lower}</span>
            <span className="text-xs text-muted-foreground">Min Age</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-luxury-primary">{values.ageRange.upper}</span>
            <span className="text-xs text-muted-foreground">Max Age</span>
          </div>
        </div>
      </motion.div>

      {/* Looking For Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <Label className="text-luxury-neutral text-md font-medium">Looking For</Label>
        
        {/* Search input */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Search relationship types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-black/20 border-luxury-primary/20 focus:border-luxury-primary/50 
              transition-all duration-300 hover:border-luxury-primary/30"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          {searchTerm && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        
        {/* Tags container */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-52 overflow-y-auto custom-scrollbar p-2 
          bg-black/20 rounded-lg border border-luxury-primary/10">
          {displayOptions.map((option, index) => (
            <motion.button
              key={option.value}
              type="button"
              onClick={() => toggleLookingForOption(option.value)}
              variants={tagVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              whileHover="hover"
              transition={{ delay: index * 0.03 }}
              className={cn(
                "flex items-center justify-between gap-1 px-3 py-2 rounded-lg border text-sm transition-all duration-300",
                values.lookingFor.includes(option.value)
                  ? "bg-luxury-primary/20 border-luxury-primary text-luxury-primary shadow-[0_0_10px_rgba(155,135,245,0.3)]"
                  : "border-luxury-primary/10 bg-black/30 hover:bg-black/40 hover:border-luxury-primary/30"
              )}
            >
              <span>{option.value}</span>
              {values.lookingFor.includes(option.value) && (
                <Check className="h-3.5 w-3.5" />
              )}
            </motion.button>
          ))}
        </div>
        
        {/* Show more/less button */}
        {!searchTerm && tagOptions.length > 8 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-muted-foreground hover:text-luxury-primary"
            onClick={() => setShowAllOptions(!showAllOptions)}
          >
            {showAllOptions ? "Show fewer options" : "Show more options"}
          </Button>
        )}
        
        {values.lookingFor.length === 0 && (
          <p className="text-sm text-amber-400 flex items-center">
            <span className="mr-2">⚠️</span>
            Please select at least one relationship type
          </p>
        )}

        {/* Description of selected options */}
        {values.lookingFor.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 p-3 bg-luxury-primary/5 rounded-lg border border-luxury-primary/10"
          >
            <p className="text-sm text-luxury-neutral">
              Selected: {values.lookingFor.join(", ")}
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Tags Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <Label className="text-luxury-neutral text-md font-medium">Interest Tags</Label>
        <div className="relative">
          <Input
            placeholder="Add tags (press Enter)"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyDown={handleTagKeyDown}
            className="pl-10 bg-black/20 border-luxury-primary/20 focus:border-luxury-primary/50 
              transition-all duration-300 hover:border-luxury-primary/30"
          />
          <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
            onClick={() => {
              if (currentTag.trim() && !values.tags.includes(currentTag.trim())) {
                onUpdateValues({ tags: [...values.tags, currentTag.trim()] });
                setCurrentTag("");
              }
            }}
          >
            <Plus className="h-4 w-4 text-luxury-primary" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 min-h-12 p-3 rounded-lg bg-black/20 border border-luxury-primary/10">
          {values.tags.length === 0 && (
            <p className="text-sm text-muted-foreground italic">Add some tags to help others find you</p>
          )}
          
          {values.tags.map((tag, index) => (
            <motion.div
              key={tag}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Badge 
                variant="secondary" 
                className="flex items-center gap-1 bg-luxury-primary/10 text-luxury-primary 
                  border-luxury-primary/20 hover:bg-luxury-primary/20 transition-all duration-300
                  hover:shadow-[0_0_10px_rgba(155,135,245,0.4)]"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="hover:text-red-400 transition-colors ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            </motion.div>
          ))}
        </div>

        {/* Tag suggestions */}
        <div className="mt-2">
          <p className="text-xs text-muted-foreground mb-2">Popular tags:</p>
          <div className="flex flex-wrap gap-1">
            {["fun", "adventure", "respectful", "discreet", "friendship", "casual", "serious", "open-minded"].map((tag) => (
              <Button
                key={tag}
                variant="ghost"
                size="sm"
                className="text-xs h-6 px-2 py-0 text-luxury-neutral hover:text-luxury-primary"
                onClick={() => {
                  if (!values.tags.includes(tag)) {
                    onUpdateValues({ tags: [...values.tags, tag] });
                  }
                }}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
