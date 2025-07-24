export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_action_logs: {
        Row: {
          action: string
          action_type: string
          admin_id: string
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown | null
          target_data: Json | null
          target_id: string | null
          target_type: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          action_type: string
          admin_id: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          target_data?: Json | null
          target_id?: string | null
          target_type?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          action_type?: string
          admin_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          target_data?: Json | null
          target_id?: string | null
          target_type?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      admin_sessions: {
        Row: {
          activated_at: string | null
          admin_id: string
          created_at: string
          ghost_mode: boolean
          id: string
          ip_address: unknown | null
          last_active_at: string
          session_data: Json | null
          user_agent: string | null
        }
        Insert: {
          activated_at?: string | null
          admin_id: string
          created_at?: string
          ghost_mode?: boolean
          id?: string
          ip_address?: unknown | null
          last_active_at?: string
          session_data?: Json | null
          user_agent?: string | null
        }
        Update: {
          activated_at?: string | null
          admin_id?: string
          created_at?: string
          ghost_mode?: boolean
          id?: string
          ip_address?: unknown | null
          last_active_at?: string
          session_data?: Json | null
          user_agent?: string | null
        }
        Relationships: []
      }
      blacklisted_content: {
        Row: {
          added_by: string | null
          content_hash: string
          content_type: string
          created_at: string | null
          id: string
          permanent_block: boolean | null
          reason: string
          related_dmca_id: string | null
          source_report_id: string | null
        }
        Insert: {
          added_by?: string | null
          content_hash: string
          content_type: string
          created_at?: string | null
          id?: string
          permanent_block?: boolean | null
          reason: string
          related_dmca_id?: string | null
          source_report_id?: string | null
        }
        Update: {
          added_by?: string | null
          content_hash?: string
          content_type?: string
          created_at?: string | null
          id?: string
          permanent_block?: boolean | null
          reason?: string
          related_dmca_id?: string | null
          source_report_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blacklisted_content_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blacklisted_content_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "top_creators_by_earnings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blacklisted_content_related_dmca_id_fkey"
            columns: ["related_dmca_id"]
            isOneToOne: false
            referencedRelation: "dmca_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blacklisted_content_source_report_id_fkey"
            columns: ["source_report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_slots: {
        Row: {
          created_at: string | null
          creator_id: string | null
          day_of_week: number | null
          duration_minutes: number[] | null
          end_time: string
          id: string
          is_active: boolean | null
          price_per_minute: number
          start_time: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          creator_id?: string | null
          day_of_week?: number | null
          duration_minutes?: number[] | null
          end_time: string
          id?: string
          is_active?: boolean | null
          price_per_minute: number
          start_time: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          creator_id?: string | null
          day_of_week?: number | null
          duration_minutes?: number[] | null
          end_time?: string
          id?: string
          is_active?: boolean | null
          price_per_minute?: number
          start_time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_slots_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_slots_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "top_creators_by_earnings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_date: string
          booking_type: string
          created_at: string | null
          creator_id: string | null
          duration_minutes: number
          id: string
          notes: string | null
          start_time: string
          status: string | null
          total_amount: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          booking_date: string
          booking_type: string
          created_at?: string | null
          creator_id?: string | null
          duration_minutes: number
          id?: string
          notes?: string | null
          start_time: string
          status?: string | null
          total_amount: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          booking_date?: string
          booking_type?: string
          created_at?: string | null
          creator_id?: string | null
          duration_minutes?: number
          id?: string
          notes?: string | null
          start_time?: string
          status?: string | null
          total_amount?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "top_creators_by_earnings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "top_creators_by_earnings"
            referencedColumns: ["id"]
          },
        ]
      }
      call_history: {
        Row: {
          call_type: string
          caller_id: string
          connected_at: string | null
          created_at: string
          duration: number | null
          ended_at: string | null
          id: string
          recipient_id: string
          started_at: string
          status: string
          updated_at: string
        }
        Insert: {
          call_type: string
          caller_id: string
          connected_at?: string | null
          created_at?: string
          duration?: number | null
          ended_at?: string | null
          id?: string
          recipient_id: string
          started_at?: string
          status?: string
          updated_at?: string
        }
        Update: {
          call_type?: string
          caller_id?: string
          connected_at?: string | null
          created_at?: string
          duration?: number | null
          ended_at?: string | null
          id?: string
          recipient_id?: string
          started_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      call_notifications: {
        Row: {
          call_id: string
          created_at: string
          id: string
          is_read: boolean
          notification_type: string
          user_id: string
        }
        Insert: {
          call_id: string
          created_at?: string
          id?: string
          is_read?: boolean
          notification_type: string
          user_id: string
        }
        Update: {
          call_id?: string
          created_at?: string
          id?: string
          is_read?: boolean
          notification_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "call_notifications_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "call_history"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "top_creators_by_earnings"
            referencedColumns: ["id"]
          },
        ]
      }
      communities: {
        Row: {
          avatar_url: string | null
          banner_url: string | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          is_private: boolean | null
          member_count: number | null
          name: string
          rules: Json | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          banner_url?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          is_private?: boolean | null
          member_count?: number | null
          name: string
          rules?: Json | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          banner_url?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          is_private?: boolean | null
          member_count?: number | null
          name?: string
          rules?: Json | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      community_members: {
        Row: {
          community_id: string
          id: string
          joined_at: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          community_id: string
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          community_id?: string
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_members_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
      content_analytics: {
        Row: {
          avg_watch_time: number | null
          bounce_rate: number | null
          content_id: string
          content_type: string
          conversion_rate: number | null
          created_at: string | null
          date: string | null
          engagement_rate: number | null
          id: string
          revenue_generated: number | null
          unique_views: number | null
          user_id: string
          views: number | null
        }
        Insert: {
          avg_watch_time?: number | null
          bounce_rate?: number | null
          content_id: string
          content_type: string
          conversion_rate?: number | null
          created_at?: string | null
          date?: string | null
          engagement_rate?: number | null
          id?: string
          revenue_generated?: number | null
          unique_views?: number | null
          user_id: string
          views?: number | null
        }
        Update: {
          avg_watch_time?: number | null
          bounce_rate?: number | null
          content_id?: string
          content_type?: string
          conversion_rate?: number | null
          created_at?: string | null
          date?: string | null
          engagement_rate?: number | null
          id?: string
          revenue_generated?: number | null
          unique_views?: number | null
          user_id?: string
          views?: number | null
        }
        Relationships: []
      }
      content_classifications: {
        Row: {
          age_restriction: boolean | null
          classification: string
          classified_by: string | null
          content_id: string
          content_type: string
          created_at: string | null
          id: string
          requires_warning: boolean | null
          updated_at: string | null
          visibility: string | null
          warning_text: string | null
        }
        Insert: {
          age_restriction?: boolean | null
          classification: string
          classified_by?: string | null
          content_id: string
          content_type: string
          created_at?: string | null
          id?: string
          requires_warning?: boolean | null
          updated_at?: string | null
          visibility?: string | null
          warning_text?: string | null
        }
        Update: {
          age_restriction?: boolean | null
          classification?: string
          classified_by?: string | null
          content_id?: string
          content_type?: string
          created_at?: string | null
          id?: string
          requires_warning?: boolean | null
          updated_at?: string | null
          visibility?: string | null
          warning_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_classifications_classified_by_fkey"
            columns: ["classified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_classifications_classified_by_fkey"
            columns: ["classified_by"]
            isOneToOne: false
            referencedRelation: "top_creators_by_earnings"
            referencedColumns: ["id"]
          },
        ]
      }
      content_recommendations: {
        Row: {
          content_id: string
          content_type: string
          created_at: string | null
          expires_at: string | null
          id: string
          reason: string | null
          recommendation_score: number | null
          user_id: string
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          reason?: string | null
          recommendation_score?: number | null
          user_id: string
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          reason?: string | null
          recommendation_score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      creator_content_prices: {
        Row: {
          created_at: string
          creator_id: string | null
          description: string | null
          features: Json | null
          id: string
          monthly_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_id?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          monthly_price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_id?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          monthly_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_content_prices_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_content_prices_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "top_creators_by_earnings"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_likes: {
        Row: {
          created_at: string
          creator_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_likes_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_likes_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "top_creators_by_earnings"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_metrics: {
        Row: {
          created_at: string | null
          earnings: number | null
          engagement_score: number | null
          followers: number | null
          id: string
          popularity_score: number | null
          updated_at: string | null
          user_id: string
          views: number | null
        }
        Insert: {
          created_at?: string | null
          earnings?: number | null
          engagement_score?: number | null
          followers?: number | null
          id?: string
          popularity_score?: number | null
          updated_at?: string | null
          user_id: string
          views?: number | null
        }
        Update: {
          created_at?: string | null
          earnings?: number | null
          engagement_score?: number | null
          followers?: number | null
          id?: string
          popularity_score?: number | null
          updated_at?: string | null
          user_id?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_metrics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_metrics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "top_creators_by_earnings"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_payouts: {
        Row: {
          amount_sek: number
          created_at: string
          creator_id: string
          failure_reason: string | null
          id: string
          net_amount_sek: number
          payout_date: string | null
          period_end: string
          period_start: string
          platform_fee_sek: number
          status: string
          stripe_transfer_id: string | null
          updated_at: string
        }
        Insert: {
          amount_sek: number
          created_at?: string
          creator_id: string
          failure_reason?: string | null
          id?: string
          net_amount_sek: number
          payout_date?: string | null
          period_end: string
          period_start: string
          platform_fee_sek: number
          status?: string
          stripe_transfer_id?: string | null
          updated_at?: string
        }
        Update: {
          amount_sek?: number
          created_at?: string
          creator_id?: string
          failure_reason?: string | null
          id?: string
          net_amount_sek?: number
          payout_date?: string | null
          period_end?: string
          period_start?: string
          platform_fee_sek?: number
          status?: string
          stripe_transfer_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      creator_subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          creator_id: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          status: string
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          creator_id: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          creator_id?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_subscriptions_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_subscriptions_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "top_creators_by_earnings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "top_creators_by_earnings"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_verification_requests: {
        Row: {
          account_type: string
          admin_notes: string | null
          community_guidelines_accepted: boolean
          created_at: string | null
          date_of_birth: string
          full_name: string
          government_id_type: string
          government_id_url: string
          id: string
          privacy_policy_accepted: boolean
          registered_address: Json
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          selfie_url: string
          social_media_links: Json | null
          status: string
          submitted_at: string | null
          terms_accepted: boolean
          terms_accepted_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_type: string
          admin_notes?: string | null
          community_guidelines_accepted?: boolean
          created_at?: string | null
          date_of_birth: string
          full_name: string
          government_id_type: string
          government_id_url: string
          id?: string
          privacy_policy_accepted?: boolean
          registered_address: Json
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          selfie_url: string
          social_media_links?: Json | null
          status?: string
          submitted_at?: string | null
          terms_accepted?: boolean
          terms_accepted_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_type?: string
          admin_notes?: string | null
          community_guidelines_accepted?: boolean
          created_at?: string | null
          date_of_birth?: string
          full_name?: string
          government_id_type?: string
          government_id_url?: string
          id?: string
          privacy_policy_accepted?: boolean
          registered_address?: Json
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          selfie_url?: string
          social_media_links?: Json | null
          status?: string
          submitted_at?: string | null
          terms_accepted?: boolean
          terms_accepted_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_verification_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_verification_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "top_creators_by_earnings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_verification_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_verification_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "top_creators_by_earnings"
            referencedColumns: ["id"]
          },
        ]
      }
      dating_ad_likes: {
        Row: {
          created_at: string
          dating_ad_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dating_ad_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dating_ad_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dating_ad_likes_dating_ad_id_fkey"
            columns: ["dating_ad_id"]
            isOneToOne: false
            referencedRelation: "dating_ads"
            referencedColumns: ["id"]
          },
        ]
      }
      dating_ads: {
        Row: {
          about_me: string | null
          age_range: unknown
          avatar_url: string | null
          body_type: string | null
          city: string
          click_count: number | null
          country: Database["public"]["Enums"]["nordic_country"]
          created_at: string | null
          description: string
          drinking_status: string | null
          education_level: string | null
          height: number | null
          id: string
          interests: string[] | null
          is_active: boolean | null
          languages: string[] | null
          last_active: string | null
          last_modified_by: string | null
          latitude: number | null
          likes_count: number | null
          longitude: number | null
          looking_for: string[]
          message_count: number | null
          moderation_status: string | null
          occupation: string | null
          preferred_age_range: unknown | null
          profile_completion_score: number | null
          relationship_status: Database["public"]["Enums"]["relationship_status"]
          seeking_description: string | null
          smoking_status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string | null
          user_type: string
          video_url: string | null
          view_count: number | null
          views_count: number | null
        }
        Insert: {
          about_me?: string | null
          age_range: unknown
          avatar_url?: string | null
          body_type?: string | null
          city: string
          click_count?: number | null
          country: Database["public"]["Enums"]["nordic_country"]
          created_at?: string | null
          description: string
          drinking_status?: string | null
          education_level?: string | null
          height?: number | null
          id?: string
          interests?: string[] | null
          is_active?: boolean | null
          languages?: string[] | null
          last_active?: string | null
          last_modified_by?: string | null
          latitude?: number | null
          likes_count?: number | null
          longitude?: number | null
          looking_for: string[]
          message_count?: number | null
          moderation_status?: string | null
          occupation?: string | null
          preferred_age_range?: unknown | null
          profile_completion_score?: number | null
          relationship_status: Database["public"]["Enums"]["relationship_status"]
          seeking_description?: string | null
          smoking_status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id?: string | null
          user_type: string
          video_url?: string | null
          view_count?: number | null
          views_count?: number | null
        }
        Update: {
          about_me?: string | null
          age_range?: unknown
          avatar_url?: string | null
          body_type?: string | null
          city?: string
          click_count?: number | null
          country?: Database["public"]["Enums"]["nordic_country"]
          created_at?: string | null
          description?: string
          drinking_status?: string | null
          education_level?: string | null
          height?: number | null
          id?: string
          interests?: string[] | null
          is_active?: boolean | null
          languages?: string[] | null
          last_active?: string | null
          last_modified_by?: string | null
          latitude?: number | null
          likes_count?: number | null
          longitude?: number | null
          looking_for?: string[]
          message_count?: number | null
          moderation_status?: string | null
          occupation?: string | null
          preferred_age_range?: unknown | null
          profile_completion_score?: number | null
          relationship_status?: Database["public"]["Enums"]["relationship_status"]
          seeking_description?: string | null
          smoking_status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
          user_type?: string
          video_url?: string | null
          view_count?: number | null
          views_count?: number | null
        }
        Relationships: []
      }
      direct_messages: {
        Row: {
          content: string | null
          created_at: string | null
          duration: number | null
          expires_at: string | null
          id: string
          is_expired: boolean | null
          message_source: string | null
          message_type: string | null
          original_content: string | null
          recipient_id: string | null
          sender_id: string | null
          updated_at: string | null
          viewed_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          duration?: number | null
          expires_at?: string | null
          id?: string
          is_expired?: boolean | null
          message_source?: string | null
          message_type?: string | null
          original_content?: string | null
          recipient_id?: string | null
          sender_id?: string | null
          updated_at?: string | null
          viewed_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          duration?: number | null
          expires_at?: string | null
          id?: string
          is_expired?: boolean | null
          message_source?: string | null
          message_type?: string | null
          original_content?: string | null
          recipient_id?: string | null
          sender_id?: string | null
          updated_at?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "direct_messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "direct_messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "top_creators_by_earnings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "direct_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "direct_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "top_creators_by_earnings"
            referencedColumns: ["id"]
          },
        ]
      }
      dmca_requests: {
        Row: {
          content_id: string
          content_type: string
          created_at: string | null
          handled_by: string | null
          id: string
          original_content_url: string | null
          proof_of_ownership: string | null
          reporter_id: string | null
          resolution_notes: string | null
          status: string | null
          takedown_date: string | null
          updated_at: string | null
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string | null
          handled_by?: string | null
          id?: string
          original_content_url?: string | null
          proof_of_ownership?: string | null
          reporter_id?: string | null
          resolution_notes?: string | null
          status?: string | null
          takedown_date?: string | null
          updated_at?: string | null
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string | null
          handled_by?: string | null
          id?: string
          original_content_url?: string | null
          proof_of_ownership?: string | null
          reporter_id?: string | null
          resolution_notes?: string | null
          status?: string | null
          takedown_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dmca_requests_handled_by_fkey"
            columns: ["handled_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dmca_requests_handled_by_fkey"
            columns: ["handled_by"]
            isOneToOne: false
            referencedRelation: "top_creators_by_earnings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dmca_requests_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dmca_requests_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "top_creators_by_earnings"
            referencedColumns: ["id"]
          },
        ]
      }
      email_verification_tokens: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          new_email: string
          token: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string
          id?: string
          new_email: string
          token: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          new_email?: string
          token?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_verification_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_verification_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "top_creators_by_earnings"
            referencedColumns: ["id"]
          },
        ]
      }
      flagged_content: {
        Row: {
          content_id: string
          content_type: string
          flagged_at: string | null
          flagged_by: string | null
          id: string
          notes: string | null
          reason: string
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          status: string
          user_id: string | null
        }
        Insert: {
          content_id: string
          content_type: string
          flagged_at?: string | null
          flagged_by?: string | null
          id?: string
          notes?: string | null
          reason: string
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          status?: string
          user_id?: string | null
        }
        Update: {
          content_id?: string
          content_type?: string
          flagged_at?: string | null
          flagged_by?: string | null
          id?: string
          notes?: string | null
          reason?: string
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      followers: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "followers_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "followers_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "top_creators_by_earnings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "followers_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "followers_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "top_creators_by_earnings"
            referencedColumns: ["id"]
          },
        ]
      }
      id_verifications: {
        Row: {
          document_type: string
          document_url: string
          id: string
          rejected_reason: string | null
          status: string | null
          submitted_at: string | null
          user_id: string | null
          verified_at: string | null
        }
        Insert: {
          document_type: string
          document_url: string
          id?: string
          rejected_reason?: string | null
          status?: string | null
          submitted_at?: string | null
          user_id?: string | null
          verified_at?: string | null
        }
        Update: {
          document_type?: string
          document_url?: string
          id?: string
          rejected_reason?: string | null
          status?: string | null
          submitted_at?: string | null
          user_id?: string | null
          verified_at?: string | null
        }
        Relationships: []
      }
      live_stream_chat: {
        Row: {
          created_at: string | null
          id: string
          message: string
          sender_id: string | null
          stream_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          sender_id?: string | null
          stream_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          sender_id?: string | null
          stream_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "live_stream_chat_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "live_stream_chat_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "top_creators_by_earnings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "live_stream_chat_stream_id_fkey"
            columns: ["stream_id"]
            isOneToOne: false
            referencedRelation: "live_streams"
            referencedColumns: ["id"]
          },
        ]
      }
      live_stream_viewers: {
        Row: {
          id: string
          joined_at: string | null
          left_at: string | null
          stream_id: string | null
          viewer_id: string | null
        }
        Insert: {
          id?: string
          joined_at?: string | null
          left_at?: string | null
          stream_id?: string | null
          viewer_id?: string | null
        }
        Update: {
          id?: string
          joined_at?: string | null
          left_at?: string | null
          stream_id?: string | null
          viewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "live_stream_viewers_stream_id_fkey"
            columns: ["stream_id"]
            isOneToOne: false
            referencedRelation: "live_streams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "live_stream_viewers_viewer_id_fkey"
            columns: ["viewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "live_stream_viewers_viewer_id_fkey"
            columns: ["viewer_id"]
            isOneToOne: false
            referencedRelation: "top_creators_by_earnings"
            referencedColumns: ["id"]
          },
        ]
      }
      live_streams: {
        Row: {
          created_at: string | null
          creator_id: string
          description: string | null
          ended_at: string | null
          id: string
          is_private: boolean | null
          playback_url: string | null
          started_at: string | null
          status: string
          stream_key: string | null
          title: string
          updated_at: string | null
          viewer_count: number | null
        }
        Insert: {
          created_at?: string | null
          creator_id: string
          description?: string | null
          ended_at?: string | null
          id?: string
          is_private?: boolean | null
          playback_url?: string | null
          started_at?: string | null
          status?: string
          stream_key?: string | null
          title: string
          updated_at?: string | null
          viewer_count?: number | null
        }
        Update: {
          created_at?: string | null
          creator_id?: string
          description?: string | null
          ended_at?: string | null
          id?: string
          is_private?: boolean | null
          playback_url?: string | null
          started_at?: string | null
          status?: string
          stream_key?: string | null
          title?: string
          updated_at?: string | null
          viewer_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "live_streams_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "live_streams_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "top_creators_by_earnings"
            referencedColumns: ["id"]
          },
        ]
      }
      media_assets: {
        Row: {
          access_level: string
          alt_text: string | null
          created_at: string
          file_size: number
          id: string
          media_type: string
          metadata: Json | null
          mime_type: string
          original_name: string
          post_id: string | null
          storage_path: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_level?: string
          alt_text?: string | null
          created_at?: string
          file_size: number
          id?: string
          media_type: string
          metadata?: Json | null
          mime_type: string
          original_name: string
          post_id?: string | null
          storage_path: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_level?: string
          alt_text?: string | null
          created_at?: string
          file_size?: number
          id?: string
          media_type?: string
          metadata?: Json | null
          mime_type?: string
          original_name?: string
          post_id?: string | null
          storage_path?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_assets_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_assets_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "user_bookmarks"
            referencedColumns: ["id"]
          },
        ]
      }
      message_threads: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          is_archived: boolean | null
          last_message_at: string | null
          participants: string[]
          thread_type: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: string
          is_archived?: boolean | null
          last_message_at?: string | null
          participants: string[]
          thread_type?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          is_archived?: boolean | null
          last_message_at?: string | null
          participants?: string[]
          thread_type?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      nordic_cities: {
        Row: {
          city_name: string
          country: Database["public"]["Enums"]["nordic_country"]
          id: string
          population: number | null
        }
        Insert: {
          city_name: string
          country: Database["public"]["Enums"]["nordic_country"]
          id?: string
          population?: number | null
        }
        Update: {
          city_name?: string
          country?: Database["public"]["Enums"]["nordic_country"]
          id?: string
          population?: number | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      payout_requests: {
        Row: {
          amount: number
          approved_at: string | null
          creator_id: string
          final_amount: number
          id: string
          notes: string | null
          platform_fee: number
          processed_at: string | null
          processed_by: string | null
          requested_at: string | null
          status: string
        }
        Insert: {
          amount: number
          approved_at?: string | null
          creator_id: string
          final_amount: number
          id?: string
          notes?: string | null
          platform_fee: number
          processed_at?: string | null
          processed_by?: string | null
          requested_at?: string | null
          status?: string
        }
        Update: {
          amount?: number
          approved_at?: string | null
          creator_id?: string
          final_amount?: number
          id?: string
          notes?: string | null
          platform_fee?: number
          processed_at?: string | null
          processed_by?: string | null
          requested_at?: string | null
          status?: string
        }
        Relationships: []
      }
      platform_features: {
        Row: {
          created_at: string | null
          description: string
          display_order: number
          feature_name: string
          id: string
          image_path: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          display_order: number
          feature_name: string
          id?: string
          image_path: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          display_order?: number
          feature_name?: string
          id?: string
          image_path?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      platform_subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: []
      }
      post_media_actions: {
        Row: {
          action_type: string
          created_at: string | null
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_media_actions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_media_actions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "user_bookmarks"
            referencedColumns: ["id"]
          },
        ]
      }
      post_purchases: {
        Row: {
          amount: number
          created_at: string
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_purchases_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_purchases_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "user_bookmarks"
            referencedColumns: ["id"]
          },
        ]
      }
      post_saves: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          comments_count: number | null
          content: string
          content_extended: string | null
          created_at: string
          creator_id: string
          downloads_count: number | null
          engagement_score: number | null
          id: string
          is_featured: boolean | null
          is_ppv: boolean | null
          last_engagement_at: string | null
          last_modified_by: string | null
          likes_count: number | null
          media_url: string[] | null
          metadata: Json | null
          ppv_amount: number | null
          screenshots_count: number | null
          share_count: number | null
          tags: string[] | null
          updated_at: string
          video_urls: string[] | null
          view_count: number | null
          visibility: string | null
        }
        Insert: {
          comments_count?: number | null
          content: string
          content_extended?: string | null
          created_at?: string
          creator_id: string
          downloads_count?: number | null
          engagement_score?: number | null
          id?: string
          is_featured?: boolean | null
          is_ppv?: boolean | null
          last_engagement_at?: string | null
          last_modified_by?: string | null
          likes_count?: number | null
          media_url?: string[] | null
          metadata?: Json | null
          ppv_amount?: number | null
          screenshots_count?: number | null
          share_count?: number | null
          tags?: string[] | null
          updated_at?: string
          video_urls?: string[] | null
          view_count?: number | null
          visibility?: string | null
        }
        Update: {
          comments_count?: number | null
          content?: string
          content_extended?: string | null
          created_at?: string
          creator_id?: string
          downloads_count?: number | null
          engagement_score?: number | null
          id?: string
          is_featured?: boolean | null
          is_ppv?: boolean | null
          last_engagement_at?: string | null
          last_modified_by?: string | null
          likes_count?: number | null
          media_url?: string[] | null
          metadata?: Json | null
          ppv_amount?: number | null
          screenshots_count?: number | null
          share_count?: number | null
          tags?: string[] | null
          updated_at?: string
          video_urls?: string[] | null
          view_count?: number | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_posts_creator_id"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_posts_creator_id"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "top_creators_by_earnings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "top_creators_by_earnings"
            referencedColumns: ["id"]
          },
        ]
      }
      ppv_unlocks: {
        Row: {
          amount_sek: number
          content_id: string
          content_type: string
          creator_id: string
          expires_at: string | null
          id: string
          stripe_payment_intent_id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          amount_sek: number
          content_id: string
          content_type: string
          creator_id: string
          expires_at?: string | null
          id?: string
          stripe_payment_intent_id: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          amount_sek?: number
          content_id?: string
          content_type?: string
          creator_id?: string
          expires_at?: string | null
          id?: string
          stripe_payment_intent_id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age_verified: boolean | null
          allow_custom_requests: boolean | null
          allow_direct_messages: boolean | null
          allow_tips: boolean | null
          avatar_url: string | null
          banner_url: string | null
          bio: string | null
          content_privacy_default: string | null
          content_warning_enabled: boolean | null
          created_at: string
          date_of_birth: string | null
          email_notifications: boolean | null
          first_name: string | null
          id: string
          id_verification_status: string | null
          interests: string[] | null
          is_age_verified: boolean | null
          is_paused: boolean | null
          is_paying_customer: boolean | null
          is_suspended: boolean | null
          is_verified: boolean | null
          last_dob_change: string | null
          last_name: string | null
          last_username_change: string | null
          location: string | null
          marketing_emails: boolean | null
          nsfw_enabled: boolean | null
          pause_end_at: string | null
          pause_reason: string | null
          profile_visibility: boolean | null
          push_notifications: boolean | null
          show_online_status: boolean | null
          social_links: Json | null
          status: string | null
          stripe_onboarding_completed: boolean | null
          suspended_at: string | null
          two_factor_enabled: boolean | null
          updated_at: string
          username: string | null
        }
        Insert: {
          age_verified?: boolean | null
          allow_custom_requests?: boolean | null
          allow_direct_messages?: boolean | null
          allow_tips?: boolean | null
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          content_privacy_default?: string | null
          content_warning_enabled?: boolean | null
          created_at?: string
          date_of_birth?: string | null
          email_notifications?: boolean | null
          first_name?: string | null
          id: string
          id_verification_status?: string | null
          interests?: string[] | null
          is_age_verified?: boolean | null
          is_paused?: boolean | null
          is_paying_customer?: boolean | null
          is_suspended?: boolean | null
          is_verified?: boolean | null
          last_dob_change?: string | null
          last_name?: string | null
          last_username_change?: string | null
          location?: string | null
          marketing_emails?: boolean | null
          nsfw_enabled?: boolean | null
          pause_end_at?: string | null
          pause_reason?: string | null
          profile_visibility?: boolean | null
          push_notifications?: boolean | null
          show_online_status?: boolean | null
          social_links?: Json | null
          status?: string | null
          stripe_onboarding_completed?: boolean | null
          suspended_at?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          age_verified?: boolean | null
          allow_custom_requests?: boolean | null
          allow_direct_messages?: boolean | null
          allow_tips?: boolean | null
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          content_privacy_default?: string | null
          content_warning_enabled?: boolean | null
          created_at?: string
          date_of_birth?: string | null
          email_notifications?: boolean | null
          first_name?: string | null
          id?: string
          id_verification_status?: string | null
          interests?: string[] | null
          is_age_verified?: boolean | null
          is_paused?: boolean | null
          is_paying_customer?: boolean | null
          is_suspended?: boolean | null
          is_verified?: boolean | null
          last_dob_change?: string | null
          last_name?: string | null
          last_username_change?: string | null
          location?: string | null
          marketing_emails?: boolean | null
          nsfw_enabled?: boolean | null
          pause_end_at?: string | null
          pause_reason?: string | null
          profile_visibility?: boolean | null
          push_notifications?: boolean | null
          show_online_status?: boolean | null
          social_links?: Json | null
          status?: string | null
          stripe_onboarding_completed?: boolean | null
          suspended_at?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          action_taken: string | null
          content_id: string | null
          content_type: string
          created_at: string | null
          description: string | null
          evidence_urls: string[] | null
          id: string
          ip_address: string | null
          is_emergency: boolean | null
          reason: string
          reported_id: string | null
          reporter_id: string | null
          resolution_notes: string | null
          resolved_by: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          action_taken?: string | null
          content_id?: string | null
          content_type: string
          created_at?: string | null
          description?: string | null
          evidence_urls?: string[] | null
          id?: string
          ip_address?: string | null
          is_emergency?: boolean | null
          reason: string
          reported_id?: string | null
          reporter_id?: string | null
          resolution_notes?: string | null
          resolved_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          action_taken?: string | null
          content_id?: string | null
          content_type?: string
          created_at?: string | null
          description?: string | null
          evidence_urls?: string[] | null
          id?: string
          ip_address?: string | null
          is_emergency?: boolean | null
          reason?: string
          reported_id?: string | null
          reporter_id?: string | null
          resolution_notes?: string | null
          resolved_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_reported_id_fkey"
            columns: ["reported_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reported_id_fkey"
            columns: ["reported_id"]
            isOneToOne: false
            referencedRelation: "top_creators_by_earnings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "top_creators_by_earnings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "top_creators_by_earnings"
            referencedColumns: ["id"]
          },
        ]
      }
      search_history: {
        Row: {
          created_at: string | null
          id: string
          results_count: number | null
          search_query: string
          search_type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          results_count?: number | null
          search_query: string
          search_type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          results_count?: number | null
          search_query?: string
          search_type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      security_violations: {
        Row: {
          content_owner_id: string
          created_at: string
          id: string
          violation_type: string
          violator_id: string
        }
        Insert: {
          content_owner_id: string
          created_at?: string
          id?: string
          violation_type: string
          violator_id: string
        }
        Update: {
          content_owner_id?: string
          created_at?: string
          id?: string
          violation_type?: string
          violator_id?: string
        }
        Relationships: []
      }
      sounds: {
        Row: {
          audio_url: string
          created_at: string | null
          creator_id: string | null
          duration: number | null
          id: string
          title: string
          use_count: number | null
        }
        Insert: {
          audio_url: string
          created_at?: string | null
          creator_id?: string | null
          duration?: number | null
          id?: string
          title: string
          use_count?: number | null
        }
        Update: {
          audio_url?: string
          created_at?: string | null
          creator_id?: string | null
          duration?: number | null
          id?: string
          title?: string
          use_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sounds_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sounds_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "top_creators_by_earnings"
            referencedColumns: ["id"]
          },
        ]
      }
      stories: {
        Row: {
          content_type: string | null
          created_at: string
          creator_id: string
          duration: number | null
          expires_at: string
          id: string
          is_active: boolean | null
          is_public: boolean | null
          last_modified_by: string | null
          media_url: string | null
          screenshot_disabled: boolean | null
          video_url: string | null
          view_count: number | null
        }
        Insert: {
          content_type?: string | null
          created_at?: string
          creator_id: string
          duration?: number | null
          expires_at?: string
          id?: string
          is_active?: boolean | null
          is_public?: boolean | null
          last_modified_by?: string | null
          media_url?: string | null
          screenshot_disabled?: boolean | null
          video_url?: string | null
          view_count?: number | null
        }
        Update: {
          content_type?: string | null
          created_at?: string
          creator_id?: string
          duration?: number | null
          expires_at?: string
          id?: string
          is_active?: boolean | null
          is_public?: boolean | null
          last_modified_by?: string | null
          media_url?: string | null
          screenshot_disabled?: boolean | null
          video_url?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stories_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stories_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "top_creators_by_earnings"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_accounts: {
        Row: {
          account_enabled: boolean | null
          capabilities_card_payments: string | null
          capabilities_transfers: string | null
          country: string | null
          created_at: string
          default_currency: string | null
          id: string
          onboarding_completed: boolean | null
          stripe_account_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_enabled?: boolean | null
          capabilities_card_payments?: string | null
          capabilities_transfers?: string | null
          country?: string | null
          created_at?: string
          default_currency?: string | null
          id?: string
          onboarding_completed?: boolean | null
          stripe_account_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_enabled?: boolean | null
          capabilities_card_payments?: string | null
          capabilities_transfers?: string | null
          country?: string | null
          created_at?: string
          default_currency?: string | null
          id?: string
          onboarding_completed?: boolean | null
          stripe_account_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      stripe_customers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string
          creator_id: string
          description: string | null
          id: string
          is_active: boolean | null
          monthly_price_sek: number
          name: string
          ppv_enabled: boolean | null
          stripe_price_id_monthly: string | null
          stripe_price_id_yearly: string | null
          stripe_product_id: string
          updated_at: string
          yearly_discount_percentage: number | null
          yearly_price_sek: number | null
        }
        Insert: {
          created_at?: string
          creator_id: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          monthly_price_sek: number
          name: string
          ppv_enabled?: boolean | null
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
          stripe_product_id: string
          updated_at?: string
          yearly_discount_percentage?: number | null
          yearly_price_sek?: number | null
        }
        Update: {
          created_at?: string
          creator_id?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          monthly_price_sek?: number
          name?: string
          ppv_enabled?: boolean | null
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
          stripe_product_id?: string
          updated_at?: string
          yearly_discount_percentage?: number | null
          yearly_price_sek?: number | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created_at: string
          creator_id: string
          current_period_end: string
          current_period_start: string
          id: string
          interval_type: string
          status: string
          stripe_customer_id: string
          stripe_subscription_id: string
          subscriber_id: string
          subscription_plan_id: string
          updated_at: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created_at?: string
          creator_id: string
          current_period_end: string
          current_period_start: string
          id?: string
          interval_type: string
          status?: string
          stripe_customer_id: string
          stripe_subscription_id: string
          subscriber_id: string
          subscription_plan_id: string
          updated_at?: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created_at?: string
          creator_id?: string
          current_period_end?: string
          current_period_start?: string
          id?: string
          interval_type?: string
          status?: string
          stripe_customer_id?: string
          stripe_subscription_id?: string
          subscriber_id?: string
          subscription_plan_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_subscription_plan_id_fkey"
            columns: ["subscription_plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      tips: {
        Row: {
          amount: number
          call_id: string | null
          created_at: string
          creator_amount: number | null
          id: string
          platform_fee_amount: number | null
          recipient_id: string
          sender_id: string
          sender_name: string | null
          status: string | null
          stripe_payment_intent_id: string | null
        }
        Insert: {
          amount: number
          call_id?: string | null
          created_at?: string
          creator_amount?: number | null
          id?: string
          platform_fee_amount?: number | null
          recipient_id: string
          sender_id: string
          sender_name?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
        }
        Update: {
          amount?: number
          call_id?: string | null
          created_at?: string
          creator_amount?: number | null
          id?: string
          platform_fee_amount?: number | null
          recipient_id?: string
          sender_id?: string
          sender_name?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
        }
        Relationships: []
      }
      trending_content: {
        Row: {
          bookmarks: number | null
          comments: number | null
          id: string
          last_updated: string | null
          likes: number | null
          post_id: string
          score: number | null
          screenshots: number | null
        }
        Insert: {
          bookmarks?: number | null
          comments?: number | null
          id?: string
          last_updated?: string | null
          likes?: number | null
          post_id: string
          score?: number | null
          screenshots?: number | null
        }
        Update: {
          bookmarks?: number | null
          comments?: number | null
          id?: string
          last_updated?: string | null
          likes?: number | null
          post_id?: string
          score?: number | null
          screenshots?: number | null
        }
        Relationships: []
      }
      user_activity_logs: {
        Row: {
          activity_data: Json | null
          activity_type: string
          created_at: string
          id: string
          ip_address: unknown | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          activity_data?: Json | null
          activity_type: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_analytics: {
        Row: {
          content_interactions: number | null
          created_at: string | null
          daily_views: number | null
          date: string | null
          follower_growth: number | null
          id: string
          monthly_views: number | null
          profile_visits: number | null
          total_engagement_score: number | null
          updated_at: string | null
          user_id: string
          weekly_views: number | null
        }
        Insert: {
          content_interactions?: number | null
          created_at?: string | null
          daily_views?: number | null
          date?: string | null
          follower_growth?: number | null
          id?: string
          monthly_views?: number | null
          profile_visits?: number | null
          total_engagement_score?: number | null
          updated_at?: string | null
          user_id: string
          weekly_views?: number | null
        }
        Update: {
          content_interactions?: number | null
          created_at?: string | null
          daily_views?: number | null
          date?: string | null
          follower_growth?: number | null
          id?: string
          monthly_views?: number | null
          profile_visits?: number | null
          total_engagement_score?: number | null
          updated_at?: string | null
          user_id?: string
          weekly_views?: number | null
        }
        Relationships: []
      }
      user_interests: {
        Row: {
          created_at: string | null
          id: string
          interest: string
          user_id: string
          weight: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          interest: string
          user_id: string
          weight?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          interest?: string
          user_id?: string
          weight?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_profile_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_profile_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "top_creators_by_earnings"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          city: string | null
          country: string | null
          created_at: string | null
          creator_id: string
          device_type: string | null
          id: string
          ip_address: unknown | null
          latitude: number | null
          longitude: number | null
          page_views: number | null
          region: string | null
          session_end: string | null
          session_start: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          creator_id: string
          device_type?: string | null
          id?: string
          ip_address?: unknown | null
          latitude?: number | null
          longitude?: number | null
          page_views?: number | null
          region?: string | null
          session_end?: string | null
          session_start?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          creator_id?: string
          device_type?: string | null
          id?: string
          ip_address?: unknown | null
          latitude?: number | null
          longitude?: number | null
          page_views?: number | null
          region?: string | null
          session_end?: string | null
          session_start?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      video_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_pinned: boolean | null
          parent_id: string | null
          updated_at: string | null
          user_id: string | null
          video_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          parent_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          video_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          parent_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "video_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "video_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "top_creators_by_earnings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_comments_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      video_folder_items: {
        Row: {
          added_at: string
          folder_id: string
          id: string
          video_id: string
        }
        Insert: {
          added_at?: string
          folder_id: string
          id?: string
          video_id: string
        }
        Update: {
          added_at?: string
          folder_id?: string
          id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_folder_items_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "video_folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_folder_items_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      video_folders: {
        Row: {
          created_at: string
          creator_id: string
          description: string | null
          id: string
          is_default: boolean | null
          is_public: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          description?: string | null
          id?: string
          is_default?: boolean | null
          is_public?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          description?: string | null
          id?: string
          is_default?: boolean | null
          is_public?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_folders_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_folders_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "top_creators_by_earnings"
            referencedColumns: ["id"]
          },
        ]
      }
      video_likes: {
        Row: {
          created_at: string | null
          id: string
          user_id: string | null
          video_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id?: string | null
          video_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "video_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "top_creators_by_earnings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_likes_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      video_processing_queue: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          original_url: string
          post_id: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          original_url: string
          post_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          original_url?: string
          post_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_processing_queue_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_processing_queue_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "user_bookmarks"
            referencedColumns: ["id"]
          },
        ]
      }
      video_reports: {
        Row: {
          created_at: string | null
          id: string
          reason: string
          reporter_id: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string | null
          video_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          reason: string
          reporter_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          video_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          reason?: string
          reporter_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "video_reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "top_creators_by_earnings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_reports_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_reports_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "top_creators_by_earnings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_reports_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      video_views: {
        Row: {
          created_at: string | null
          id: string
          user_id: string | null
          video_id: string | null
          watch_time: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id?: string | null
          video_id?: string | null
          watch_time?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string | null
          video_id?: string | null
          watch_time?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "video_views_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_views_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "top_creators_by_earnings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_views_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          comment_count: number | null
          created_at: string | null
          creator_id: string | null
          description: string | null
          duration: number | null
          engagement_score: number | null
          id: string
          is_processed: boolean | null
          like_count: number | null
          ppv_amount: number | null
          processed_at: string | null
          share_count: number | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          video_url: string
          view_count: number | null
          visibility: Database["public"]["Enums"]["video_visibility"] | null
        }
        Insert: {
          comment_count?: number | null
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          duration?: number | null
          engagement_score?: number | null
          id?: string
          is_processed?: boolean | null
          like_count?: number | null
          ppv_amount?: number | null
          processed_at?: string | null
          share_count?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          video_url: string
          view_count?: number | null
          visibility?: Database["public"]["Enums"]["video_visibility"] | null
        }
        Update: {
          comment_count?: number | null
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          duration?: number | null
          engagement_score?: number | null
          id?: string
          is_processed?: boolean | null
          like_count?: number | null
          ppv_amount?: number | null
          processed_at?: string | null
          share_count?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string
          view_count?: number | null
          visibility?: Database["public"]["Enums"]["video_visibility"] | null
        }
        Relationships: [
          {
            foreignKeyName: "videos_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "videos_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "top_creators_by_earnings"
            referencedColumns: ["id"]
          },
        ]
      }
      view_tracking: {
        Row: {
          content_id: string
          content_type: string
          created_at: string | null
          id: string
          user_id: string | null
          viewed_at: string | null
          viewer_fingerprint: string
          viewer_ip: string | null
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string | null
          id?: string
          user_id?: string | null
          viewed_at?: string | null
          viewer_fingerprint: string
          viewer_ip?: string | null
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string | null
          id?: string
          user_id?: string | null
          viewed_at?: string | null
          viewer_fingerprint?: string
          viewer_ip?: string | null
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          created_at: string
          event_data: Json
          event_type: string
          id: string
          processed: boolean | null
          processed_at: string | null
          processing_error: string | null
          stripe_event_id: string
        }
        Insert: {
          created_at?: string
          event_data: Json
          event_type: string
          id?: string
          processed?: boolean | null
          processed_at?: string | null
          processing_error?: string | null
          stripe_event_id: string
        }
        Update: {
          created_at?: string
          event_data?: Json
          event_type?: string
          id?: string
          processed?: boolean | null
          processed_at?: string | null
          processing_error?: string | null
          stripe_event_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      top_creators_by_earnings: {
        Row: {
          avatar_url: string | null
          earnings_percentile: number | null
          id: string | null
          total_earnings: number | null
          username: string | null
        }
        Relationships: []
      }
      user_bookmarks: {
        Row: {
          comments_count: number | null
          content: string | null
          content_extended: string | null
          created_at: string | null
          creator_avatar_url: string | null
          creator_id: string | null
          creator_username: string | null
          downloads_count: number | null
          engagement_score: number | null
          id: string | null
          is_featured: boolean | null
          is_ppv: boolean | null
          last_engagement_at: string | null
          last_modified_by: string | null
          likes_count: number | null
          metadata: Json | null
          ppv_amount: number | null
          saved_at: string | null
          screenshots_count: number | null
          share_count: number | null
          source_type: string | null
          tags: string[] | null
          updated_at: string | null
          user_id: string | null
          view_count: number | null
          visibility: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_posts_creator_id"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_posts_creator_id"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "top_creators_by_earnings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "top_creators_by_earnings"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      assign_super_admin: {
        Args: { target_user_id: string }
        Returns: boolean
      }
      can_change_dob: {
        Args: { user_id: string }
        Returns: boolean
      }
      can_change_username: {
        Args: { user_id: string }
        Returns: boolean
      }
      check_column_exists: {
        Args: { p_table_name: string; p_column_name: string }
        Returns: boolean
      }
      check_username_available: {
        Args: { username_to_check: string }
        Returns: boolean
      }
      cleanup_expired_demo_content: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_sample_analytics_data_for_user: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      detect_stack_depth: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_content_analytics: {
        Args: { p_creator_id: string; p_days?: number }
        Returns: {
          total_posts: number
          total_views: number
          avg_engagement_rate: number
          top_performing_content: Json
          content_type_breakdown: Json
          posting_schedule_analysis: Json
        }[]
      }
      get_content_performance: {
        Args: { p_creator_id: string; p_limit?: number }
        Returns: {
          post_id: string
          content: string
          created_at: string
          views: number
          likes: number
          comments: number
          earnings: number
          engagement_score: number
          content_type: string
        }[]
      }
      get_content_view_count: {
        Args: { p_content_id: string; p_content_type: string }
        Returns: number
      }
      get_conversion_funnel: {
        Args: { p_creator_id: string; p_days?: number }
        Returns: {
          stage: string
          count: number
          percentage: number
        }[]
      }
      get_creator_analytics: {
        Args: {
          p_creator_id: string
          p_start_date?: string
          p_end_date?: string
        }
        Returns: {
          total_earnings: number
          total_views: number
          total_likes: number
          total_comments: number
          total_posts: number
          engagement_rate: number
          top_post_id: string
          top_post_earnings: number
        }[]
      }
      get_current_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_earnings_timeline: {
        Args: { p_creator_id: string; p_days?: number }
        Returns: {
          date: string
          amount: number
        }[]
      }
      get_geographic_analytics: {
        Args: { p_creator_id: string; p_days?: number }
        Returns: {
          country: string
          region: string
          city: string
          session_count: number
          unique_users: number
          total_page_views: number
          avg_latitude: number
          avg_longitude: number
        }[]
      }
      get_growth_analytics: {
        Args: { p_creator_id: string; p_days?: number }
        Returns: {
          follower_growth_rate: number
          subscription_rate: number
          retention_rate: number
          churn_rate: number
          new_followers_today: number
          daily_growth_data: Json
          retention_data: Json
          geographic_breakdown: Json
        }[]
      }
      get_most_engaged_fans: {
        Args: { p_creator_id: string; p_limit?: number }
        Returns: {
          user_id: string
          total_spent: number
          total_purchases: number
          total_likes: number
          total_comments: number
          engagement_score: number
          last_interaction: string
        }[]
      }
      get_platform_subscription_status: {
        Args: { p_user_id: string }
        Returns: {
          has_premium: boolean
          status: string
          current_period_end: string
        }[]
      }
      get_streaming_analytics: {
        Args: { p_creator_id: string; p_days?: number }
        Returns: {
          total_stream_time: unknown
          avg_viewers: number
          peak_viewers: number
          total_revenue: number
          recent_streams: Json
          viewer_activity: Json
        }[]
      }
      get_top_trending_hashtags: {
        Args: Record<PropertyKey, never>
        Returns: {
          tag: string
          count: number
          percentageincrease: number
        }[]
      }
      get_user_bookmarks: {
        Args: { p_user_id: string }
        Returns: {
          bookmark_type: string
          post_id: string
          content: string
          creator_id: string
          creator_username: string
          creator_avatar_url: string
          created_at: string
          saved_at: string
          media_count: number
        }[]
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
      increment_counter: {
        Args: { row_id: string; counter_name: string; table_name?: string }
        Returns: undefined
      }
      is_admin_user: {
        Args: { user_id: string; min_role?: string }
        Returns: boolean
      }
      is_age_valid: {
        Args: { birth_date: string }
        Returns: boolean
      }
      is_super_admin: {
        Args: { user_id?: string }
        Returns: boolean
      }
      is_verified_creator: {
        Args: { user_id: string }
        Returns: boolean
      }
      rls_bypass_profile_update: {
        Args: {
          p_user_id: string
          p_username?: string
          p_bio?: string
          p_location?: string
          p_avatar_url?: string
          p_banner_url?: string
          p_interests?: string[]
          p_profile_visibility?: boolean
          p_status?: string
        }
        Returns: Json
      }
      sync_uploaded_videos: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_profile_service: {
        Args: {
          p_user_id: string
          p_avatar_url?: string
          p_banner_url?: string
          p_username?: string
          p_bio?: string
          p_location?: string
        }
        Returns: Json
      }
      update_trending_score: {
        Args: { p_post_id: string }
        Returns: undefined
      }
      user_has_premium_access: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      validate_password_strength: {
        Args: { password: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "super_admin"
      body_type:
        | "athletic"
        | "average"
        | "slim"
        | "curvy"
        | "muscular"
        | "plus_size"
      drinking_status: "non_drinker" | "occasional" | "regular"
      education_level: "high_school" | "college" | "bachelor" | "master" | "phd"
      nordic_country: "denmark" | "finland" | "iceland" | "norway" | "sweden"
      relationship_status: "single" | "couple" | "other"
      smoking_status: "non_smoker" | "occasional" | "regular"
      video_visibility: "public" | "followers_only" | "subscribers_only" | "ppv"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user", "super_admin"],
      body_type: [
        "athletic",
        "average",
        "slim",
        "curvy",
        "muscular",
        "plus_size",
      ],
      drinking_status: ["non_drinker", "occasional", "regular"],
      education_level: ["high_school", "college", "bachelor", "master", "phd"],
      nordic_country: ["denmark", "finland", "iceland", "norway", "sweden"],
      relationship_status: ["single", "couple", "other"],
      smoking_status: ["non_smoker", "occasional", "regular"],
      video_visibility: ["public", "followers_only", "subscribers_only", "ppv"],
    },
  },
} as const
