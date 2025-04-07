
import React from "react";

interface TabContentWrapperProps {
  children: React.ReactNode;
  isActive: boolean;
}

export const TabContentWrapper = ({ children, isActive }: TabContentWrapperProps) => {
  return (
    <div className={`transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`}>
      {children}
    </div>
  );
};
