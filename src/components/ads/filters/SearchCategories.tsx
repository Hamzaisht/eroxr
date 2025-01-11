import { useState } from "react";
import { Search, Filter, HelpCircle, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type SearchCategory } from "../types/dating";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface SearchCategoriesProps {
  selectedSeeker: string | null;
  selectedLookingFor: string | null;
  setSelectedSeeker: (seeker: string | null) => void;
  setSelectedLookingFor: (lookingFor: string | null) => void;
  searchCategories: SearchCategory[];
}

const shortcutMap = {
  "MF4F": { seeker: "couple", looking_for: "female" },
  "MF4M": { seeker: "couple", looking_for: "male" },
  "MF4MF": { seeker: "couple", looking_for: "couple" },
  "F4M": { seeker: "female", looking_for: "male" },
  "F4F": { seeker: "female", looking_for: "female" },
  "F4MF": { seeker: "female", looking_for: "couple" },
  "M4F": { seeker: "male", looking_for: "female" },
  "M4M": { seeker: "male", looking_for: "male" },
  "M4MF": { seeker: "male", looking_for: "couple" },
};

const getShortcutFromCategory = (seeker: string, looking_for: string) => {
  const entries = Object.entries(shortcutMap);
  const found = entries.find(([_, value]) => 
    value.seeker === seeker && value.looking_for === looking_for
  );
  return found ? found[0] : `${seeker} → ${looking_for}`;
};

export const SearchCategories = ({
  selectedSeeker,
  selectedLookingFor,
  setSelectedSeeker,
  setSelectedLookingFor,
  searchCategories,
}: SearchCategoriesProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filteredCategories = searchCategories.filter((category) => {
    const shortcut = getShortcutFromCategory(category.seeker, category.looking_for);
    const searchString = `${shortcut} ${category.seeker} ${category.looking_for}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-luxury-darker/50 border-luxury-primary/20 text-luxury-neutral placeholder:text-luxury-muted focus:border-luxury-primary"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-luxury-muted" />
          </div>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="bg-luxury-darker/50 border-luxury-primary/20 hover:bg-luxury-darker hover:border-luxury-primary text-luxury-muted"
              >
                <HelpCircle className="w-4 h-4" />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium">Understanding Shortcuts</h4>
                <p className="text-sm text-muted-foreground">
                  MF4F means a couple (Male+Female) looking for a Female.
                  M4F means a Male looking for a Female, and so on.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={`bg-luxury-darker/50 border-luxury-primary/20 hover:bg-luxury-darker hover:border-luxury-primary ${
              showFilters ? 'text-luxury-primary' : 'text-luxury-muted'
            }`}
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="relative">
        <div className="overflow-x-auto hide-scrollbar">
          <div 
            className="flex gap-3 py-4 px-2 overflow-x-auto scroll-smooth"
            style={{
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {filteredCategories.map((category) => {
              const isSelected =
                selectedSeeker === category.seeker &&
                selectedLookingFor === category.looking_for;

              const shortcut = getShortcutFromCategory(category.seeker, category.looking_for);

              return (
                <motion.div
                  key={`${category.seeker}-${category.looking_for}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-none"
                >
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className={`relative group px-6 py-3 rounded-full transition-all duration-300 ${
                      isSelected
                        ? "bg-gradient-to-r from-luxury-primary to-luxury-secondary text-white"
                        : "bg-luxury-darker/50 text-luxury-neutral hover:bg-luxury-darker hover:text-luxury-primary border-luxury-primary/20"
                    }`}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedSeeker(null);
                        setSelectedLookingFor(null);
                      } else {
                        setSelectedSeeker(category.seeker);
                        setSelectedLookingFor(category.looking_for);
                      }
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-luxury-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                    <Search className="w-3 h-3 mr-2" />
                    <span className="font-medium relative z-10">{shortcut}</span>
                  </Button>
                </motion.div>
              );
            })}
          </div>
          <div className="absolute left-0 right-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-luxury-primary/20 to-transparent" />
        </div>
      </div>
    </div>
  );
};
