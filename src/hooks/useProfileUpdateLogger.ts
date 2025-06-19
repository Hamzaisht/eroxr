// Comprehensive logging hook for profile updates to track execution paths
import { useCallback } from 'react';

interface ProfileUpdateLog {
  userId: string;
  updateType: string;
  functionUsed: string;
  timestamp: string;
  data?: any;
  success?: boolean;
  error?: string;
}

export const useProfileUpdateLogger = () => {
  const logProfileUpdate = useCallback((log: ProfileUpdateLog) => {
    const logEntry = {
      ...log,
      timestamp: new Date().toISOString(),
      sessionId: crypto.randomUUID(),
    };
    
    console.group(`🔍 Profile Update Log: ${log.updateType}`);
    console.log('📊 Update Details:', logEntry);
    console.log('🎯 Function Used:', log.functionUsed);
    console.log('👤 User ID:', log.userId);
    console.log('⏰ Timestamp:', log.timestamp);
    
    if (log.data) {
      console.log('📝 Update Data:', log.data);
    }
    
    if (log.success) {
      console.log('✅ Status: SUCCESS');
    } else if (log.error) {
      console.log('❌ Status: ERROR');
      console.error('🚨 Error Details:', log.error);
    }
    
    console.groupEnd();
    
    // Store in session storage for debugging
    try {
      const existingLogs = JSON.parse(sessionStorage.getItem('profileUpdateLogs') || '[]');
      existingLogs.push(logEntry);
      // Keep only last 50 logs to prevent memory issues
      const recentLogs = existingLogs.slice(-50);
      sessionStorage.setItem('profileUpdateLogs', JSON.stringify(recentLogs));
    } catch (error) {
      console.warn('Failed to store profile update log:', error);
    }
  }, []);

  const getProfileUpdateLogs = useCallback(() => {
    try {
      return JSON.parse(sessionStorage.getItem('profileUpdateLogs') || '[]');
    } catch (error) {
      console.warn('Failed to retrieve profile update logs:', error);
      return [];
    }
  }, []);

  const clearProfileUpdateLogs = useCallback(() => {
    try {
      sessionStorage.removeItem('profileUpdateLogs');
      console.log('🧹 Profile update logs cleared');
    } catch (error) {
      console.warn('Failed to clear profile update logs:', error);
    }
  }, []);

  return {
    logProfileUpdate,
    getProfileUpdateLogs,
    clearProfileUpdateLogs,
  };
};
