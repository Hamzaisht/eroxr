
export interface TipData {
  sender_id: string;
  recipient_id: string;
  amount: number;
  call_id: string;
  sender_name: string | null;
}

export interface ProfileStats {
  follower_count: number;
  like_count: number;
  post_count: number;
}
