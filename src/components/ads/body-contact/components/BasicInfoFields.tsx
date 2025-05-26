
import { BasicInfoFieldsProps } from '../types';

export const BasicInfoFields = ({ form }: BasicInfoFieldsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Title
        </label>
        <input
          {...form.register('title')}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
          placeholder="Enter title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Description
        </label>
        <textarea
          {...form.register('description')}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
          rows={4}
          placeholder="Describe what you're looking for"
        />
      </div>
    </div>
  );
};
