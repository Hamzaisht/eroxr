
import { z } from "zod";

export const profileSchema = z.object({
  username: z.string().min(1, "Username is required"),
  bio: z.string().optional(),
  location: z.string().optional(),
  interests: z.array(z.string()).optional(),
  profile_visibility: z.boolean().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export interface ProfileHeaderProps {
  profile: {
    username?: string;
    bio?: string;
    avatar_url?: string;
    post_count?: number;
    follower_count?: number;
    following_count?: number;
  };
  isOwnProfile: boolean;
  isEditing?: boolean;
  setIsEditing?: (editing: boolean) => void;
  onEdit?: () => void;
}
