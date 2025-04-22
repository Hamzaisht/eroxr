
import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { MainLayout } from './MainLayout';

interface LayoutProps {
  children?: ReactNode;
}

const Layout: React.FC<LayoutProps> = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default Layout;
