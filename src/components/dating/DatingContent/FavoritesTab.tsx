
import { FavoritesView } from "../FavoritesView";
import { Heart } from "lucide-react";
import { DatingAd } from "@/components/ads/types/dating";

interface FavoritesTabProps {
  session: any;
  userProfile: DatingAd | null;
}

export function FavoritesTab({
  session,
  userProfile,
}: FavoritesTabProps) {
  return session ? (
    <FavoritesView userProfile={userProfile || null} />
  ) : (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-black/20 rounded-xl min-h-[300px]">
      <Heart className="h-12 w-12 text-luxury-primary/40 mb-4" />
      <h3 className="text-xl font-bold text-luxury-primary mb-2">Sign in to View Favorites</h3>
      <p className="text-luxury-neutral/60 max-w-md">
        Please sign in to save and view your favorite profiles.
      </p>
    </div>
  );
}
