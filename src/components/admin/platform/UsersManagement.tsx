
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  MoreHorizontal, 
  Ban, 
  User, 
  BarChart, 
  CheckCircle, 
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Profile } from "@/integrations/supabase/types/profile";
import { LoadingState } from "@/components/ui/LoadingState";

export const UsersManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("all");
  const pageSize = 10;
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch users with their roles
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-users", currentPage, searchTerm, roleFilter],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select(`
          *,
          user_roles!inner (
            role
          )
        `, { count: 'exact' });

      // Apply search filter if exists
      if (searchTerm) {
        query = query.or(`username.ilike.%${searchTerm}%,first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`);
      }
      
      // Apply role filter if not "all"
      if (roleFilter !== "all") {
        query = query.eq('user_roles.role', roleFilter);
      }

      // Apply pagination
      const from = (currentPage - 1) * pageSize;
      query = query.range(from, from + pageSize - 1).order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching users:", error);
        throw error;
      }

      return {
        users: data,
        totalCount: count || 0
      };
    },
  });

  // Handle user ban/unban
  const handleToggleBan = async (user: Profile, isBanned: boolean) => {
    try {
      // Update user suspension status
      const { error } = await supabase
        .from('profiles')
        .update({
          is_suspended: !isBanned,
          suspended_at: !isBanned ? new Date().toISOString() : null,
        })
        .eq('id', user.id);

      if (error) throw error;

      // Log the admin action
      await supabase.from('admin_audit_logs').insert({
        user_id: (await supabase.auth.getSession()).data.session?.user.id,
        action: !isBanned ? 'user_banned' : 'user_unbanned',
        details: {
          target_user_id: user.id,
          username: user.username,
          timestamp: new Date().toISOString()
        }
      });

      toast({
        title: !isBanned ? "User Banned" : "User Unbanned",
        description: `${user.username || 'User'} has been ${!isBanned ? 'banned' : 'unbanned'}.`,
      });

      refetch();
    } catch (error) {
      console.error("Error toggling user ban status:", error);
      toast({
        title: "Action Failed",
        description: "There was an error processing your request.",
        variant: "destructive",
      });
    }
  };

  // Handle role change
  const handleRoleChange = async (user: Profile, newRole: string) => {
    try {
      // Update user role
      const { error } = await supabase
        .from('user_roles')
        .update({
          role: newRole,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      // Log the admin action
      await supabase.from('admin_audit_logs').insert({
        user_id: (await supabase.auth.getSession()).data.session?.user.id,
        action: 'role_changed',
        details: {
          target_user_id: user.id,
          username: user.username,
          new_role: newRole,
          timestamp: new Date().toISOString()
        }
      });

      toast({
        title: "Role Updated",
        description: `${user.username || 'User'} is now a ${newRole}.`,
      });

      refetch();
    } catch (error) {
      console.error("Error changing user role:", error);
      toast({
        title: "Action Failed",
        description: "There was an error processing your request.",
        variant: "destructive",
      });
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil((data?.totalCount || 0) / pageSize);

  if (isLoading) {
    return <LoadingState message="Loading user data..." />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-auto sm:min-w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search users..."
            className="pl-10 bg-[#0D1117]/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-[#0D1117]/50">
                Role: {roleFilter === "all" ? "All" : roleFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setRoleFilter("all")}>All Roles</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRoleFilter("user")}>User</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRoleFilter("creator")}>Creator</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRoleFilter("super_admin")}>Super Admin</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border border-white/10 overflow-hidden">
        <Table>
          <TableHeader className="bg-[#0D1117]">
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.users.map((user: any) => (
              <TableRow key={user.id} className="border-white/5 hover:bg-[#0D1117]/50">
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                      {user.avatar_url ? (
                        <img 
                          src={user.avatar_url} 
                          alt={user.username || 'User'} 
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold">{user.username || 'Unnamed User'}</div>
                      <div className="text-xs text-muted-foreground">
                        {user.first_name && user.last_name 
                          ? `${user.first_name} ${user.last_name}` 
                          : 'No name provided'}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={
                      user.user_roles.role === 'super_admin' 
                        ? 'border-purple-500 text-purple-500' 
                        : user.user_roles.role === 'creator' 
                          ? 'border-blue-500 text-blue-500' 
                          : 'border-gray-500 text-gray-500'
                    }
                  >
                    {user.user_roles.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.is_suspended ? (
                    <Badge variant="destructive">Banned</Badge>
                  ) : (
                    <Badge variant="outline" className="border-green-500 text-green-500">Active</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {format(new Date(user.created_at), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  {user.status === 'online' ? (
                    <Badge className="bg-green-500">Online Now</Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {user.updated_at ? format(new Date(user.updated_at), 'MMM d, yyyy') : 'Unknown'}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => navigate(`/profile/${user.id}`)}
                        className="cursor-pointer"
                      >
                        <User className="mr-2 h-4 w-4" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate(`/admin/platform/analytics/${user.id}`)}
                        className="cursor-pointer"
                      >
                        <BarChart className="mr-2 h-4 w-4" />
                        View Analytics
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleToggleBan(user, user.is_suspended)}
                        className="cursor-pointer"
                      >
                        {user.is_suspended ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                            Unban User
                          </>
                        ) : (
                          <>
                            <Ban className="mr-2 h-4 w-4 text-red-500" />
                            Ban User
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="flex items-center w-full">
                            <AlertCircle className="mr-2 h-4 w-4" />
                            Change Role
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem 
                              onClick={() => handleRoleChange(user, 'user')}
                              className="cursor-pointer"
                            >
                              User
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleRoleChange(user, 'creator')}
                              className="cursor-pointer"
                            >
                              Creator
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleRoleChange(user, 'super_admin')}
                              className="cursor-pointer"
                            >
                              Super Admin
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {data?.users.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-32 text-muted-foreground">
                  No users found matching your criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, data?.totalCount || 0)} of {data?.totalCount || 0} users
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="bg-[#0D1117]/50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="bg-[#0D1117]/50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
