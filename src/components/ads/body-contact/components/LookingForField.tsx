
import { LookingForFieldProps } from '../types';

export const LookingForField = ({ form }: LookingForFieldProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        Looking For
      </label>
      <div className="grid grid-cols-2 gap-2">
        {['friendship', 'dating', 'relationship', 'casual'].map((option) => (
          <label key={option} className="flex items-center space-x-2 text-gray-300">
            <input
              type="checkbox"
              {...form.register('lookingFor')}
              value={option}
              className="rounded border-gray-700"
            />
            <span className="capitalize">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
