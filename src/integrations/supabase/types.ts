export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
            referencedRelation: "profiles_with_stats"
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
            referencedRelation: "profiles_with_stats"
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
            referencedRelation: "profiles_with_stats"
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
            referencedRelation: "profiles_with_stats"
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
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
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
            referencedRelation: "profiles_with_stats"
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
            referencedRelation: "profiles_with_stats"
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
            referencedRelation: "profiles_with_stats"
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
            referencedRelation: "profiles_with_stats"
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
      creator_subscriptions: {
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
            referencedRelation: "profiles_with_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_subscriptions_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "top_creators_by_earnings"
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
          media_url: string[] | null
          message_source: string | null
          message_type: string | null
          original_content: string | null
          recipient_id: string | null
          sender_id: string | null
          updated_at: string | null
          video_url: string | null
          viewed_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          duration?: number | null
          expires_at?: string | null
          id?: string
          is_expired?: boolean | null
          media_url?: string[] | null
          message_source?: string | null
          message_type?: string | null
          original_content?: string | null
          recipient_id?: string | null
          sender_id?: string | null
          updated_at?: string | null
          video_url?: string | null
          viewed_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          duration?: number | null
          expires_at?: string | null
          id?: string
          is_expired?: boolean | null
          media_url?: string[] | null
          message_source?: string | null
          message_type?: string | null
          original_content?: string | null
          recipient_id?: string | null
          sender_id?: string | null
          updated_at?: string | null
          video_url?: string | null
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
            referencedRelation: "profiles_with_stats"
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
            referencedRelation: "profiles_with_stats"
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
            referencedRelation: "profiles_with_stats"
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
            referencedRelation: "profiles_with_stats"
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
            referencedRelation: "profiles_with_stats"
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
            referencedRelation: "profiles_with_stats"
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
            referencedRelation: "profiles_with_stats"
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
            referencedRelation: "profiles_with_stats"
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
            referencedRelation: "profiles_with_stats"
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
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "post_saves_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          comments_count: number | null
          content: string
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
          ppv_amount: number | null
          screenshots_count: number | null
          share_count: number | null
          tags: string[] | null
          updated_at: string
          video_duration: number | null
          video_processing_status: string | null
          video_thumbnail_url: string | null
          video_urls: string[] | null
          view_count: number | null
          visibility: string | null
        }
        Insert: {
          comments_count?: number | null
          content: string
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
          ppv_amount?: number | null
          screenshots_count?: number | null
          share_count?: number | null
          tags?: string[] | null
          updated_at?: string
          video_duration?: number | null
          video_processing_status?: string | null
          video_thumbnail_url?: string | null
          video_urls?: string[] | null
          view_count?: number | null
          visibility?: string | null
        }
        Update: {
          comments_count?: number | null
          content?: string
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
          ppv_amount?: number | null
          screenshots_count?: number | null
          share_count?: number | null
          tags?: string[] | null
          updated_at?: string
          video_duration?: number | null
          video_processing_status?: string | null
          video_thumbnail_url?: string | null
          video_urls?: string[] | null
          view_count?: number | null
          visibility?: string | null
        }
        Relationships: [
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
            referencedRelation: "profiles_with_stats"
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
      profiles: {
        Row: {
          avatar_url: string | null
          banner_url: string | null
          bio: string | null
          created_at: string
          date_of_birth: string | null
          first_name: string | null
          id: string
          id_verification_status: string | null
          interests: string[] | null
          is_age_verified: boolean | null
          is_paying_customer: boolean | null
          is_suspended: boolean | null
          last_name: string | null
          last_username_change: string | null
          location: string | null
          profile_visibility: boolean | null
          social_links: Json | null
          status: string | null
          suspended_at: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          created_at?: string
          date_of_birth?: string | null
          first_name?: string | null
          id: string
          id_verification_status?: string | null
          interests?: string[] | null
          is_age_verified?: boolean | null
          is_paying_customer?: boolean | null
          is_suspended?: boolean | null
          last_name?: string | null
          last_username_change?: string | null
          location?: string | null
          profile_visibility?: boolean | null
          social_links?: Json | null
          status?: string | null
          suspended_at?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          created_at?: string
          date_of_birth?: string | null
          first_name?: string | null
          id?: string
          id_verification_status?: string | null
          interests?: string[] | null
          is_age_verified?: boolean | null
          is_paying_customer?: boolean | null
          is_suspended?: boolean | null
          last_name?: string | null
          last_username_change?: string | null
          location?: string | null
          profile_visibility?: boolean | null
          social_links?: Json | null
          status?: string | null
          suspended_at?: string | null
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
            referencedRelation: "profiles_with_stats"
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
            referencedRelation: "profiles_with_stats"
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
            referencedRelation: "profiles_with_stats"
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
            referencedRelation: "profiles_with_stats"
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
          created_at: string
          creator_id: string
          duration: number | null
          expires_at: string
          id: string
          is_active: boolean | null
          last_modified_by: string | null
          media_url: string | null
          screenshot_disabled: boolean | null
          video_url: string | null
        }
        Insert: {
          created_at?: string
          creator_id: string
          duration?: number | null
          expires_at?: string
          id?: string
          is_active?: boolean | null
          last_modified_by?: string | null
          media_url?: string | null
          screenshot_disabled?: boolean | null
          video_url?: string | null
        }
        Update: {
          created_at?: string
          creator_id?: string
          duration?: number | null
          expires_at?: string
          id?: string
          is_active?: boolean | null
          last_modified_by?: string | null
          media_url?: string | null
          screenshot_disabled?: boolean | null
          video_url?: string | null
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
            referencedRelation: "profiles_with_stats"
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
      subscription_tiers: {
        Row: {
          created_at: string
          features: Json
          id: string
          name: string
          price: number
        }
        Insert: {
          created_at?: string
          features: Json
          id?: string
          name: string
          price: number
        }
        Update: {
          created_at?: string
          features?: Json
          id?: string
          name?: string
          price?: number
        }
        Relationships: []
      }
      temp_demo_content: {
        Row: {
          content_type: string
          created_at: string | null
          description: string | null
          expires_at: string
          id: string
          image_url: string | null
          is_active: boolean | null
          title: string | null
        }
        Insert: {
          content_type: string
          created_at?: string | null
          description?: string | null
          expires_at: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          title?: string | null
        }
        Update: {
          content_type?: string
          created_at?: string | null
          description?: string | null
          expires_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          title?: string | null
        }
        Relationships: []
      }
      tips: {
        Row: {
          amount: number
          call_id: string | null
          created_at: string
          id: string
          recipient_id: string
          sender_id: string
          sender_name: string | null
        }
        Insert: {
          amount: number
          call_id?: string | null
          created_at?: string
          id?: string
          recipient_id: string
          sender_id: string
          sender_name?: string | null
        }
        Update: {
          amount?: number
          call_id?: string | null
          created_at?: string
          id?: string
          recipient_id?: string
          sender_id?: string
          sender_name?: string | null
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
            referencedRelation: "profiles_with_stats"
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
      user_subscriptions: {
        Row: {
          created_at: string
          current_period_end: string
          current_period_start: string
          id: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_tier_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          current_period_end: string
          current_period_start: string
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_tier_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_tier_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_subscription_tier_id_fkey"
            columns: ["subscription_tier_id"]
            isOneToOne: false
            referencedRelation: "subscription_tiers"
            referencedColumns: ["id"]
          },
        ]
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
            referencedRelation: "profiles_with_stats"
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
            referencedRelation: "profiles_with_stats"
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
            referencedRelation: "profiles_with_stats"
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
            referencedRelation: "profiles_with_stats"
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
            referencedRelation: "profiles_with_stats"
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
            referencedRelation: "profiles_with_stats"
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
    }
    Views: {
      active_ads_with_location: {
        Row: {
          about_me: string | null
          age_range: unknown | null
          avatar_url: string | null
          body_type: string | null
          city: string | null
          country: Database["public"]["Enums"]["nordic_country"] | null
          created_at: string | null
          description: string | null
          drinking_status: string | null
          education_level: string | null
          height: number | null
          id: string | null
          id_verification_status: string | null
          interests: string[] | null
          is_active: boolean | null
          is_age_verified: boolean | null
          languages: string[] | null
          last_active: string | null
          latitude: number | null
          longitude: number | null
          looking_for: string[] | null
          occupation: string | null
          preferred_age_range: unknown | null
          profile_completion_score: number | null
          relationship_status:
            | Database["public"]["Enums"]["relationship_status"]
            | null
          seeking_description: string | null
          smoking_status: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
          username: string | null
          views_count: number | null
        }
        Relationships: []
      }
      profiles_with_stats: {
        Row: {
          avatar_url: string | null
          banner_url: string | null
          bio: string | null
          created_at: string | null
          follower_count: number | null
          following_count: number | null
          id: string | null
          post_count: number | null
          status: string | null
          subscriber_count: number | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          created_at?: string | null
          follower_count?: never
          following_count?: never
          id?: string | null
          post_count?: never
          status?: string | null
          subscriber_count?: never
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          created_at?: string | null
          follower_count?: never
          following_count?: never
          id?: string | null
          post_count?: never
          status?: string | null
          subscriber_count?: never
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      top_creators_by_earnings: {
        Row: {
          avatar_url: string | null
          bio: string | null
          earnings_percentile: number | null
          id: string | null
          subscriber_count: number | null
          total_earnings: number | null
          username: string | null
        }
        Relationships: []
      }
      trending_content: {
        Row: {
          comments: number | null
          content_id: string | null
          content_type: string | null
          created_at: string | null
          creator_avatar: string | null
          creator_id: string | null
          creator_username: string | null
          likes: number | null
          media_interactions: number | null
          trending_rank: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      cleanup_expired_demo_content: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
