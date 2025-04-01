import React from "react";
import { User, Filter, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { ProfileData } from "./types";

interface UserHeaderProps {
  profile: ProfileData;
  timeRange: string;
  setTimeRange: (range: string) => void;
  onNavigateBack: () => void;
}

export const UserHeader: React.FC<UserHeaderProps> = ({ 
  profile, 
  timeRange, 
  setTimeRange, 
  onNavigateBack 
}) => {
  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={onNavigateBack}
        className="rounded-full"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12 border-2 border-purple-500/50">
          <AvatarImage src={profile.avatar_url || undefined} alt={profile.username || "User"} />
          <AvatarFallback>{profile.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
        </Avatar>
        
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            {profile.username || "Unnamed User"}
            <Badge 
              variant="outline" 
              className={
                profile.user_roles.role === 'super_admin' 
                  ? 'border-purple-500 text-purple-500' 
                  : profile.user_roles.role === 'creator' 
                    ? 'border-blue-500 text-blue-500' 
                    : 'border-gray-500 text-gray-500'
              }
            >
              {profile.user_roles.role}
            </Badge>
            {profile.is_suspended && (
              <Badge variant="destructive">Banned</Badge>
            )}
          </h2>
          <p className="text-sm text-muted-foreground">
            {profile.first_name && profile.last_name 
              ? `${profile.first_name} ${profile.last_name} · ` 
              : ""}
            Member since {format(new Date(profile.created_at), "MMM d, yyyy")}
          </p>
        </div>
      </div>
      
      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-[#0D1117]/50">
              <Filter className="mr-2 h-4 w-4" />
              Last {timeRange} Days
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTimeRange("7")}>
              Last 7 Days
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTimeRange("30")}>
              Last 30 Days
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTimeRange("90")}>
              Last 90 Days
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
