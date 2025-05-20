
// Import types from the main types directory but with aliases to avoid conflicts
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

// We no longer need the duplicate interface since we're re-exporting the main one
