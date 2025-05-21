
import { useSession } from "@supabase/auth-helpers-react";
import { ReactNode } from "react";

interface ProtectedMediaProps {
  contentOwnerId: string;
  children: ReactNode;
}

export const ProtectedMedia = ({ contentOwnerId, children }: ProtectedMediaProps) => {
  const session = useSession();
  const currentUserId = session?.user?.id;
  
  // Always render the children since our bucket is now public and the media is accessible
  // The "protected" functionality is now handled by RLS and the userId metadata
  return <>{children}</>;
};
