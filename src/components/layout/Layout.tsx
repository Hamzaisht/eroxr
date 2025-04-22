
import React from 'react';
import { Outlet } from 'react-router-dom';
import { MainLayout } from './MainLayout';

/**
 * Root layout component that handles authentication status and renders the main layout
 * This serves as the parent wrapper for all authenticated pages
 */
const Layout: React.FC = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default Layout;
