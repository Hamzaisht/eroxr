
import { useState } from "react";
import { InteractiveNav } from "@/components/layout/InteractiveNav";
import { HomeLayout } from "@/components/home/HomeLayout";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePlatformSubscription } from "@/hooks/usePlatformSubscription";
import { useUserRole } from "@/hooks/useUserRole";
import { DatingErrorBoundary } from "@/components/dating/ErrorBoundary";
import DatingMainContent from "./DatingMainContent";
import { motion } from "framer-motion";

const Dating = () => {
  const { user } = useCurrentUser();
  const { hasPremium } = usePlatformSubscription();
  const { isSuperAdmin } = useUserRole();

  // Super admins and premium users have full access
  const hasFullAccess = hasPremium || isSuperAdmin;

  if (!user) {
    return (
      <>
        <InteractiveNav />
        <HomeLayout>
          <div className="md:ml-20 flex items-center justify-center min-h-[60vh]">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center dating-glass-panel rounded-2xl p-8 max-w-md"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h2 className="text-2xl font-bold dating-title mb-2">Join the Divine Realm</h2>
                <p className="dating-subtitle">Sign in to discover your divine connections and create meaningful relationships</p>
              </motion.div>
              
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/login'}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 action-button-glow"
              >
                Enter the Divine Realm
              </motion.button>
            </motion.div>
          </div>
        </HomeLayout>
      </>
    );
  }

  return (
    <DatingErrorBoundary>
      <InteractiveNav />
      <HomeLayout>
        <div className="md:ml-20">
          <DatingMainContent />
        </div>
      </HomeLayout>
    </DatingErrorBoundary>
  );
};

export default Dating;
