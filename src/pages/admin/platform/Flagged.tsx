
import { AdminHeader } from "@/components/admin/godmode/AdminHeader";
import { FlaggedContentView } from "@/components/admin/platform/FlaggedContentView";

export default function FlaggedContent() {
  return (
    <div>
      <AdminHeader 
        title="Flagged Content" 
        section="Content Moderation" 
      />
      <FlaggedContentView />
    </div>
  )
}
