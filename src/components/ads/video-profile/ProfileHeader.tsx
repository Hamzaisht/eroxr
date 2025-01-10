import { Crown, CheckCircle2, MapPin, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DatingAd } from "../types/dating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  ad: DatingAd;
}

export const ProfileHeader = ({ ad }: ProfileHeaderProps) => {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 ring-2 ring-luxury-primary/20 ring-offset-2 ring-offset-luxury-dark">
          <AvatarImage src={ad.avatar_url || undefined} />
          <AvatarFallback className="bg-luxury-primary/10">
            {ad.title.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            {ad.title}
            {ad.is_premium && (
              <Crown className="h-5 w-5 text-yellow-500 animate-pulse" />
            )}
            {ad.is_verified && (
              <CheckCircle2 className="h-5 w-5 text-luxury-primary" />
            )}
          </h2>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-sm text-luxury-neutral">
              <MapPin className="h-4 w-4 text-luxury-primary" />
              <span>{ad.city}, {ad.country}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-luxury-neutral/80">
              <User className="h-4 w-4 text-luxury-primary/80" />
              <span>@{ad.user_id?.split('-')[0]}</span>
            </div>
          </div>
        </div>
      </div>
      <div className={cn(
        "w-3 h-3 rounded-full animate-pulse",
        ad.last_active ? "bg-green-500" : "bg-gray-500"
      )} />
    </div>
  );
};