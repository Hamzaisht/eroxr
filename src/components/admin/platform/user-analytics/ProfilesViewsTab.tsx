
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TabProps, Analytics } from "./types";

interface ProfilesViewsTabProps extends TabProps {
  navigate: (path: string) => void;
}

export const ProfilesViewsTab: React.FC<ProfilesViewsTabProps> = ({ analytics, navigate, timeRange }) => {
  return (
    <div className="space-y-6">
      <Card className="bg-[#0D1117]/60 border-white/10">
        <CardHeader>
          <CardTitle className="text-lg">Most Viewed Profiles</CardTitle>
          <CardDescription>
            Creators this user engages with most frequently
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.topProfiles.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Creator</TableHead>
                  <TableHead>View Count</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.topProfiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={profile.avatar_url || undefined} alt={profile.username} />
                          <AvatarFallback>{profile.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{profile.username}</span>
                      </div>
                    </TableCell>
                    <TableCell>{profile.count}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 bg-purple-900/30 rounded-full w-24">
                          <div 
                            className="h-2 bg-purple-500 rounded-full" 
                            style={{ 
                              width: `${(profile.count / analytics.topProfiles[0].count) * 100}%`
                            }}
                          />
                        </div>
                        <span className="text-sm">
                          {Math.round((profile.count / analytics.totalViews) * 100)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-[#0D1117]/50"
                        onClick={() => navigate(`/profile/${profile.id}`)}
                      >
                        <User className="mr-1 h-3.5 w-3.5" />
                        View Profile
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center p-8 text-muted-foreground">
              No profile view data available for this time period
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
