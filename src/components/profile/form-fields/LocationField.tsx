
interface LocationFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const LocationField = ({ value, onChange }: LocationFieldProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        Location
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
        placeholder="City, Country"
      />
    </div>
  );
};
