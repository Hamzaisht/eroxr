import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Filter, 
  Settings, 
  Crown, 
  Shield, 
  MapPin, 
  Calendar, 
  Heart,
  Sparkles,
  X,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useState } from "react";

interface EnhancedFiltersPanelProps {
  isFilterCollapsed: boolean;
  setIsFilterCollapsed: (collapsed: boolean) => void;
  showFilters: boolean;
  selectedCountry: "denmark" | "finland" | "iceland" | "norway" | "sweden";
  setSelectedCountry: (country: "denmark" | "finland" | "iceland" | "norway" | "sweden") => void;
  selectedGender: string;
  setSelectedGender: (gender: string) => void;
  minAge: number;
  setMinAge: (age: number) => void;
  maxAge: number;
  setMaxAge: (age: number) => void;
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  selectedLookingFor: string[];
  setSelectedLookingFor: (lookingFor: string[]) => void;
  isFilterApplied: boolean;
  handleApplyFilters: () => void;
  handleResetFilters: () => void;
  selectedCity?: string;
  setSelectedCity?: (city: string) => void;
  selectedVerified: boolean;
  setSelectedVerified: (verified: boolean) => void;
  selectedPremium: boolean;
  setSelectedPremium: (premium: boolean) => void;
  distanceRange: [number, number];
  setDistanceRange: (range: [number, number]) => void;
}

export function EnhancedFiltersPanel(props: EnhancedFiltersPanelProps) {
  const [expandedSections, setExpandedSections] = useState({
    location: true,
    demographics: true,
    preferences: true,
    verification: false,
    advanced: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const filterSections = [
    {
      id: 'location',
      title: 'Divine Realm',
      icon: MapPin,
      content: (
        <div className="space-y-4">
          <div>
            <Label className="text-white/80">Nordic Kingdom</Label>
            <Select value={props.selectedCountry} onValueChange={props.setSelectedCountry}>
              <SelectTrigger className="glass-panel border-cyan-400/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-panel border-cyan-400/30">
                <SelectItem value="denmark">🇩🇰 Denmark</SelectItem>
                <SelectItem value="finland">🇫🇮 Finland</SelectItem>
                <SelectItem value="iceland">🇮🇸 Iceland</SelectItem>
                <SelectItem value="norway">🇳🇴 Norway</SelectItem>
                <SelectItem value="sweden">🇸🇪 Sweden</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {props.setSelectedCity && (
            <div>
              <Label className="text-white/80">Sacred City</Label>
              <Input
                value={props.selectedCity || ""}
                onChange={(e) => props.setSelectedCity!(e.target.value)}
                placeholder="Enter city name..."
                className="glass-panel border-cyan-400/30 text-white"
              />
            </div>
          )}

          <div>
            <Label className="text-white/80">Divine Distance ({props.distanceRange[1]} km)</Label>
            <Slider
              value={[props.distanceRange[1]]}
              onValueChange={(value) => props.setDistanceRange([0, value[0]])}
              max={200}
              min={5}
              step={5}
              className="mt-2"
            />
          </div>
        </div>
      )
    },
    {
      id: 'demographics',
      title: 'Mortal Form',
      icon: Calendar,
      content: (
        <div className="space-y-4">
          <div>
            <Label className="text-white/80">Divine Gender</Label>
            <Select value={props.selectedGender} onValueChange={props.setSelectedGender}>
              <SelectTrigger className="glass-panel border-purple-400/30">
                <SelectValue placeholder="All genders" />
              </SelectTrigger>
              <SelectContent className="glass-panel border-purple-400/30">
                <SelectItem value="">All Mortals</SelectItem>
                <SelectItem value="male">⚡ Male Gods</SelectItem>
                <SelectItem value="female">🌙 Female Goddesses</SelectItem>
                <SelectItem value="non-binary">✨ Divine Beings</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-white/80">Age of Wisdom ({props.minAge} - {props.maxAge})</Label>
            <div className="mt-2 space-y-2">
              <Slider
                value={[props.minAge, props.maxAge]}
                onValueChange={(value) => {
                  props.setMinAge(value[0]);
                  props.setMaxAge(value[1]);
                }}
                max={70}
                min={18}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'preferences',
      title: 'Divine Desires',
      icon: Heart,
      content: (
        <div className="space-y-4">
          <div>
            <Label className="text-white/80">Seeking Divine Connection</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {['friendship', 'romance', 'marriage', 'adventure'].map((type) => (
                <Badge
                  key={type}
                  variant={props.selectedLookingFor.includes(type) ? "default" : "outline"}
                  className={`cursor-pointer transition-all duration-300 ${
                    props.selectedLookingFor.includes(type)
                      ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-400/50'
                      : 'border-white/20 hover:border-pink-400/40'
                  }`}
                  onClick={() => {
                    const newLookingFor = props.selectedLookingFor.includes(type)
                      ? props.selectedLookingFor.filter(item => item !== type)
                      : [...props.selectedLookingFor, type];
                    props.setSelectedLookingFor(newLookingFor);
                  }}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-white/80">Divine Interests</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {['art', 'music', 'sports', 'travel', 'food', 'books', 'movies', 'nature'].map((tag) => (
                <Badge
                  key={tag}
                  variant={props.selectedTag === tag ? "default" : "outline"}
                  className={`cursor-pointer transition-all duration-300 ${
                    props.selectedTag === tag
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400/50'
                      : 'border-white/20 hover:border-cyan-400/40'
                  }`}
                  onClick={() => props.setSelectedTag(props.selectedTag === tag ? null : tag)}
                >
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'verification',
      title: 'Divine Status',
      icon: Shield,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <Label className="text-white/80">Verified Profiles Only</Label>
            </div>
            <Switch
              checked={props.selectedVerified}
              onCheckedChange={props.setSelectedVerified}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-yellow-400" />
              <Label className="text-white/80">Elite Members Only</Label>
            </div>
            <Switch
              checked={props.selectedPremium}
              onCheckedChange={props.setSelectedPremium}
            />
          </div>
        </div>
      )
    }
  ];

  if (!props.showFilters) return null;

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className="space-y-4"
    >
      {/* Filter Header */}
      <motion.div
        className="glass-panel rounded-xl p-4"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-lg">
              <Filter className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-bold text-white holographic-text">Divine Filters</h3>
              <p className="text-sm text-white/60">Refine your divine search</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => props.setIsFilterCollapsed(!props.isFilterCollapsed)}
            className="text-white/60 hover:text-white"
          >
            {props.isFilterCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </Button>
        </div>

        {props.isFilterApplied && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mt-3"
          >
            <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/50 text-green-300">
              <Sparkles className="w-3 h-3 mr-1" />
              Filters Active
            </Badge>
          </motion.div>
        )}
      </motion.div>

      {/* Filter Sections */}
      <AnimatePresence>
        {!props.isFilterCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {filterSections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="glass-panel rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleSection(section.id as keyof typeof expandedSections)}
                  className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <section.icon className="w-4 h-4 text-cyan-400" />
                    <span className="text-white font-medium">{section.title}</span>
                  </div>
                  {expandedSections[section.id as keyof typeof expandedSections] 
                    ? <ChevronUp className="w-4 h-4 text-white/60" />
                    : <ChevronDown className="w-4 h-4 text-white/60" />
                  }
                </button>
                
                <AnimatePresence>
                  {expandedSections[section.id as keyof typeof expandedSections] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-white/10"
                    >
                      <div className="p-4">
                        {section.content}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}

            {/* Action Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex gap-3"
            >
              <Button
                onClick={props.handleApplyFilters}
                className="flex-1 futuristic-container bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold py-2 rounded-xl transition-all duration-300"
              >
                <Filter className="w-4 h-4 mr-2" />
                Apply Divine Filters
              </Button>
              
              <Button
                onClick={props.handleResetFilters}
                variant="outline"
                className="glass-panel border-red-400/30 hover:border-red-400/60 text-red-300 hover:text-red-200"
              >
                <X className="w-4 h-4" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}