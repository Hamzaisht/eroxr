
import { useState } from "react";
import { InteractiveNav } from "@/components/layout/InteractiveNav";
import { HomeLayout } from "@/components/home/HomeLayout";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePlatformSubscription } from "@/hooks/usePlatformSubscription";
import { useUserRole } from "@/hooks/useUserRole";
import DatingMainContent from "./DatingMainContent";

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
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Sign In Required</h2>
              <p className="text-white/70">Please sign in to access dating features</p>
            </div>
          </div>
        </HomeLayout>
      </>
    );
  }

  return (
    <>
      <InteractiveNav />
      <HomeLayout>
        <div className="md:ml-20">
          <DatingMainContent />
        </div>
      </HomeLayout>
    </>
  );
};

export default Dating;
