
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, Check } from "lucide-react";

export const EroboardFilters = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  
  const tags = ["Nature", "Urban", "Portrait", "Abstract", "Sports", "Travel"];
  const types = ["Images", "Videos", "Premium"];
  
  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };
  
  const handleTypeSelect = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex-1 bg-luxury-darker/30">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Advanced
          {(selectedTags.length > 0 || selectedTypes.length > 0) && (
            <span className="ml-2 w-5 h-5 rounded-full bg-luxury-primary flex items-center justify-center text-xs">
              {selectedTags.length + selectedTypes.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Filter by tags</DropdownMenuLabel>
        {tags.map(tag => (
          <DropdownMenuItem 
            key={tag} 
            onSelect={(e) => {
              e.preventDefault();
              handleTagSelect(tag);
            }}
            className="flex items-center justify-between"
          >
            <span>{tag}</span>
            <Checkbox 
              checked={selectedTags.includes(tag)}
              className="data-[state=checked]:bg-luxury-primary border-luxury-neutral/30"
            />
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel>Content type</DropdownMenuLabel>
        {types.map(type => (
          <DropdownMenuItem 
            key={type} 
            onSelect={(e) => {
              e.preventDefault();
              handleTypeSelect(type);
            }}
            className="flex items-center justify-between"
          >
            <span>{type}</span>
            <Checkbox 
              checked={selectedTypes.includes(type)}
              className="data-[state=checked]:bg-luxury-primary border-luxury-neutral/30"
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
