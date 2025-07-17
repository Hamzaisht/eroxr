import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminSession } from '@/contexts/AdminSessionContext';
import { GodmodeLayout } from '@/components/godmode/GodmodeLayout';
import { LoadingScreen } from '@/components/layout/LoadingScreen';

export const Godmode: React.FC = () => {
  console.log('🚀 GODMODE COMPONENT LOADED');
  const { isAdmin, isLoading } = useAdminSession();

  console.log('🎯 Godmode: Component rendered', { isAdmin, isLoading });

  if (isLoading) {
    console.log('🎯 Godmode: Showing loading screen');
    return <LoadingScreen />;
  }

  if (!isAdmin) {
    console.log('🎯 Godmode: Not admin, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('🎯 Godmode: Admin confirmed (or forced), showing layout');
  return <GodmodeLayout />;
};