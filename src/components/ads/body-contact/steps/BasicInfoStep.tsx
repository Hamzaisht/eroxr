
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AdFormValues } from "../types";
import { User } from "lucide-react";
import { LocationSearch } from "../../LocationSearch";
import { type Database } from "@/integrations/supabase/types";

type NordicCountry = Database['public']['Enums']['nordic_country'];

interface BasicInfoStepProps {
  values: AdFormValues;
  onUpdateValues: (values: Partial<AdFormValues>) => void;
}

export const BasicInfoStep = ({ values, onUpdateValues }: BasicInfoStepProps) => {
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<NordicCountry | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  
  const bodyTypes = [
    "athletic", "average", "slim", "curvy", "muscular", "plus_size"
  ];

  const handleAvatarChange = (file: File | null, preview: string) => {
    onUpdateValues({ avatarFile: file });
    setAvatarPreview(preview);
  };

  // Update location when city or country changes
  const handleLocationChange = () => {
    if (selectedCity && selectedCountry) {
      onUpdateValues({ location: `${selectedCity}, ${selectedCountry}` });
    } else if (selectedCountry) {
      onUpdateValues({ location: selectedCountry });
    } else {
      onUpdateValues({ location: '' });
    }
  };

  // Set location when city or country changes
  useEffect(() => {
    handleLocationChange();
  }, [selectedCity, selectedCountry]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Profile Image */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center"
      >
        <div className="relative group">
          <Avatar className="h-28 w-28 border-2 border-luxury-primary/30 shadow-[0_0_15px_rgba(155,135,245,0.3)]
            transition-all duration-500 group-hover:shadow-[0_0_25px_rgba(155,135,245,0.6)]">
            <AvatarImage src={avatarPreview} />
            <AvatarFallback>
              <User className="h-12 w-12 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                if (file.size > 5 * 1024 * 1024) {
                  // 5MB limit
                  return;
                }
                
                const reader = new FileReader();
                reader.onloadend = () => {
                  handleAvatarChange(file, reader.result as string);
                };
                reader.readAsDataURL(file);
              }
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            id="avatar-upload"
          />
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 
            bg-gradient-to-r from-luxury-primary to-luxury-secondary text-white text-xs py-1 px-3 
            rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
            Change Photo
          </div>
        </div>
      </motion.div>

      {/* Title */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-2"
      >
        <Label htmlFor="title" className="text-luxury-neutral">Title</Label>
        <Input
          id="title"
          placeholder="Enter a catchy title"
          value={values.title}
          onChange={(e) => onUpdateValues({ title: e.target.value })}
          className="bg-black/20 border-luxury-primary/20 focus:border-luxury-primary/50 focus:ring-luxury-primary/20
            transition-all duration-300 hover:border-luxury-primary/30"
        />
      </motion.div>

      {/* Description */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-2"
      >
        <Label htmlFor="description" className="text-luxury-neutral">Description</Label>
        <Textarea
          id="description"
          placeholder="Tell others about yourself and what you're looking for..."
          value={values.description}
          onChange={(e) => onUpdateValues({ description: e.target.value })}
          rows={5}
          className="bg-black/20 border-luxury-primary/20 focus:border-luxury-primary/50 focus:ring-luxury-primary/20
            resize-none transition-all duration-300 hover:border-luxury-primary/30"
        />
      </motion.div>

      {/* Status and Body Type */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="space-y-2">
          <Label htmlFor="status" className="text-luxury-neutral">Relationship Status</Label>
          <Select
            value={values.relationshipStatus}
            onValueChange={(value: "single" | "couple" | "other") => onUpdateValues({ relationshipStatus: value })}
          >
            <SelectTrigger className="bg-black/20 border-luxury-primary/20 
              focus:border-luxury-primary/50 transition-all duration-300 hover:border-luxury-primary/30">
              <SelectValue placeholder="Select your status" />
            </SelectTrigger>
            <SelectContent className="bg-background/95 backdrop-blur-md border-luxury-primary/20">
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="couple">Couple</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bodyType" className="text-luxury-neutral">Body Type</Label>
          <Select 
            value={values.bodyType} 
            onValueChange={(value) => onUpdateValues({ bodyType: value })}
          >
            <SelectTrigger className="bg-black/20 border-luxury-primary/20 
              focus:border-luxury-primary/50 transition-all duration-300 hover:border-luxury-primary/30">
              <SelectValue placeholder="Select body type" />
            </SelectTrigger>
            <SelectContent className="bg-background/95 backdrop-blur-md border-luxury-primary/20">
              {bodyTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Location */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-2"
      >
        <Label htmlFor="location" className="text-luxury-neutral">Location</Label>
        <LocationSearch
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry as (country: NordicCountry | null) => void}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
        />
      </motion.div>
    </motion.div>
  );
};
