
import { z } from "zod";

export const profileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  bio: z.string().optional(),
  location: z.string().optional(),
  interests: z.array(z.string()).optional(),
  profile_visibility: z.boolean().default(true),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export interface ProfileHeaderProps {
  profile: any;
  isOwnProfile: boolean;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
}

export interface UsernameFieldProps {
  form: any;
  isLoading: boolean;
  canChangeUsername: boolean;
  currentUsername: string;
  lastUsernameChange: string;
}

export interface BioFieldProps {
  form: any;
}

export interface LocationFieldProps {
  form: any;
}

export interface InterestsFieldProps {
  form: any;
}

export interface VisibilityFieldProps {
  form: any;
}
