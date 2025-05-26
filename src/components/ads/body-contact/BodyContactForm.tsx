
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BasicInfoFields } from "./components/BasicInfoFields";
import { LocationAgeFields } from "./components/LocationAgeFields";
import { LookingForField } from "./components/LookingForField";
import { TagsField } from "./components/TagsField";
import { FormSubmitButtons } from "./components/FormSubmitButtons";
import { useBodyContactSubmit } from "./hooks/useBodyContactSubmit";
import { AdFormValues, adFormSchema } from "./types";

interface BodyContactFormProps {
  onSuccess?: () => void;
  onComplete?: () => void;
  isSuperAdmin?: boolean;
}

export const BodyContactForm = ({ 
  onSuccess, 
  onComplete,
  isSuperAdmin = false 
}: BodyContactFormProps) => {
  const form = useForm<AdFormValues>({
    resolver: zodResolver(adFormSchema),
    defaultValues: {
      title: "",
      description: "",
      relationshipStatus: "single",
      lookingFor: [],
      bodyType: "average",
      location: "",
      ageRange: { lower: 18, upper: 65 },
      tags: []
    }
  });

  const { handleSubmit, isLoading } = useBodyContactSubmit({
    onSuccess,
    onComplete,
    isSuperAdmin
  });

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <BasicInfoFields form={form} />
      <LocationAgeFields form={form} />
      <LookingForField form={form} />
      <TagsField form={form} />
      <FormSubmitButtons 
        isLoading={isLoading}
        onCancel={() => form.reset()}
        onSubmit={() => form.handleSubmit(handleSubmit)()}
      />
    </form>
  );
};
