import { BarChart2, Bell, Shield, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useUserStatus } from "./sidebar/useUserStatus";
import { SidebarLink } from "./sidebar/SidebarLink";

export const LeftSidebar = () => {
  const navigate = useNavigate();
  const { isAdmin, isVerifiedCreator } = useUserStatus();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed left-0 top-0 h-full bg-luxury-dark/95 backdrop-blur-sm border-r border-luxury-neutral/10 w-64 p-4 z-50"
    >
      <div className="space-y-2">
        <SidebarLink
          icon={Bell}
          label="News Feed"
          onClick={() => navigate('/')}
        />

        {(isAdmin || isVerifiedCreator) && (
          <SidebarLink
            icon={BarChart2}
            label="Eroboard"
            onClick={() => navigate('/eroboard')}
            variant="primary"
          />
        )}

        {isAdmin && (
          <>
            <SidebarLink
              icon={Users}
              label="User Management"
              onClick={() => navigate('/admin/users')}
              variant="danger"
            />

            <SidebarLink
              icon={Shield}
              label="Content Moderation"
              onClick={() => navigate('/admin/moderation')}
              variant="danger"
            />
          </>
        )}
      </div>
    </motion.div>
  );
};