
import React from "react";

interface TabContentProps {
  children: React.ReactNode;
  isActive: boolean;
}

export const TabContent = ({ children, isActive }: TabContentProps) => {
  return (
    <div className={`transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`}>
      {children}
    </div>
  );
};
