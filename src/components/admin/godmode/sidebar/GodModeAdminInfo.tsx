
import { AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const GodModeAdminInfo = () => {
  return (
    <>
      <Separator className="my-4 bg-white/5" />
      <div className="bg-black/70 backdrop-blur-sm px-3 py-2 rounded-md mt-auto">
        <div className="flex items-center gap-2 text-xs text-red-300">
          <AlertTriangle className="h-4 w-4" />
          <div>
            <p className="font-medium">God Mode Active</p>
            <p className="text-gray-400 text-xs">Full system access</p>
          </div>
        </div>
      </div>
    </>
  );
};
