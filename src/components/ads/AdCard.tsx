import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, User, Calendar, Shield, Crown, Clock, Briefcase, GraduationCap, Languages } from "lucide-react";
import { type DatingAd } from "./types/dating";
import { formatDistanceToNow } from "date-fns";

interface AdCardProps {
  ad: DatingAd;
}

export const AdCard = ({ ad }: AdCardProps) => {
  return (
    <Card className="group relative overflow-hidden bg-[#1A1F2C]/50 backdrop-blur-sm border-none text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {ad.is_premium && (
        <div className="absolute top-2 right-2 z-10">
          <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-black border-none text-xs py-0.5">
            <Crown className="w-3 h-3 mr-1" />
            Premium
          </Badge>
        </div>
      )}
      
      {ad.is_verified && (
        <div className="absolute top-2 left-2 z-10">
          <Badge className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white border-none text-xs py-0.5">
            <Shield className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        </div>
      )}

      <div className="p-3">
        <div className="space-y-3">
          <div>
            <h3 className="text-base font-semibold mb-1 bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] bg-clip-text text-transparent line-clamp-1">
              {ad.title}
            </h3>
            <div className="flex flex-wrap gap-1">
              <Badge variant="secondary" className="capitalize bg-[#2D2A34]/50 text-[#9b87f5] border-none text-xs">
                {ad.relationship_status}
              </Badge>
              {ad.body_type && (
                <Badge variant="secondary" className="capitalize bg-[#2D2A34]/50 text-[#9b87f5] border-none text-xs">
                  {ad.body_type.replace('_', ' ')}
                </Badge>
              )}
              {ad.profile_completion_score && ad.profile_completion_score >= 80 && (
                <Badge variant="secondary" className="bg-[#2D2A34]/50 text-emerald-400 border-none text-xs">
                  Complete Profile
                </Badge>
              )}
            </div>
          </div>

          <p className="text-gray-300 text-sm line-clamp-2">{ad.description}</p>

          <AdCardDetails ad={ad} />

          <Button size="sm" className="w-full bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] hover:from-[#7E69AB] hover:to-[#9b87f5] border-none transition-all duration-300 text-xs">
            View Profile
          </Button>
        </div>
      </div>
    </Card>
  );
};

const AdCardDetails = ({ ad }: AdCardProps) => {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 text-xs text-gray-300">
        <MapPin className="h-3 w-3 text-[#9b87f5]" />
        <span className="capitalize">{ad.city}, {ad.country}</span>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-gray-300">
        <User className="h-3 w-3 text-[#9b87f5]" />
        <span className="capitalize">Looking for: {ad.looking_for.join(", ")}</span>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-gray-300">
        <Calendar className="h-3 w-3 text-[#9b87f5]" />
        Age range: {ad.age_range.lower} - {ad.age_range.upper}
      </div>
      {ad.occupation && (
        <div className="flex items-center gap-1.5 text-xs text-gray-300">
          <Briefcase className="h-3 w-3 text-[#9b87f5]" />
          {ad.occupation}
        </div>
      )}
      {ad.education_level && (
        <div className="flex items-center gap-1.5 text-xs text-gray-300">
          <GraduationCap className="h-3 w-3 text-[#9b87f5]" />
          {ad.education_level.replace('_', ' ')}
        </div>
      )}
      {ad.languages && ad.languages.length > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-gray-300">
          <Languages className="h-3 w-3 text-[#9b87f5]" />
          {ad.languages.join(", ")}
        </div>
      )}
      {ad.last_active && (
        <div className="flex items-center gap-1.5 text-xs text-gray-300">
          <Clock className="h-3 w-3 text-[#9b87f5]" />
          Active {formatDistanceToNow(new Date(ad.last_active), { addSuffix: true })}
        </div>
      )}
    </div>
  );
};