import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useExportLimit } from '@/hooks/useExportLimit';
import { 
  EroboardPdfExporter, 
  EroboardPdfData, 
  UserProfile, 
  recordExport 
} from '@/utils/eroboardPdfExporter';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ExportButtonProps {
  data: EroboardPdfData;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ 
  data, 
  variant = 'default', 
  size = 'default',
  className = ''
}) => {
  const { session } = useAuth();
  const { toast } = useToast();
  const { canExport, exportCount, exportLimit, remainingExports, loading, refreshLimit } = useExportLimit();
  const [isExporting, setIsExporting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const getUserProfile = async (): Promise<UserProfile | null> => {
    if (!session?.user?.id) return null;

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('username, location')
        .eq('id', session.user.id)
        .single();

      if (error || !profile) {
        console.error('Error fetching user profile:', error);
        return {
          id: session.user.id,
          username: session.user.email?.split('@')[0] || 'User',
          country: 'Unknown'
        };
      }

      return {
        id: session.user.id,
        username: profile.username || session.user.email?.split('@')[0] || 'User',
        country: profile.location || 'Unknown'
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return {
        id: session.user.id,
        username: session.user.email?.split('@')[0] || 'User',
        country: 'Unknown'
      };
    }
  };

  const handleExport = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to export analytics",
        variant: "destructive"
      });
      return;
    }

    if (!canExport) {
      toast({
        title: "Export Limit Reached",
        description: `You have reached your monthly limit of ${exportLimit} exports. Limit resets next month.`,
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);
    setShowDialog(false);

    try {
      // Get user profile data
      const userProfile = await getUserProfile();
      if (!userProfile) {
        throw new Error('Failed to get user profile');
      }

      // Generate PDF
      const exporter = new EroboardPdfExporter();
      const pdfBlob = await exporter.generatePDF(data, userProfile);

      // Record the export
      await recordExport(session.user.id, pdfBlob.size, {
        exported_at: new Date().toISOString(),
        username: userProfile.username,
        country: userProfile.country,
        total_earnings: data.stats.totalEarnings,
        total_followers: data.stats.followers,
        total_content: data.stats.totalContent
      });

      // Download the PDF
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Eroxr-Analytics-${userProfile.username}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Refresh export limit
      refreshLimit();

      toast({
        title: "Export Successful!",
        description: `Your analytics report has been downloaded. ${remainingExports - 1} exports remaining this month.`,
        variant: "default"
      });

    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "There was an error generating your analytics report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleClick = () => {
    if (!canExport) {
      toast({
        title: "Export Limit Reached",
        description: `You have used all ${exportLimit} exports this month. Limit resets next month.`,
        variant: "destructive"
      });
      return;
    }
    setShowDialog(true);
  };

  if (loading) {
    return (
      <Button variant={variant} size={size} className={className} disabled>
        <Download className="h-4 w-4 mr-2" />
        Loading...
      </Button>
    );
  }

  return (
    <>
      <div className="relative">
        <Button 
          variant={variant} 
          size={size} 
          className={`${className} ${!canExport ? 'opacity-60' : ''}`}
          onClick={handleClick}
          disabled={isExporting || !session?.user?.id}
        >
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
        
        {/* Export counter badge */}
        <Badge 
          variant={canExport ? "secondary" : "destructive"} 
          className="absolute -top-2 -right-2 text-xs px-1 min-w-[20px] h-5"
        >
          {exportCount}/{exportLimit}
        </Badge>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Export Analytics Report
            </DialogTitle>
            <DialogDescription>
              Generate a comprehensive PDF report of your EroBoard analytics with detailed insights and Eroxr branding.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Export Limit</span>
                <Badge variant={canExport ? "default" : "destructive"}>
                  {exportCount}/{exportLimit} used
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Remaining</span>
                <span className="text-sm text-muted-foreground">
                  {remainingExports} exports this month
                </span>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Report Includes:
                  </p>
                  <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Complete earnings breakdown and timeline</li>
                    <li>• Content performance analytics</li>
                    <li>• Geographic audience insights</li>
                    <li>• Growth metrics and conversion funnel</li>
                    <li>• Professional Eroxr branding</li>
                  </ul>
                </div>
              </div>
            </div>

            {!canExport && (
              <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-900 dark:text-red-100">
                      Export Limit Reached
                    </p>
                    <p className="text-xs text-red-800 dark:text-red-200 mt-1">
                      You have used all {exportLimit} exports for this month. Your limit will reset next month.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleExport} 
                disabled={!canExport || isExporting}
                className="min-w-[100px]"
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};