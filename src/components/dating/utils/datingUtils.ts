
import { SearchCategory } from "@/components/ads/types/dating";

// Shortcut map for search categories
export const shortcutMap: Record<string, { seeker: string; lookingFor: string }> = {
  "MF4A": { seeker: "couple", lookingFor: "any" },
  "MF4F": { seeker: "couple", lookingFor: "female" },
  "MF4M": { seeker: "couple", lookingFor: "male" },
  "MF4MF": { seeker: "couple", lookingFor: "couple" },
  "MF4T": { seeker: "couple", lookingFor: "trans" },
  
  "F4A": { seeker: "female", lookingFor: "any" },
  "F4M": { seeker: "female", lookingFor: "male" },
  "F4F": { seeker: "female", lookingFor: "female" },
  "F4MF": { seeker: "female", lookingFor: "couple" },
  "F4T": { seeker: "female", lookingFor: "trans" },
  
  "M4A": { seeker: "male", lookingFor: "any" },
  "M4F": { seeker: "male", lookingFor: "female" },
  "M4M": { seeker: "male", lookingFor: "male" },
  "M4MF": { seeker: "male", lookingFor: "couple" },
  "M4T": { seeker: "male", lookingFor: "trans" }
};

// Default search categories
export const defaultSearchCategories: SearchCategory[] = [
  { seeker: "couple", lookingFor: "female" },
  { seeker: "couple", lookingFor: "male" },
  { seeker: "couple", lookingFor: "couple" },
  { seeker: "couple", lookingFor: "trans" },
  { seeker: "couple", lookingFor: "any" },
  
  { seeker: "female", lookingFor: "male" },
  { seeker: "female", lookingFor: "female" },
  { seeker: "female", lookingFor: "couple" },
  { seeker: "female", lookingFor: "trans" },
  { seeker: "female", lookingFor: "any" },
  
  { seeker: "male", lookingFor: "female" },
  { seeker: "male", lookingFor: "male" },
  { seeker: "male", lookingFor: "couple" },
  { seeker: "male", lookingFor: "trans" },
  { seeker: "male", lookingFor: "any" },
  
  { seeker: "verified", lookingFor: "any" },
  { seeker: "premium", lookingFor: "any" },
];

// Default nordic countries
export const nordicCountries = ["denmark", "finland", "iceland", "norway", "sweden"];
