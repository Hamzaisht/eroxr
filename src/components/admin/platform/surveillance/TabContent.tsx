
import React, { ReactNode } from 'react';
import { SearchFilterBar } from './components/SearchFilterBar';
import { LiveSession } from './types';

export interface TabContentProps {
  isActive: boolean;
  children?: ReactNode;
  sessions?: LiveSession[];
  isLoading?: boolean;
  error?: string | null;
  activeTab?: string;
}

export const TabContent = ({ isActive, children, sessions, isLoading, error, activeTab }: TabContentProps) => {
  if (!isActive) {
    return null;
  }

  return (
    <div className="p-4 bg-black/20 rounded-md border border-white/10 space-y-6">
      {children}
    </div>
  );
};
