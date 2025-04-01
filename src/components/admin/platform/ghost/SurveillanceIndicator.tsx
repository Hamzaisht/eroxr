
import React from 'react';
import { LiveSession } from '../user-analytics/types';
import { Ban, User } from 'lucide-react';

interface SurveillanceIndicatorProps {
  isVisible: boolean;
  session?: LiveSession;
}

export const SurveillanceIndicator: React.FC<SurveillanceIndicatorProps> = ({
  isVisible,
  session
}) => {
  if (!isVisible || !session) return null;

  return (
    <div className="fixed bottom-0 right-0 z-50 p-3 bg-red-900/80 text-white text-xs rounded-tl-lg flex items-center space-x-2 border-t border-l border-red-700">
      <div className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
      </div>
      <div className="flex flex-col">
        <div className="font-bold flex items-center">
          <User className="h-3 w-3 mr-1" />
          Monitoring: {session.username || 'Unknown'}
        </div>
        <div className="text-xs text-red-200">
          {session.type === 'stream' ? 'Live Stream' : 
           session.type === 'chat' ? 'Chat' :
           session.type === 'call' ? 'Call' : 
           session.type === 'bodycontact' ? 'BodyContact' : 'Content'}
        </div>
      </div>
      <button 
        className="bg-red-800 hover:bg-red-700 p-1 rounded"
        aria-label="End surveillance"
      >
        <Ban className="h-3 w-3" />
      </button>
    </div>
  );
};
