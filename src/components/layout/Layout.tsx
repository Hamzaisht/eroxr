
import React from 'react';
import { Outlet } from 'react-router-dom';
import { MainLayout } from './MainLayout';

const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen w-full bg-[#0D1117]">
      <div className="flex-1 min-h-screen">
        <MainLayout />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
