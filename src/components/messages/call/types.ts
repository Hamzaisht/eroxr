
export interface VideoCallDialogProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: string;
  recipientProfile: any;
  isVideoEnabled?: boolean;
}

export interface TipData {
  amount: number;
  sender_name: string;
}
