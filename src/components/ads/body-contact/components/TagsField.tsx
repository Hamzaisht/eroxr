
import { TagsFieldProps } from '../types';

export const TagsField = ({ form }: TagsFieldProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        Tags (optional)
      </label>
      <input
        {...form.register('tags')}
        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
        placeholder="Add tags separated by commas"
      />
    </div>
  );
};
