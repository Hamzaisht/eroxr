import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdminSession } from '@/contexts/AdminSessionContext';
import { Shield, CheckCircle, X, Clock, Eye, FileText, User, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface VerificationData {
  id: string;
  user_id: string;
  username?: string;
  avatar_url?: string;
  document_type: string;
  document_url: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  verified_at?: string;
  rejected_reason?: string;
}

interface VerificationStats {
  total_requests: number;
  pending_requests: number;
  approved_requests: number;
  rejected_requests: number;
  today_submissions: number;
  avg_processing_time: number;
}

export const GodmodeVerification: React.FC = () => {
  const { isGhostMode, logGhostAction } = useAdminSession();
  const [verifications, setVerifications] = useState<VerificationData[]>([]);
  const [stats, setStats] = useState<VerificationStats>({
    total_requests: 0,
    pending_requests: 0,
    approved_requests: 0,
    rejected_requests: 0,
    today_submissions: 0,
    avg_processing_time: 0
  });
  const [selectedVerification, setSelectedVerification] = useState<VerificationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVerifications = async () => {
    try {
      const { data: verifications } = await supabase
        .from('id_verifications')
        .select(`
          id,
          user_id,
          document_type,
          document_url,
          status,
          submitted_at,
          verified_at,
          rejected_reason,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .order('submitted_at', { ascending: false });

      const formattedVerifications: VerificationData[] = verifications?.map(verification => ({
        id: verification.id,
        user_id: verification.user_id,
        username: (verification.profiles as any)?.username || 'Unknown',
        avatar_url: (verification.profiles as any)?.avatar_url,
        document_type: verification.document_type,
        document_url: verification.document_url,
        status: verification.status,
        submitted_at: verification.submitted_at,
        verified_at: verification.verified_at,
        rejected_reason: verification.rejected_reason
      })) || [];

      setVerifications(formattedVerifications);

      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const todaySubmissions = formattedVerifications.filter(v => 
        v.submitted_at.startsWith(today)
      );

      const newStats: VerificationStats = {
        total_requests: formattedVerifications.length,
        pending_requests: formattedVerifications.filter(v => v.status === 'pending').length,
        approved_requests: formattedVerifications.filter(v => v.status === 'approved').length,
        rejected_requests: formattedVerifications.filter(v => v.status === 'rejected').length,
        today_submissions: todaySubmissions.length,
        avg_processing_time: 2.5 // Mock average hours
      };

      setStats(newStats);
    } catch (error) {
      console.error('Error fetching verifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();

    // Real-time updates
    const channel = supabase
      .channel('id_verifications_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'id_verifications' }, fetchVerifications)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleVerificationAction = async (verificationId: string, action: 'approve' | 'reject', reason?: string) => {
    if (isGhostMode) {
      await logGhostAction(`Verification ${action}`, 'verification', verificationId, { action, reason, timestamp: new Date().toISOString() });
    }

    try {
      const updateData: any = {
        status: action === 'approve' ? 'approved' : 'rejected'
      };

      if (action === 'approve') {
        updateData.verified_at = new Date().toISOString();
      } else if (reason) {
        updateData.rejected_reason = reason;
      }

      const { error } = await supabase
        .from('id_verifications')
        .update(updateData)
        .eq('id', verificationId);

      if (error) throw error;

      // If approved, update user's verification status
      if (action === 'approve') {
        const verification = verifications.find(v => v.id === verificationId);
        if (verification) {
          await supabase
            .from('profiles')
            .update({ is_verified: true })
            .eq('id', verification.user_id);
        }
      }

      fetchVerifications();
    } catch (error) {
      console.error('Error updating verification:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <X className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getDocumentTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'passport':
      case 'driver_license':
      case 'id_card':
        return <FileText className="h-4 w-4 text-blue-400" />;
      default:
        return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">ID Verification</h1>
          <p className="text-gray-400">Review and approve user identity verifications</p>
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
                <p className="text-sm text-gray-400">Total Requests</p>
                <p className="text-2xl font-bold text-white">{stats.total_requests}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.pending_requests}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Approved</p>
                <p className="text-2xl font-bold text-green-400">{stats.approved_requests}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Rejected</p>
                <p className="text-2xl font-bold text-red-400">{stats.rejected_requests}</p>
              </div>
              <X className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Today</p>
                <p className="text-2xl font-bold text-purple-400">{stats.today_submissions}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Avg. Time</p>
                <p className="text-2xl font-bold text-cyan-400">{stats.avg_processing_time}h</p>
              </div>
              <Clock className="h-8 w-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verification Requests Table */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Verification Requests</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">User</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Document</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Submitted</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Processed</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {verifications.map((verification) => (
                  <tr key={verification.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={verification.avatar_url} />
                          <AvatarFallback className="bg-purple-500 text-white">
                            {verification.username?.[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white font-medium">{verification.username}</p>
                          <p className="text-xs text-gray-400">ID: {verification.user_id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getDocumentTypeIcon(verification.document_type)}
                        <span className="text-white capitalize">{verification.document_type.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={`${getStatusColor(verification.status)} text-white border-none`}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(verification.status)}
                          {verification.status.toUpperCase()}
                        </div>
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-400 text-sm">
                        {new Date(verification.submitted_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-400 text-sm">
                        {verification.verified_at 
                          ? new Date(verification.verified_at).toLocaleDateString()
                          : 'N/A'
                        }
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        {verification.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleVerificationAction(verification.id, 'approve')}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleVerificationAction(verification.id, 'reject', 'Document unclear')}
                              className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedVerification(verification)}
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