
import { useState, useEffect } from 'react';

export interface LiveSession {
  id: string;
  user_id: string;
  session_type: string;
  status: string;
  created_at: string;
}

export const useLiveSurveillanceData = () => {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock data for now
    setSessions([]);
    setIsLoading(false);
    setError(null);
  }, []);

  return { sessions, isLoading, error };
};
