export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
          is_age_verified: boolean | null
          date_of_birth: string | null
          id_verification_status: string | null
          bio: string | null
          location: string | null
          interests: string[] | null
          social_links: Json | null
          profile_visibility: boolean | null
          is_paying_customer: boolean | null
          banner_url: string | null
          first_name: string | null
          last_name: string | null
          is_suspended: boolean | null
          suspended_at: string | null
          status: 'online' | 'offline' | 'away' | 'busy' | null
        }
        Insert: {
          id: string
          username?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          is_age_verified?: boolean | null
          date_of_birth?: string | null
          id_verification_status?: string | null
          bio?: string | null
          location?: string | null
          interests?: string[] | null
          social_links?: Json | null
          profile_visibility?: boolean | null
          is_paying_customer?: boolean | null
          banner_url?: string | null
          first_name?: string | null
          last_name?: string | null
          is_suspended?: boolean | null
          suspended_at?: string | null
          status?: 'online' | 'offline' | 'away' | 'busy' | null
        }
        Update: {
          id?: string
          username?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          is_age_verified?: boolean | null
          date_of_birth?: string | null
          id_verification_status?: string | null
          bio?: string | null
          location?: string | null
          interests?: string[] | null
          social_links?: Json | null
          profile_visibility?: boolean | null
          is_paying_customer?: boolean | null
          banner_url?: string | null
          first_name?: string | null
          last_name?: string | null
          is_suspended?: boolean | null
          suspended_at?: string | null
          status?: 'online' | 'offline' | 'away' | 'busy' | null
        }
      }
      user_roles: {
        Row: {
          id: string
          user_id: string | null
          role: 'user' | 'admin' | 'creator'
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          role?: 'user' | 'admin' | 'creator'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          role?: 'user' | 'admin' | 'creator'
          created_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          creator_id: string
          content: string
          media_url: string[] | null
          video_urls: string[] | null
          created_at: string
          updated_at: string
          likes_count: number | null
          comments_count: number | null
          visibility: 'public' | 'subscribers_only'
          tags: string[] | null
          is_ppv: boolean
          ppv_amount: number | null
          screenshots_count: number | null
          downloads_count: number | null
        }
        Insert: {
          id?: string
          creator_id: string
          content: string
          media_url?: string[] | null
          video_urls?: string[] | null
          created_at?: string
          updated_at?: string
          likes_count?: number | null
          comments_count?: number | null
          visibility?: 'public' | 'subscribers_only'
          tags?: string[] | null
          is_ppv?: boolean
          ppv_amount?: number | null
          screenshots_count?: number | null
          downloads_count?: number | null
        }
        Update: {
          id?: string
          creator_id?: string
          content?: string
          media_url?: string[] | null
          video_urls?: string[] | null
          created_at?: string
          updated_at?: string
          likes_count?: number | null
          comments_count?: number | null
          visibility?: 'public' | 'subscribers_only'
          tags?: string[] | null
          is_ppv?: boolean
          ppv_amount?: number | null
          screenshots_count?: number | null
          downloads_count?: number | null
        }
      }
      stories: {
        Row: {
          id: string
          creator_id: string
          media_url: string | null
          video_url: string | null
          duration: number | null
          created_at: string
          expires_at: string
          is_active: boolean
          screenshot_disabled: boolean
        }
        Insert: {
          id: string
          creator_id: string
          media_url?: string | null
          video_url?: string | null
          duration?: number | null
          created_at?: string
          expires_at: string
          is_active?: boolean
          screenshot_disabled?: boolean
        }
        Update: {
          id?: string
          creator_id?: string
          media_url?: string | null
          video_url?: string | null
          duration?: number | null
          created_at?: string
          expires_at?: string
          is_active?: boolean
          screenshot_disabled?: boolean
        }
      }
      dating_ads: {
        Row: {
          id: string
          creator_id: string
          title: string
          description: string
          about_me: string
          age_range: number[]
          preferred_age_range: number[]
          gender: string
          seeking_gender: string
          body_type: string
          height: number | null
          drinking_status: string
          smoking_status: string
          relationship_status: string
          has_children: boolean
          wants_children: boolean
          education_level: string
          occupation: string
          interests: string[]
          city: string
          country: 'denmark' | 'finland' | 'iceland' | 'norway' | 'sweden'
          photos: string[]
          created_at: string
          updated_at: string
          views_count: number
          likes_count: number
          user_type: 'standard' | 'premium' | 'verified'
        }
        Insert: {
          id?: string
          creator_id: string
          title: string
          description: string
          about_me: string
          age_range: number[]
          preferred_age_range: number[]
          gender: string
          seeking_gender: string
          body_type: string
          height?: number | null
          drinking_status: string
          smoking_status: string
          relationship_status: string
          has_children: boolean
          wants_children: boolean
          education_level: string
          occupation: string
          interests: string[]
          city: string
          country: 'denmark' | 'finland' | 'iceland' | 'norway' | 'sweden'
          photos: string[]
          created_at?: string
          updated_at?: string
          views_count?: number
          likes_count?: number
          user_type: 'standard' | 'premium' | 'verified'
        }
        Update: {
          id?: string
          creator_id?: string
          title?: string
          description?: string
          about_me?: string
          age_range?: number[]
          preferred_age_range?: number[]
          gender?: string
          seeking_gender?: string
          body_type?: string
          height?: number | null
          drinking_status?: string
          smoking_status?: string
          relationship_status?: string
          has_children?: boolean
          wants_children?: boolean
          education_level?: string
          occupation?: string
          interests?: string[]
          city?: string
          country?: 'denmark' | 'finland' | 'iceland' | 'norway' | 'sweden'
          photos?: string[]
          created_at?: string
          updated_at?: string
          views_count?: number
          likes_count?: number
          user_type?: 'standard' | 'premium' | 'verified'
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          content: string
          created_at: string
          is_read: boolean
        }
        Insert: {
          id: string
          user_id: string
          type: string
          content: string
          created_at?: string
          is_read?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          content?: string
          created_at?: string
          is_read?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: 'user' | 'admin' | 'creator'
    }
  }
}