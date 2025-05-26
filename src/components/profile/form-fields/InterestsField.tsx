
import { ProfileFormData } from '../types';

interface InterestsFieldProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export const InterestsField = ({ value, onChange }: InterestsFieldProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        Interests
      </label>
      <input
        value={value.join(', ')}
        onChange={(e) => onChange(e.target.value.split(', ').filter(Boolean))}
        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
        placeholder="Music, Sports, Travel..."
      />
    </div>
  );
};
