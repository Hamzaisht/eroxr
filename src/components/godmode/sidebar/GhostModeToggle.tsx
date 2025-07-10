import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useAdminSession } from '@/contexts/AdminSessionContext';
import { cn } from '@/lib/utils';

export const GhostModeToggle: React.FC = () => {
  const { isGhostMode, toggleGhostMode, isLoading } = useAdminSession();

  return (
    <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/10">
      <div className="flex items-center gap-3">
        {isGhostMode ? (
          <EyeOff className="h-5 w-5 text-purple-400" />
        ) : (
          <Eye className="h-5 w-5 text-gray-400" />
        )}
        <div>
          <p className={cn(
            "text-sm font-medium",
            isGhostMode ? "text-purple-300" : "text-gray-300"
          )}>
            Ghost Mode
          </p>
          <p className="text-xs text-gray-500">
            {isGhostMode ? "Invisible surveillance" : "Normal admin mode"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isLoading && (
          <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
        )}
        <Switch
          checked={isGhostMode}
          onCheckedChange={toggleGhostMode}
          disabled={isLoading}
          className={cn(
            "data-[state=checked]:bg-purple-600",
            "data-[state=unchecked]:bg-gray-600"
          )}
        />
      </div>
    </div>
  );
};