import React from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import { useAdminSession } from '@/contexts/AdminSessionContext';
import { GodmodeLayout } from '@/components/godmode/GodmodeLayout';
import { LoadingScreen } from '@/components/layout/LoadingScreen';
import { GodmodeDashboard } from '@/components/godmode/dashboard/GodmodeDashboard';
import { GodmodeUsers } from '@/components/godmode/users/GodmodeUsers';
import { GodmodeContent } from '@/components/godmode/content/GodmodeContent';
import { GodmodeMessages } from '@/components/godmode/messages/GodmodeMessages';
import { GodmodeStreams } from '@/components/godmode/streams/GodmodeStreams';
import { GodmodeVerification } from '@/components/godmode/verification/GodmodeVerification';
import { GodmodePayouts } from '@/components/godmode/payouts/GodmodePayouts';
import { GodmodeFlagged } from '@/components/godmode/flagged/GodmodeFlagged';
import { GodmodeSearch } from '@/components/godmode/search/GodmodeSearch';
import { GodmodeSettings } from '@/components/godmode/settings/GodmodeSettings';

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
  return (
    <Routes>
      <Route path="/" element={<GodmodeLayout />}>
        <Route index element={<GodmodeDashboard />} />
        <Route path="users" element={<GodmodeUsers />} />
        <Route path="content" element={<GodmodeContent />} />
        <Route path="messages" element={<GodmodeMessages />} />
        <Route path="streams" element={<GodmodeStreams />} />
        <Route path="verification" element={<GodmodeVerification />} />
        <Route path="payouts" element={<GodmodePayouts />} />
        <Route path="flagged" element={<GodmodeFlagged />} />
        <Route path="search" element={<GodmodeSearch />} />
        <Route path="settings" element={<GodmodeSettings />} />
      </Route>
    </Routes>
  );
};