
interface UsernameFieldProps {
  value: string;
  onChange: (value: string) => void;
  isAvailable?: boolean;
  isChecking?: boolean;
}

export const UsernameField = ({ value, onChange, isAvailable, isChecking }: UsernameFieldProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        Username
      </label>
      <div className="relative">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
          placeholder="Your username"
        />
        {isChecking && (
          <div className="absolute right-3 top-2.5">
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {isAvailable !== undefined && !isChecking && (
          <div className="absolute right-3 top-2.5">
            {isAvailable ? (
              <span className="text-green-400">✓</span>
            ) : (
              <span className="text-red-400">✗</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
