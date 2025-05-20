
// Import types from the main types directory
import { 
  DatingAd as MainDatingAd, 
  FilterOptions as MainFilterOptions, 
  SearchCategory as MainSearchCategory, 
  DatingAdAction as MainDatingAdAction 
} from '@/types/dating';

// Re-export the main types
export type DatingAd = MainDatingAd;
export type FilterOptions = MainFilterOptions;
export type SearchCategory = MainSearchCategory;
export type DatingAdAction = MainDatingAdAction;
