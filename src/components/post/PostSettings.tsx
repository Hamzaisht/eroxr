import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { VisibilitySelect } from "./VisibilitySelect";
import { PPVSettings } from "./PPVSettings";

interface PostSettingsProps {
  isPayingCustomer: boolean | null;
  visibility: "public" | "subscribers_only";
  setVisibility: (visibility: "public" | "subscribers_only") => void;
  isPPV: boolean;
  setIsPPV: (isPPV: boolean) => void;
  ppvAmount: number | null;
  setPpvAmount: (amount: number | null) => void;
}

export const PostSettings = ({
  isPayingCustomer,
  visibility,
  setVisibility,
  isPPV,
  setIsPPV,
  ppvAmount,
  setPpvAmount,
}: PostSettingsProps) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <VisibilitySelect 
          visibility={visibility} 
          onVisibilityChange={setVisibility}
        />
        {isPayingCustomer && (
          <PPVSettings
            isPPV={isPPV}
            setIsPPV={setIsPPV}
            ppvAmount={ppvAmount}
            setPpvAmount={setPpvAmount}
          />
        )}
      </div>
      
      {!isPayingCustomer && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Upgrade to a creator account to unlock premium features like PPV content and media uploads.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};