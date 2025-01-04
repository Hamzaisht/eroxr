export type DatingAd = {
  id: string;
  title: string;
  description: string;
  relationship_status: "single" | "couple" | "other";
  looking_for: string[];
  country: string;
  city: string;
  age_range: { lower: number; upper: number };
  created_at: string;
  is_premium?: boolean;
  is_verified?: boolean;
};

export type SearchCategory = {
  seeker: "couple" | "female" | "male";
  looking_for: "male" | "female" | "couple";
};