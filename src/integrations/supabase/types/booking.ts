
export interface BookingSlot {
  id: string;
  creator_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  duration_minutes: number[];
  price_per_minute: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  creator_id: string;
  user_id: string;
  booking_date: string;
  start_time: string;
  duration_minutes: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  booking_type: 'chat' | 'video' | 'voice';
  notes?: string;
  created_at: string;
  updated_at: string;
}
