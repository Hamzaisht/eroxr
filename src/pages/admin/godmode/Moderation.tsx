
import { AdminHeader } from "@/components/admin/godmode/AdminHeader";
import { ModerateContent } from "@/components/admin/platform/ModerateContent";
import { DeletedContent } from "@/components/admin/platform/DeletedContent";
import { FlaggedContentView } from "@/components/admin/platform/FlaggedContentView";

export default function Moderation() {
  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Content Moderation" 
        section="Platform Management" 
      />
      <ModerateContent />
    </div>
  );
}
