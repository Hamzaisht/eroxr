
import { AdminHeader } from "@/components/admin/godmode/AdminHeader";
import { FlaggedContentView } from "@/components/admin/platform/FlaggedContentView";

export default function ContentFeed() {
  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Content Feed" 
        section="Platform Monitoring" 
      />
      <FlaggedContentView />
    </div>
  );
}
