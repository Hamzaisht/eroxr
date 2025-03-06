
export interface AdFormValues {
  title: string;
  description: string;
  relationshipStatus: "single" | "couple" | "other";
  lookingFor: string[];
  tags: string[];
  location: string;
  ageRange: { lower: number; upper: number };
  bodyType: string;
  videoFile: File | null;
  avatarFile: File | null;
}

export interface BodyContactFormProps {
  onSubmit: (values: AdFormValues) => void;
  isLoading: boolean;
  onCancel: () => void;
}

export type ModerationStatus = "pending" | "approved" | "rejected";

export interface BodyContactAccessCheckResult {
  canAccess: boolean;
  reasonCodes: string[];
  reasonMessages: string[];
}

export interface BodyContactAdExtended {
  id: string;
  user_id: string;
  title: string;
  description: string;
  relationship_status: string;
  moderation_status: ModerationStatus;
  isUserVerified: boolean;
  isUserPremium: boolean;
  createdAt: string;
}
