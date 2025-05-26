
interface VisibilityFieldProps {
  value: 'public' | 'private';
  onChange: (value: 'public' | 'private') => void;
}

export const VisibilityField = ({ value, onChange }: VisibilityFieldProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        Profile Visibility
      </label>
      <div className="flex space-x-4">
        <label className="flex items-center space-x-2 text-gray-300">
          <input
            type="radio"
            value="public"
            checked={value === 'public'}
            onChange={(e) => onChange(e.target.value as 'public' | 'private')}
            className="text-luxury-primary"
          />
          <span>Public</span>
        </label>
        <label className="flex items-center space-x-2 text-gray-300">
          <input
            type="radio"
            value="private"
            checked={value === 'private'}
            onChange={(e) => onChange(e.target.value as 'public' | 'private')}
            className="text-luxury-primary"
          />
          <span>Private</span>
        </label>
      </div>
    </div>
  );
};
