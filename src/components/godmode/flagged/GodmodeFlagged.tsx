import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdminSession } from '@/contexts/AdminSessionContext';
import { Flag, Eye, Ban, CheckCircle, AlertTriangle, FileImage, Video, MessageSquare, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface FlaggedData {
  id: string;
  content_id: string;
  content_type: 'post' | 'message' | 'profile' | 'stream';
  user_id?: string;
  username?: string;
  avatar_url?: string;
  reason: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'flagged' | 'reviewing' | 'resolved' | 'dismissed';
  flagged_at: string;
  flagged_by?: string;
  resolved_at?: string;
  resolved_by?: string;
  notes?: string;
}

interface FlaggedStats {
  total_flags: number;
  pending_flags: number;
  resolved_flags: number;
  dismissed_flags: number;
  high_priority: number;
  today_flags: number;
}

export const GodmodeFlagged: React.FC = () => {
  const { isGhostMode, logGhostAction } = useAdminSession();
  const [flaggedContent, setFlaggedContent] = useState<FlaggedData[]>([]);
  const [stats, setStats] = useState<FlaggedStats>({
    total_flags: 0,
    pending_flags: 0,
    resolved_flags: 0,
    dismissed_flags: 0,
    high_priority: 0,
    today_flags: 0
  });
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'flagged' | 'reviewing' | 'resolved' | 'dismissed'>('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchFlaggedContent = async () => {
    try {
      const { data: flagged } = await supabase
        .from('flagged_content')
        .select(`
          id,
          content_id,
          content_type,
          user_id,
          reason,
          severity,
          status,
          flagged_at,
          flagged_by,
          resolved_at,
          resolved_by,
          notes,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .order('flagged_at', { ascending: false });

      const formattedFlagged: FlaggedData[] = flagged?.map(item => ({
        id: item.id,
        content_id: item.content_id,
        content_type: item.content_type as any,
        user_id: item.user_id,
        username: (item.profiles as any)?.username || 'Unknown',
        avatar_url: (item.profiles as any)?.avatar_url,
        reason: item.reason,
        severity: item.severity,
        status: item.status,
        flagged_at: item.flagged_at,
        flagged_by: item.flagged_by,
        resolved_at: item.resolved_at,
        resolved_by: item.resolved_by,
        notes: item.notes
      })) || [];

      setFlaggedContent(formattedFlagged);

      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const newStats: FlaggedStats = {
        total_flags: formattedFlagged.length,
        pending_flags: formattedFlagged.filter(f => f.status === 'flagged' || f.status === 'reviewing').length,
        resolved_flags: formattedFlagged.filter(f => f.status === 'resolved').length,
        dismissed_flags: formattedFlagged.filter(f => f.status === 'dismissed').length,
        high_priority: formattedFlagged.filter(f => f.severity === 'high' || f.severity === 'critical').length,
        today_flags: formattedFlagged.filter(f => f.flagged_at.startsWith(today)).length
      };

      setStats(newStats);
    } catch (error) {
      console.error('Error fetching flagged content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFlaggedContent();

    // Real-time updates
    const channel = supabase
      .channel('flagged_content_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'flagged_content' }, fetchFlaggedContent)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleFlagAction = async (flagId: string, action: 'resolve' | 'dismiss' | 'escalate', notes?: string) => {
    if (isGhostMode) {
      await logGhostAction(`Flag ${action}`, 'flagged_content', flagId, { action, notes, timestamp: new Date().toISOString() });
    }

    try {
      const updateData: any = {
        status: action === 'resolve' ? 'resolved' : action === 'dismiss' ? 'dismissed' : 'reviewing'
      };

      if (action === 'resolve' || action === 'dismiss') {
        updateData.resolved_at = new Date().toISOString();
        updateData.resolved_by = 'admin'; // Would be actual admin ID
      }

      if (notes) {
        updateData.notes = notes;
      }

      const { error } = await supabase
        .from('flagged_content')
        .update(updateData)
        .eq('id', flagId);

      if (error) throw error;
      fetchFlaggedContent();
    } catch (error) {
      console.error('Error updating flag:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-500';
      case 'dismissed': return 'bg-gray-500';
      case 'reviewing': return 'bg-blue-500';
      case 'flagged': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'post': return <FileImage className="h-4 w-4" />;
      case 'message': return <MessageSquare className="h-4 w-4" />;
      case 'profile': return <User className="h-4 w-4" />;
      case 'stream': return <Video className="h-4 w-4" />;
      default: return <Flag className="h-4 w-4" />;
    }
  };

  const filteredContent = flaggedContent.filter(item => {
    const matchesSeverity = filterSeverity === 'all' || item.severity === filterSeverity;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSeverity && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Flagged Content</h1>
          <p className="text-gray-400">Review and moderate flagged content</p>
        </div>
        {isGhostMode && (
          <div className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg">
            <Eye className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-purple-300">Ghost Mode Active</span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Flags</p>
                <p className="text-2xl font-bold text-white">{stats.total_flags}</p>
              </div>
              <Flag className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.pending_flags}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Resolved</p>
                <p className="text-2xl font-bold text-green-400">{stats.resolved_flags}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Dismissed</p>
                <p className="text-2xl font-bold text-gray-400">{stats.dismissed_flags}</p>
              </div>
              <Ban className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">High Priority</p>
                <p className="text-2xl font-bold text-red-400">{stats.high_priority}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Today</p>
                <p className="text-2xl font-bold text-purple-400">{stats.today_flags}</p>
              </div>
              <Flag className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex gap-2">
          <span className="text-sm text-gray-400 self-center">Severity:</span>
          {['all', 'critical', 'high', 'medium', 'low'].map(severity => (
            <Button
              key={severity}
              variant={filterSeverity === severity ? 'default' : 'outline'}
              onClick={() => setFilterSeverity(severity as any)}
              size="sm"
            >
              {severity.charAt(0).toUpperCase() + severity.slice(1)}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <span className="text-sm text-gray-400 self-center">Status:</span>
          {['all', 'flagged', 'reviewing', 'resolved', 'dismissed'].map(status => (
            <Button
              key={status}
              variant={filterStatus === status ? 'default' : 'outline'}
              onClick={() => setFilterStatus(status as any)}
              size="sm"
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Flagged Content Table */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Flagged Content ({filteredContent.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Content</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">User</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Reason</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Severity</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Flagged</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContent.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getContentTypeIcon(item.content_type)}
                        <div>
                          <p className="text-white font-medium capitalize">{item.content_type}</p>
                          <p className="text-xs text-gray-400">ID: {item.content_id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={item.avatar_url} />
                          <AvatarFallback className="bg-purple-500 text-white text-xs">
                            {item.username?.[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-white text-sm">{item.username}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-white text-sm">{item.reason}</span>
                    </td>
                    <td className="p-4">
                      <Badge className={`${getSeverityColor(item.severity)} text-white border-none`}>
                        {item.severity.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={`${getStatusColor(item.status)} text-white border-none`}>
                        {item.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-400 text-sm">
                        {new Date(item.flagged_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        {(item.status === 'flagged' || item.status === 'reviewing') && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleFlagAction(item.id, 'resolve')}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Resolve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleFlagAction(item.id, 'dismiss')}
                              className="border-gray-500 text-gray-400 hover:bg-gray-500 hover:text-white"
                            >
                              <Ban className="h-4 w-4 mr-1" />
                              Dismiss
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
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