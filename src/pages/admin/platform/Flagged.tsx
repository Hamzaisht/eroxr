
import { AdminFlaggedContentView } from "@/components/admin/platform/FlaggedContentView";
import { AdminHeader } from "@/components/admin/sidebar/AdminHeader";

export default function FlaggedContentAdminPage() {
  return (
    <div className="space-y-4">
      <AdminHeader title="Flagged Content" section="Moderation" />
      <AdminFlaggedContentView />
    </div>
  );
}
