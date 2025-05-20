
// Import types from the main types directory
import { 
  DatingAd as MainDatingAd, 
  FilterOptions as MainFilterOptions, 
  SearchCategory as MainSearchCategory, 
  DatingAdAction as MainDatingAdAction 
} from '@/types/dating';

// Re-export the main types
export type { 
  MainDatingAd as DatingAd, 
  MainFilterOptions as FilterOptions, 
  MainSearchCategory as SearchCategory, 
  MainDatingAdAction as DatingAdAction 
};
