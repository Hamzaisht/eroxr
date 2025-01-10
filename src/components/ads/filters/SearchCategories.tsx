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
  const [showGuide, setShowGuide] = useState(true);
  const [currentGuideStep, setCurrentGuideStep] = useState(0);

  const guideSteps = [
    {
      title: "Welcome to Quick Shortcuts!",
      description: "Let's learn how to use our simple shortcut system for finding matches.",
      examples: []
    },
    {
      title: "Couple Seeking",
      description: "When couples are looking for someone:",
      examples: [
        { code: "MF4F", meaning: "Couple seeking Female" },
        { code: "MF4M", meaning: "Couple seeking Male" },
        { code: "MF4MF", meaning: "Couple seeking Couple" }
      ]
    },
    {
      title: "Single Seeking",
      description: "When singles are looking for someone:",
      examples: [
        { code: "M4F", meaning: "Male seeking Female" },
        { code: "F4M", meaning: "Female seeking Male" },
        { code: "F4F", meaning: "Female seeking Female" }
      ]
    }
  ];

  const filteredCategories = searchCategories.filter((category) => {
    const shortcut = getShortcutFromCategory(category.seeker, category.looking_for);
    const searchString = `${shortcut} ${category.seeker} ${category.looking_for}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {showGuide && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="relative overflow-hidden"
          >
            <div className="neo-card p-6 space-y-4">
              <div className="flex justify-between items-start">
                <motion.div
                  key={currentGuideStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4 flex-1"
                >
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
                    {guideSteps[currentGuideStep].title}
                  </h3>
                  
                  <p className="text-luxury-neutral text-sm">
                    {guideSteps[currentGuideStep].description}
                  </p>

                  {guideSteps[currentGuideStep].examples.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {guideSteps[currentGuideStep].examples.map((example) => (
                        <div
                          key={example.code}
                          className="glass-card p-3 space-y-1 hover:scale-105 transition-transform duration-300"
                        >
                          <div className="text-luxury-primary font-semibold">
                            {example.code}
                          </div>
                          <div className="text-xs text-luxury-neutral">
                            {example.meaning}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>

                <div className="flex gap-2">
                  {currentGuideStep < guideSteps.length - 1 ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentGuideStep(currentGuideStep + 1)}
                      className="text-luxury-primary hover:text-luxury-accent hover:bg-luxury-primary/10"
                    >
                      Next <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowGuide(false)}
                      className="text-luxury-primary hover:text-luxury-accent hover:bg-luxury-primary/10"
                    >
                      Got it! <X className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>
              </div>

              {currentGuideStep > 0 && (
                <div className="flex justify-center gap-1 pt-2">
                  {guideSteps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentGuideStep(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        currentGuideStep === index
                          ? "bg-luxury-primary w-4"
                          : "bg-luxury-primary/30"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

      <ScrollArea className="h-[300px] rounded-md border border-luxury-primary/20 bg-luxury-darker/50 p-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-2"
        >
          {filteredCategories.map((category) => {
            const isSelected =
              selectedSeeker === category.seeker &&
              selectedLookingFor === category.looking_for;

            const shortcut = getShortcutFromCategory(category.seeker, category.looking_for);

            return (
              <motion.div
                key={`${category.seeker}-${category.looking_for}`}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className={`w-full justify-start text-sm transition-all duration-300 ${
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
                  <Search className="w-3 h-3 mr-2" />
                  <span className="font-medium">{shortcut}</span>
                </Button>
              </motion.div>
            );
          })}
        </motion.div>
      </ScrollArea>
    </div>
  );
};
