import { ShortsFeed } from "@/components/home/ShortsFeed";
import { UploadShortButton } from "@/components/home/UploadShortButton";
import { useSession } from "@supabase/auth-helpers-react";

export default function Shorts() {
  const session = useSession();

  return (
    <div className="min-h-screen bg-luxury-dark pt-16">
      <ShortsFeed />
      {session && <UploadShortButton />}
    </div>
  );
}