
// Import types from the main types directory
import { 
  DatingAd,
  FilterOptions,
  SearchCategory,
  SearchCategoryType,
  DatingAdAction,
  getAgeRangeValues
} from '@/types/dating';

// Re-export the main types
export type { DatingAd, FilterOptions, SearchCategory, SearchCategoryType, DatingAdAction };
export { getAgeRangeValues };

// Add any component-specific types here if needed
