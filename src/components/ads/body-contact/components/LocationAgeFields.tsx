
import { LocationAgeFieldsProps } from '../types';

export const LocationAgeFields = ({ form }: LocationAgeFieldsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Location
        </label>
        <input
          {...form.register('location')}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
          placeholder="Your location"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Min Age
          </label>
          <input
            type="number"
            {...form.register('ageRange.lower', { valueAsNumber: true })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
            min="18"
            max="100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Max Age
          </label>
          <input
            type="number"
            {...form.register('ageRange.upper', { valueAsNumber: true })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
            min="18"
            max="100"
          />
        </div>
      </div>
    </div>
  );
};
