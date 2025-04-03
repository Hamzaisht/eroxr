
import React, { ReactNode } from 'react';
import { SearchFilterBar, SearchFilterBarProps } from './components/SearchFilterBar';

export interface TabContentProps {
  isActive: boolean;
  children?: ReactNode;
}

export const TabContent = ({ isActive, children }: TabContentProps) => {
  if (!isActive) {
    return null;
  }

  return (
    <div className="p-4 bg-black/20 rounded-md border border-white/10 space-y-6">
      {children}
    </div>
  );
};
