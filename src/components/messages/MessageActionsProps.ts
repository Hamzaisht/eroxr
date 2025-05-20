
export interface MessageActionsProps {
  onActionClick: (action: string) => void;
  onReport?: () => Promise<void>;
  isOwnMessage?: boolean;
  isVisible?: boolean;
  toggleVisibility?: () => void;
}
