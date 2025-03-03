
import { useProfileStats } from "./stats/useProfileStats";
import { StatsGrid } from "./stats/StatsGrid";
import { StatSkeleton } from "./stats/StatsSkeleton";
import { StatsError } from "./stats/StatsError";
import { TipDialog } from "./stats/TipDialog";
import { UserListModal } from "./stats/UserListModal";

export const ProfileStats = ({ profileId }: { profileId: string }) => {
  const {
    stats,
    isLoading,
    error,
    showTipDialog,
    setShowTipDialog,
    showUserList,
    setShowUserList,
    userListType,
    isTipLoading,
    handleShowUserList,
    handleShowTipDialog
  } = useProfileStats(profileId);

  if (error) {
    return <StatsError />;
  }

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-4 justify-center relative z-10 px-4">
        {[...Array(5)].map((_, i) => (
          <StatSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <>
      <StatsGrid 
        stats={stats}
        onShowUserList={handleShowUserList}
        onShowTipDialog={handleShowTipDialog}
        isTipLoading={isTipLoading}
      />

      <TipDialog 
        open={showTipDialog}
        onOpenChange={setShowTipDialog}
        recipientId={profileId}
      />

      <UserListModal
        open={showUserList}
        onOpenChange={setShowUserList}
        profileId={profileId}
        type={userListType}
      />
    </>
  );
};
