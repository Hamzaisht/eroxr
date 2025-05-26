
interface UsernameFieldProps {
  value: string;
  onChange: (value: string) => void;
  isLoading: boolean;
  canChangeUsername: boolean;
  currentUsername: string;
  lastUsernameChange: string | null;
}

export const UsernameField = ({ 
  value, 
  onChange, 
  isLoading, 
  canChangeUsername, 
  currentUsername, 
  lastUsernameChange 
}: UsernameFieldProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        Username
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
        placeholder="Enter your username"
        disabled={isLoading || !canChangeUsername}
      />
      {!canChangeUsername && lastUsernameChange && (
        <p className="text-sm text-yellow-400">
          You can change your username again in {60 - Math.floor((Date.now() - new Date(lastUsernameChange).getTime()) / (1000 * 60 * 60 * 24))} days
        </p>
      )}
    </div>
  );
};
