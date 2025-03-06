
import { SearchCategory } from "@/components/ads/types/dating";

// Shortcut map for search categories
export const shortcutMap: Record<string, { seeker: string; looking_for: string }> = {
  "MF4A": { seeker: "couple", looking_for: "any" },
  "MF4F": { seeker: "couple", looking_for: "female" },
  "MF4M": { seeker: "couple", looking_for: "male" },
  "MF4MF": { seeker: "couple", looking_for: "couple" },
  "MF4T": { seeker: "couple", looking_for: "trans" },
  
  "F4A": { seeker: "female", looking_for: "any" },
  "F4M": { seeker: "female", looking_for: "male" },
  "F4F": { seeker: "female", looking_for: "female" },
  "F4MF": { seeker: "female", looking_for: "couple" },
  "F4T": { seeker: "female", looking_for: "trans" },
  
  "M4A": { seeker: "male", looking_for: "any" },
  "M4F": { seeker: "male", looking_for: "female" },
  "M4M": { seeker: "male", looking_for: "male" },
  "M4MF": { seeker: "male", looking_for: "couple" },
  "M4T": { seeker: "male", looking_for: "trans" }
};

// Default search categories
export const defaultSearchCategories: SearchCategory[] = [
  { seeker: "couple", looking_for: "female" },
  { seeker: "couple", looking_for: "male" },
  { seeker: "couple", looking_for: "couple" },
  { seeker: "couple", looking_for: "trans" },
  { seeker: "couple", looking_for: "any" },
  
  { seeker: "female", looking_for: "male" },
  { seeker: "female", looking_for: "female" },
  { seeker: "female", looking_for: "couple" },
  { seeker: "female", looking_for: "trans" },
  { seeker: "female", looking_for: "any" },
  
  { seeker: "male", looking_for: "female" },
  { seeker: "male", looking_for: "male" },
  { seeker: "male", looking_for: "couple" },
  { seeker: "male", looking_for: "trans" },
  { seeker: "male", looking_for: "any" },
  
  { seeker: "verified", looking_for: "any" },
  { seeker: "premium", looking_for: "any" },
];

// Default nordic countries
export const nordicCountries = ["denmark", "finland", "iceland", "norway", "sweden"];
