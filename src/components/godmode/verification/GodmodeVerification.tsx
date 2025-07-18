import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdminSession } from '@/contexts/AdminSessionContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  FileText, 
  Image,
  Calendar,
  MapPin,
  Link,
  Eye
} from 'lucide-react';

interface VerificationRequest {
  id: string;
  user_id: string;
  full_name: string;
  date_of_birth: string;
  account_type: string;
  government_id_type: string;
  government_id_url: string;
  selfie_url: string;
  registered_address: any;
  social_media_links?: any;
  status: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  rejection_reason?: string;
  admin_notes?: string;
  terms_accepted: boolean;
  privacy_policy_accepted: boolean;
  community_guidelines_accepted: boolean;
}

export const GodmodeVerification: React.FC = () => {
  const { isGhostMode, logGhostAction } = useAdminSession();
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchVerificationRequests();
  }, []);

  const fetchVerificationRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('creator_verification_requests')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching verification requests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch verification requests",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (requestId: string, status: 'approved' | 'rejected') => {
    setProcessing(true);
    try {
      const updateData: any = {
        status,
        reviewed_at: new Date().toISOString(),
        reviewed_by: 'admin', // In real app, this would be the actual admin ID
        admin_notes: adminNotes || null
      };

      if (status === 'rejected') {
        updateData.rejection_reason = rejectionReason;
      }

      const { error } = await supabase
        .from('creator_verification_requests')
        .update(updateData)
        .eq('id', requestId);

      if (error) throw error;

      // Update profile verification status if approved
      if (status === 'approved' && selectedRequest) {
        await supabase
          .from('profiles')
          .update({ is_verified: true })
          .eq('id', selectedRequest.user_id);
      }

      await fetchVerificationRequests();
      setSelectedRequest(null);
      setAdminNotes('');
      setRejectionReason('');

      if (isGhostMode) {
        logGhostAction(`${status} creator verification for user ${selectedRequest?.user_id}`);
      }

      toast({
        title: "Success",
        description: `Verification request ${status}`,
      });
    } catch (error) {
      console.error('Error updating verification request:', error);
      toast({
        title: "Error",
        description: "Failed to update verification request",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white">Loading verification requests...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Creator Verification</h1>
        <div className="text-sm text-gray-400">
          {requests.filter(r => r.status === 'pending').length} pending requests
        </div>
      </div>

      {selectedRequest ? (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Verification Details</CardTitle>
              <div className="flex items-center gap-2">
                {getStatusBadge(selectedRequest.status)}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedRequest(null)}
                  className="text-white border-slate-600"
                >
                  Back to List
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                <div className="text-white bg-slate-700/50 p-3 rounded-md">
                  {selectedRequest.full_name}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date of Birth
                </label>
                <div className="text-white bg-slate-700/50 p-3 rounded-md">
                  {new Date(selectedRequest.date_of_birth).toLocaleDateString()}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Account Type
                </label>
                <div className="text-white bg-slate-700/50 p-3 rounded-md">
                  {selectedRequest.account_type}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  ID Type
                </label>
                <div className="text-white bg-slate-700/50 p-3 rounded-md">
                  {selectedRequest.government_id_type}
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Registered Address
              </label>
              <div className="text-white bg-slate-700/50 p-3 rounded-md">
                {selectedRequest.registered_address && (
                  <div>
                    {selectedRequest.registered_address.street}<br />
                    {selectedRequest.registered_address.city}, {selectedRequest.registered_address.state} {selectedRequest.registered_address.postal_code}<br />
                    {selectedRequest.registered_address.country}
                  </div>
                )}
              </div>
            </div>

            {/* Documents */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Government ID
                </label>
                <Button
                  variant="outline"
                  className="w-full text-white border-slate-600 hover:bg-slate-700"
                  onClick={() => window.open(selectedRequest.government_id_url, '_blank')}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Document
                </Button>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  Selfie Verification
                </label>
                <Button
                  variant="outline"
                  className="w-full text-white border-slate-600 hover:bg-slate-700"
                  onClick={() => window.open(selectedRequest.selfie_url, '_blank')}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Selfie
                </Button>
              </div>
            </div>

            {/* Social Media Links */}
            {selectedRequest.social_media_links && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Link className="w-4 h-4" />
                  Social Media Links
                </label>
                <div className="bg-slate-700/50 p-3 rounded-md">
                  {Object.entries(selectedRequest.social_media_links).map(([platform, url]) => (
                    <div key={platform} className="flex justify-between items-center">
                      <span className="text-gray-300 capitalize">{platform}:</span>
                      <a 
                        href={url as string} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        View Profile
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Legal Acceptance */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Legal Acceptance</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className={`p-3 rounded-md ${selectedRequest.terms_accepted ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  Terms: {selectedRequest.terms_accepted ? 'Accepted' : 'Not Accepted'}
                </div>
                <div className={`p-3 rounded-md ${selectedRequest.privacy_policy_accepted ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  Privacy: {selectedRequest.privacy_policy_accepted ? 'Accepted' : 'Not Accepted'}
                </div>
                <div className={`p-3 rounded-md ${selectedRequest.community_guidelines_accepted ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  Guidelines: {selectedRequest.community_guidelines_accepted ? 'Accepted' : 'Not Accepted'}
                </div>
              </div>
            </div>

            {/* Review Section */}
            {selectedRequest.status === 'pending' && (
              <div className="space-y-4 pt-6 border-t border-slate-700">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Admin Notes</label>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add any notes about this verification..."
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Rejection Reason (if rejecting)</label>
                  <Textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Reason for rejection (required if rejecting)..."
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => handleReview(selectedRequest.id, 'approved')}
                    disabled={processing}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleReview(selectedRequest.id, 'rejected')}
                    disabled={processing || !rejectionReason.trim()}
                    variant="destructive"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            )}

            {/* Previous Review Info */}
            {selectedRequest.status !== 'pending' && (
              <div className="space-y-2 pt-6 border-t border-slate-700">
                <label className="text-sm font-medium text-gray-300">Review Information</label>
                <div className="bg-slate-700/50 p-3 rounded-md space-y-2">
                  <div className="text-white">Reviewed at: {selectedRequest.reviewed_at ? new Date(selectedRequest.reviewed_at).toLocaleString() : 'N/A'}</div>
                  {selectedRequest.admin_notes && (
                    <div className="text-gray-300">Notes: {selectedRequest.admin_notes}</div>
                  )}
                  {selectedRequest.rejection_reason && (
                    <div className="text-red-400">Rejection reason: {selectedRequest.rejection_reason}</div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => (
            <Card key={request.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-white font-medium">{request.full_name}</h3>
                      {getStatusBadge(request.status)}
                    </div>
                    <div className="text-sm text-gray-400">
                      Account Type: {request.account_type} • Submitted: {new Date(request.submitted_at).toLocaleDateString()}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedRequest(request)}
                    className="text-white border-slate-600 hover:bg-slate-700"
                  >
                    Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {requests.length === 0 && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-8 text-center">
                <div className="text-gray-400">No verification requests found</div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};