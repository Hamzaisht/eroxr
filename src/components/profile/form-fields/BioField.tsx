
import { ProfileFormData } from '../types';

interface BioFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const BioField = ({ value, onChange }: BioFieldProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        Bio
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
        rows={4}
        placeholder="Tell us about yourself"
      />
    </div>
  );
};
