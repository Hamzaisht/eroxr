import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { SignupFormValues } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CountrySelectProps {
  form: UseFormReturn<SignupFormValues>;
  isLoading: boolean;
}

const COUNTRIES = [
  { value: "denmark", label: "Denmark" },
  { value: "finland", label: "Finland" },
  { value: "iceland", label: "Iceland" },
  { value: "norway", label: "Norway" },
  { value: "sweden", label: "Sweden" },
];

export const CountrySelect = ({ form, isLoading }: CountrySelectProps) => {
  return (
    <FormField
      control={form.control}
      name="country"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Select
              disabled={isLoading}
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <SelectTrigger className="h-12 bg-white/5 border-luxury-primary/20 text-white">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent className="bg-luxury-dark border-luxury-primary/20">
                {COUNTRIES.map((country) => (
                  <SelectItem
                    key={country.value}
                    value={country.value}
                    className="text-white hover:bg-white/5"
                  >
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage className="text-sm text-red-400" />
        </FormItem>
      )}
    />
  );
};