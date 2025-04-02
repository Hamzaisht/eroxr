
import { PlatformControl as PlatformControlComponent } from "@/components/admin/platform/PlatformControl";
import { AdminHeader } from "@/components/admin/godmode/AdminHeader";

export default function PlatformControl() {
  return (
    <div className="space-y-4">
      <AdminHeader title="Platform Control" section="Platform Control" />
      <PlatformControlComponent />
    </div>
  );
}
