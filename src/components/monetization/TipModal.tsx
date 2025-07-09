import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, DollarSign, Zap, Gift } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface TipModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: string;
  recipientName: string;
  contentId?: string;
  contentType?: 'post' | 'message' | 'general';
}

const PRESET_AMOUNTS = [5, 10, 25, 50, 100];

export const TipModal = ({
  isOpen,
  onClose,
  recipientId,
  recipientName,
  contentId,
  contentType = 'general'
}: TipModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [amount, setAmount] = useState<number | string>('');
  const [message, setMessage] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);

  const sendTipMutation = useMutation({
    mutationFn: async () => {
      if (!user || !amount) throw new Error('Missing required data');

      const tipAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
      if (tipAmount <= 0) throw new Error('Invalid amount');

      const { data, error } = await supabase
        .from('tips')
        .insert({
          sender_id: user.id,
          recipient_id: recipientId,
          amount: tipAmount,
          message: message.trim() || null,
          tip_type: contentType,
          content_id: contentId || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Create notification for recipient
      await supabase
        .from('notifications')
        .insert({
          user_id: recipientId,
          type: 'tip',
          title: 'New Tip Received!',
          content: `${user.user_metadata?.username || 'Someone'} sent you a $${tipAmount} tip${message ? ': ' + message : ''}`,
          data: {
            tip_id: data.id,
            sender_id: user.id,
            amount: tipAmount,
            content_id: contentId
          }
        });

      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Tip Sent!',
        description: `Successfully sent $${amount} to ${recipientName}`,
      });
      
      // Reset form
      setAmount('');
      setMessage('');
      setSelectedPreset(null);
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['tips'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: 'Tip Failed',
        description: error.message || 'Failed to send tip. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handlePresetSelect = (presetAmount: number) => {
    setAmount(presetAmount);
    setSelectedPreset(presetAmount);
  };

  const handleCustomAmount = (value: string) => {
    setAmount(value);
    setSelectedPreset(null);
  };

  const handleSendTip = () => {
    if (!amount || parseFloat(amount.toString()) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid tip amount',
        variant: 'destructive',
      });
      return;
    }

    sendTipMutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Gift className="w-6 h-6 text-yellow-500" />
            Send Tip to {recipientName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Preset Amounts */}
          <div>
            <label className="text-sm font-medium mb-3 block">Quick Select</label>
            <div className="grid grid-cols-5 gap-2">
              {PRESET_AMOUNTS.map((presetAmount) => (
                <Button
                  key={presetAmount}
                  variant={selectedPreset === presetAmount ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePresetSelect(presetAmount)}
                  className="flex flex-col h-12"
                >
                  <DollarSign className="w-3 h-3" />
                  <span className="text-xs">{presetAmount}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div>
            <label className="text-sm font-medium mb-2 block">Custom Amount</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="number"
                value={amount}
                onChange={(e) => handleCustomAmount(e.target.value)}
                placeholder="Enter amount"
                className="pl-10"
                min="1"
                step="0.01"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="text-sm font-medium mb-2 block">Message (Optional)</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal message..."
              className="resize-none"
              maxLength={200}
            />
            <div className="text-xs text-muted-foreground mt-1 text-right">
              {message.length}/200
            </div>
          </div>

          {/* Content Context */}
          {contentType !== 'general' && (
            <div className="bg-muted rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline" className="capitalize">
                  {contentType} tip
                </Badge>
                <span className="text-muted-foreground">
                  This tip is for specific content
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={sendTipMutation.isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendTip}
              disabled={!amount || sendTipMutation.isLoading}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
            >
              {sendTipMutation.isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Send ${amount || '0'}
                </div>
              )}
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="text-xs text-muted-foreground text-center bg-muted/50 rounded p-2">
            <Heart className="w-3 h-3 inline mr-1" />
            Tips help support creators and show appreciation for their content
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};