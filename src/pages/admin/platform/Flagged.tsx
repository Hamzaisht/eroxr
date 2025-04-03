
import { FlaggedContent } from "@/components/admin/platform/FlaggedContent";
import { AdminHeader } from "@/components/admin/sidebar/AdminHeader";

export default function FlaggedContent() {
  return (
    <div className="space-y-4">
      <AdminHeader title="Flagged Content" section="Moderation" />
      <FlaggedContent />
    </div>
  );
}
