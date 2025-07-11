import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdminSession } from '@/contexts/AdminSessionContext';
import { Users, Search, Filter, MoreVertical, Eye, Ban, Crown, Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserData {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  created_at: string;
  last_active?: string;
  status: 'active' | 'suspended' | 'pending';
  role?: string;
  total_posts?: number;
  total_earnings?: number;
  is_verified?: boolean;
}

interface UserStats {
  total_users: number;
  active_users: number;
  suspended_users: number;
  pending_users: number;
  new_today: number;
  new_this_week: number;
  new_this_month: number;
}

export const GodmodeUsers: React.FC = () => {
  const { isGhostMode, logGhostAction } = useAdminSession();
  const [users, setUsers] = useState<UserData[]>([]);
  const [stats, setStats] = useState<UserStats>({
    total_users: 0,
    active_users: 0,
    suspended_users: 0,
    pending_users: 0,
    new_today: 0,
    new_this_week: 0,
    new_this_month: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended' | 'pending'>('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      // Get user profiles with additional data
      const { data: profiles } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          avatar_url,
          created_at,
          status,
          is_verified
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      // Get user roles
      const { data: roles } = await supabase
        .from('user_roles')
        .select('user_id, role');

      // Get creator metrics for earnings
      const { data: metrics } = await supabase
        .from('creator_metrics')
        .select('user_id, earnings');

      // Get post counts
      const { data: postCounts } = await supabase
        .from('posts')
        .select('creator_id')
        .order('created_at', { ascending: false });

      const postCountMap = postCounts?.reduce((acc, post) => {
        acc[post.creator_id] = (acc[post.creator_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const rolesMap = roles?.reduce((acc, role) => {
        acc[role.user_id] = role.role;
        return acc;
      }, {} as Record<string, string>) || {};

      const earningsMap = metrics?.reduce((acc, metric) => {
        acc[metric.user_id] = metric.earnings;
        return acc;
      }, {} as Record<string, number>) || {};

      const formattedUsers: UserData[] = profiles?.map(profile => ({
        id: profile.id,
        username: profile.username || 'Unknown',
        email: 'user@example.com', // Would need to join with auth.users in real implementation
        avatar_url: profile.avatar_url,
        created_at: profile.created_at,
        status: profile.status || 'active',
        role: rolesMap[profile.id] || 'user',
        total_posts: postCountMap[profile.id] || 0,
        total_earnings: earningsMap[profile.id] || 0,
        is_verified: profile.is_verified || false
      })) || [];

      setUsers(formattedUsers);

      // Calculate stats
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      const newStats: UserStats = {
        total_users: formattedUsers.length,
        active_users: formattedUsers.filter(u => u.status === 'active').length,
        suspended_users: formattedUsers.filter(u => u.status === 'suspended').length,
        pending_users: formattedUsers.filter(u => u.status === 'pending').length,
        new_today: formattedUsers.filter(u => new Date(u.created_at) >= today).length,
        new_this_week: formattedUsers.filter(u => new Date(u.created_at) >= weekAgo).length,
        new_this_month: formattedUsers.filter(u => new Date(u.created_at) >= monthAgo).length
      };

      setStats(newStats);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();

    // Set up real-time subscriptions
    const profilesChannel = supabase
      .channel('profiles_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchUsers)
      .subscribe();

    const rolesChannel = supabase
      .channel('user_roles_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_roles' }, fetchUsers)
      .subscribe();

    return () => {
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(rolesChannel);
    };
  }, []);

  const handleUserAction = async (userId: string, action: string) => {
    if (isGhostMode) {
      await logGhostAction(`User ${action}`, 'user', userId, { action, timestamp: new Date().toISOString() });
    }

    switch (action) {
      case 'suspend':
        // Implement suspend logic
        break;
      case 'unsuspend':
        // Implement unsuspend logic
        break;
      case 'verify':
        // Implement verify logic
        break;
      default:
        break;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'suspended': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'suspended': return <Ban className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin': return <Crown className="h-4 w-4 text-purple-400" />;
      case 'admin': return <Shield className="h-4 w-4 text-blue-400" />;
      default: return <Users className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-gray-400">Manage users, permissions, and account status</p>
        </div>
        {isGhostMode && (
          <div className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg">
            <Eye className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-purple-300">Ghost Mode Active</span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-white">{stats.total_users.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Users</p>
                <p className="text-2xl font-bold text-green-400">{stats.active_users.toLocaleString()}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Suspended</p>
                <p className="text-2xl font-bold text-red-400">{stats.suspended_users.toLocaleString()}</p>
              </div>
              <Ban className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">New Today</p>
                <p className="text-2xl font-bold text-purple-400">{stats.new_today.toLocaleString()}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users by username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('all')}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={filterStatus === 'active' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('active')}
            size="sm"
          >
            Active
          </Button>
          <Button
            variant={filterStatus === 'suspended' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('suspended')}
            size="sm"
          >
            Suspended
          </Button>
          <Button
            variant={filterStatus === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('pending')}
            size="sm"
          >
            Pending
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">User</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Role</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Posts</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Earnings</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Joined</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar_url} />
                          <AvatarFallback className="bg-purple-500 text-white">
                            {user.username[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-white font-medium">{user.username}</p>
                            {user.is_verified && (
                              <CheckCircle className="h-4 w-4 text-blue-400" />
                            )}
                          </div>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={`${getStatusColor(user.status)} text-white border-none`}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(user.status)}
                          {user.status}
                        </div>
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getRoleIcon(user.role || 'user')}
                        <span className="text-white capitalize">{user.role || 'user'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-white">{user.total_posts || 0}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-green-400">${(user.total_earnings || 0).toLocaleString()}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-400 text-sm">
                        {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUserAction(user.id, 'view')}
                        className="h-8 w-8 p-0"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};