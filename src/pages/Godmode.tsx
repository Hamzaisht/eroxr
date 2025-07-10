import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminSession } from '@/contexts/AdminSessionContext';
import { GodmodeLayout } from '@/components/godmode/GodmodeLayout';
import { LoadingScreen } from '@/components/layout/LoadingScreen';

export const Godmode: React.FC = () => {
  const { isAdmin, isLoading } = useAdminSession();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <GodmodeLayout />;
};