import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { LoadingScreen } from '@/components/layout/LoadingScreen';
import { GodmodeLayout } from '@/components/godmode/GodmodeLayout';

const Admin: React.FC = () => {
  const { isAdmin, isLoading } = useAdminAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <GodmodeLayout />;
};

export default Admin;