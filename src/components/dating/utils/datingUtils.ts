
import { SearchCategory } from '@/types/dating';

export const nordicCountries = [
  'denmark',
  'finland',
  'iceland',
  'norway',
  'sweden'
];

export const relationshipStatuses = [
  'single',
  'couple',
  'married',
  'divorced',
  'separated',
  'widowed',
  'open_relationship',
  'other'
];

export const seekingOptions = [
  'casual',
  'relationship',
  'friendship',
  'travel_partner',
  'networking',
  'anything'
];

export const defaultSearchCategories: SearchCategory[] = [
  { seeker: 'male', lookingFor: 'female', label: 'Men seeking Women' },
  { seeker: 'female', lookingFor: 'male', label: 'Women seeking Men' },
  { seeker: 'couple', lookingFor: 'female', label: 'Couples seeking Women' },
  { seeker: 'couple', lookingFor: 'male', label: 'Couples seeking Men' },
  { seeker: 'female', lookingFor: 'couple', label: 'Women seeking Couples' },
  { seeker: 'male', lookingFor: 'couple', label: 'Men seeking Couples' },
  { seeker: 'female', lookingFor: 'female', label: 'Women seeking Women' },
  { seeker: 'male', lookingFor: 'male', label: 'Men seeking Men' },
  { seeker: 'any', lookingFor: 'any', label: 'Open to All' }
];
