
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export const NotAuthorized = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0D1117]">
      <div className="w-full max-w-md p-8 space-y-8 text-center bg-[#161B22] rounded-lg border border-luxury-primary/10">
        <ShieldAlert className="mx-auto h-16 w-16 text-red-500" />
        <h1 className="text-2xl font-bold text-white">Access Denied</h1>
        <p className="text-luxury-neutral">
          You do not have permission to access the admin area.
        </p>
        <Button 
          onClick={() => navigate("/")} 
          className="w-full"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};
