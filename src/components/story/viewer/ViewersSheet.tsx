
import { Users } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface ViewersSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ViewersSheet = ({ open, onOpenChange }: ViewersSheetProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[50vh]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Story Viewers
          </SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <div className="text-sm text-gray-500">
            Coming soon: Detailed viewer analytics
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
