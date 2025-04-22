
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '../AdminLayout';
import PlatformControl from '@/pages/admin/godmode/PlatformControl';
import { UsersManagement } from '../platform/UsersManagement';
import { VerificationRequests } from '../platform/verifications/VerificationRequests';
import { FlaggedContent } from '../platform/flagged/FlaggedContent';
import { DeletedContent } from '../platform/deleted/DeletedContent';
import { UserAnalytics } from '../platform/analytics/UserAnalytics';
import { PayoutRequests } from '../platform/payouts/PayoutRequests';

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/*" element={<AdminLayout />}>
        <Route index element={<Navigate to="platform/users" replace />} />
        
        {/* Platform Control Routes */}
        <Route path="platform/*" element={<PlatformControl />}>
          <Route index element={<Navigate to="users" replace />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="verifications" element={<VerificationRequests />} />
          <Route path="flagged" element={<FlaggedContent />} />
          <Route path="deleted" element={<DeletedContent />} />
          <Route path="analytics" element={<UserAnalytics />} />
          <Route path="payouts" element={<PayoutRequests />} />
        </Route>
        
        {/* Catch-all for admin routes */}
        <Route path="*" element={<Navigate to="platform/users" replace />} />
      </Route>
    </Routes>
  );
};
