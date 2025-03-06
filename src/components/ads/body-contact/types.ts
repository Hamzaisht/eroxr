
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
