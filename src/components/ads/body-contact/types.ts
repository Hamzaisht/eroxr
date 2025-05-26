
import { z } from "zod";

export const adFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  relationshipStatus: z.enum(["single", "taken", "complicated"]),
  lookingFor: z.array(z.string()),
  bodyType: z.enum(["slim", "average", "curvy", "athletic"]),
  location: z.string().min(1, "Location is required"),
  ageRange: z.object({
    lower: z.number().min(18).max(100),
    upper: z.number().min(18).max(100)
  }),
  tags: z.array(z.string()),
  // Add file properties
  avatarFile: z.instanceof(File).nullable().optional(),
  videoFile: z.instanceof(File).nullable().optional()
});

export type AdFormValues = z.infer<typeof adFormSchema>;

// Add missing types
export type ModerationStatus = 'pending' | 'approved' | 'rejected';

export interface BodyContactAccessCheckResult {
  canAccess: boolean;
  reason?: string;
  requiresPremium?: boolean;
  requiresVerification?: boolean;
}

export interface BasicInfoFieldsProps {
  form: any;
}

export interface LocationAgeFieldsProps {
  form: any;
}

export interface LookingForFieldProps {
  form: any;
}

export interface TagsFieldProps {
  form: any;
}

export interface FormSubmitButtonsProps {
  isLoading: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}
