import { useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { initializeScreenshotProtection, preventMediaSelection } from "@/lib/security";

interface ProtectedMediaProps {
  children: React.ReactNode;
  contentOwnerId: string;
  className?: string;
}

export const ProtectedMedia = ({ children, contentOwnerId, className = "" }: ProtectedMediaProps) => {
  const session = useSession();

  useEffect(() => {
    initializeScreenshotProtection(session?.user?.id, contentOwnerId);
  }, [session?.user?.id, contentOwnerId]);

  return (
    <div 
      className={`relative ${className}`}
      style={{ 
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        userSelect: 'none',
        pointerEvents: 'none'
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}
      <div className="absolute inset-0 bg-transparent" />
    </div>
  );
};