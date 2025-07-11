import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdminSession } from '@/contexts/AdminSessionContext';
import { DollarSign, CheckCircle, Clock, X, Eye, TrendingUp, CreditCard, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface PayoutData {
  id: string;
  creator_id: string;
  username?: string;
  avatar_url?: string;
  amount: number;
  platform_fee: number;
  final_amount: number;
  status: 'pending' | 'approved' | 'processed' | 'rejected';
  requested_at: string;
  approved_at?: string;
  processed_at?: string;
  processed_by?: string;
  notes?: string;
}

interface PayoutStats {
  total_requests: number;
  pending_requests: number;
  approved_requests: number;
  processed_requests: number;
  total_amount_pending: number;
  total_amount_processed: number;
  platform_fees_collected: number;
}

export const GodmodePayouts: React.FC = () => {
  const { isGhostMode, logGhostAction } = useAdminSession();
  const [payouts, setPayouts] = useState<PayoutData[]>([]);
  const [stats, setStats] = useState<PayoutStats>({
    total_requests: 0,
    pending_requests: 0,
    approved_requests: 0,
    processed_requests: 0,
    total_amount_pending: 0,
    total_amount_processed: 0,
    platform_fees_collected: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchPayouts = async () => {
    try {
      const { data: payouts } = await supabase
        .from('payout_requests')
        .select(`
          id,
          creator_id,
          amount,
          platform_fee,
          final_amount,
          status,
          requested_at,
          approved_at,
          processed_at,
          processed_by,
          notes,
          profiles:creator_id (
            username,
            avatar_url
          )
        `)
        .order('requested_at', { ascending: false });

      const formattedPayouts: PayoutData[] = payouts?.map(payout => ({
        id: payout.id,
        creator_id: payout.creator_id,
        username: (payout.profiles as any)?.username || 'Unknown',
        avatar_url: (payout.profiles as any)?.avatar_url,
        amount: payout.amount,
        platform_fee: payout.platform_fee,
        final_amount: payout.final_amount,
        status: payout.status,
        requested_at: payout.requested_at,
        approved_at: payout.approved_at,
        processed_at: payout.processed_at,
        processed_by: payout.processed_by,
        notes: payout.notes
      })) || [];

      setPayouts(formattedPayouts);

      // Calculate stats
      const newStats: PayoutStats = {
        total_requests: formattedPayouts.length,
        pending_requests: formattedPayouts.filter(p => p.status === 'pending').length,
        approved_requests: formattedPayouts.filter(p => p.status === 'approved').length,
        processed_requests: formattedPayouts.filter(p => p.status === 'processed').length,
        total_amount_pending: formattedPayouts
          .filter(p => p.status === 'pending' || p.status === 'approved')
          .reduce((sum, p) => sum + p.final_amount, 0),
        total_amount_processed: formattedPayouts
          .filter(p => p.status === 'processed')
          .reduce((sum, p) => sum + p.final_amount, 0),
        platform_fees_collected: formattedPayouts
          .reduce((sum, p) => sum + p.platform_fee, 0)
      };

      setStats(newStats);
    } catch (error) {
      console.error('Error fetching payouts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();

    // Real-time updates
    const channel = supabase
      .channel('payout_requests_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payout_requests' }, fetchPayouts)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handlePayoutAction = async (payoutId: string, action: 'approve' | 'reject' | 'process', notes?: string) => {
    if (isGhostMode) {
      await logGhostAction(`Payout ${action}`, 'payout', payoutId, { action, notes, timestamp: new Date().toISOString() });
    }

    try {
      const updateData: any = {
        status: action === 'approve' ? 'approved' : action === 'process' ? 'processed' : 'rejected'
      };

      if (action === 'approve') {
        updateData.approved_at = new Date().toISOString();
      } else if (action === 'process') {
        updateData.processed_at = new Date().toISOString();
        updateData.processed_by = 'admin'; // Would be actual admin ID
      }

      if (notes) {
        updateData.notes = notes;
      }

      const { error } = await supabase
        .from('payout_requests')
        .update(updateData)
        .eq('id', payoutId);

      if (error) throw error;
      fetchPayouts();
    } catch (error) {
      console.error('Error updating payout:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed': return 'bg-green-500';
      case 'approved': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processed': return <CheckCircle className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'rejected': return <X className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Payout Management</h1>
          <p className="text-gray-400">Process creator payouts and earnings</p>
        </div>
        {isGhostMode && (
          <div className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg">
            <Eye className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-purple-300">Ghost Mode Active</span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Requests</p>
                <p className="text-2xl font-bold text-white">{stats.total_requests}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-400" />
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
                <p className="text-2xl font-bold text-blue-400">{stats.approved_requests}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Processed</p>
                <p className="text-2xl font-bold text-green-400">{stats.processed_requests}</p>
              </div>
              <CreditCard className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Pending Amount</p>
                <p className="text-xl font-bold text-yellow-400">${stats.total_amount_pending.toLocaleString()}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Processed Amount</p>
                <p className="text-xl font-bold text-green-400">${stats.total_amount_processed.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Platform Fees</p>
                <p className="text-xl font-bold text-purple-400">${stats.platform_fees_collected.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payouts Table */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Payout Requests</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Creator</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Amount</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Platform Fee</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Final Amount</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Requested</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((payout) => (
                  <tr key={payout.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={payout.avatar_url} />
                          <AvatarFallback className="bg-purple-500 text-white">
                            {payout.username?.[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white font-medium">{payout.username}</p>
                          <p className="text-xs text-gray-400">ID: {payout.creator_id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-white font-medium">${payout.amount.toLocaleString()}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-red-400">${payout.platform_fee.toLocaleString()}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-green-400 font-medium">${payout.final_amount.toLocaleString()}</span>
                    </td>
                    <td className="p-4">
                      <Badge className={`${getStatusColor(payout.status)} text-white border-none`}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(payout.status)}
                          {payout.status.toUpperCase()}
                        </div>
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-400 text-sm">
                        {new Date(payout.requested_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        {payout.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handlePayoutAction(payout.id, 'approve')}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePayoutAction(payout.id, 'reject', 'Insufficient documentation')}
                              className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        {payout.status === 'approved' && (
                          <Button
                            size="sm"
                            onClick={() => handlePayoutAction(payout.id, 'process')}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CreditCard className="h-4 w-4 mr-1" />
                            Process
                          </Button>
                        )}
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