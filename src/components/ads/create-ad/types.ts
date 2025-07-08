export interface CreateAdFormData {
  // Basic Info
  title: string;
  description: string;
  location: string;
  age: number;
  
  // Personal Details
  gender: 'male' | 'female' | 'non-binary' | 'other';
  bodyType: 'slim' | 'average' | 'athletic' | 'curvy' | 'plus-size';
  height: string;
  relationshipStatus: 'single' | 'taken' | 'complicated' | 'open';
  
  // Preferences
  lookingFor: string[];
  interests: string[];
  tags: string[];
  
  // Media
  profileImage: File | null;
  additionalImages: File[];
  profileVideo: File | null;
  
  // Verification
  isVerified: boolean;
  verificationLevel: 'basic' | 'premium' | 'elite';
}

export interface StepProps {
  data: CreateAdFormData;
  updateData: (updates: Partial<CreateAdFormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export interface CreateAdDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}