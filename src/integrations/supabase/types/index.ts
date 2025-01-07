export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export * from './profile';
export * from './comment';
export * from './creator';
export * from './dating';
export * from './message';
export * from './post';
export * from './story';
export * from './subscription';
export * from './verification';

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
        Relationships: []
      },
      comments: {
        Row: Comment;
        Insert: CommentInsert;
        Update: CommentUpdate;
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
          }
        ]
      },
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
          }
        ]
      },
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
          }
        ]
      },
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
          }
        ]
      },
      dating_ads: {
        Row: {
          about_me: string | null
          age_range: unknown
          body_type: string | null
          city: string
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
          looking_for: string[]
          occupation: string | null
          preferred_age_range: unknown | null
          profile_completion_score: number | null
          relationship_status: Database["public"]["Enums"]["relationship_status"]
          seeking_description: string | null
          smoking_status: string | null
          title: string
          updated_at: string | null
          user_id: string | null
          views_count: number | null
        }
        Insert: {
          about_me?: string | null
          age_range: unknown
          body_type?: string | null
          city: string
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
          looking_for: string[]
          occupation?: string | null
          preferred_age_range?: unknown | null
          profile_completion_score?: number | null
          relationship_status: Database["public"]["Enums"]["relationship_status"]
          seeking_description?: string | null
          smoking_status?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
          views_count?: number | null
        }
        Update: {
          about_me?: string | null
          age_range?: unknown
          body_type?: string | null
          city?: string
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
          looking_for?: string[]
          occupation?: string | null
          preferred_age_range?: unknown | null
          profile_completion_score?: number | null
          relationship_status?: Database["public"]["Enums"]["relationship_status"]
          seeking_description?: string | null
          smoking_status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
          views_count?: number | null
        }
        Relationships: []
      },
      direct_messages: {
        Row: {
          content: string | null
          created_at: string | null
          duration: number | null
          expires_at: string | null
          id: string
          is_expired: boolean | null
          media_url: string[] | null
          message_type: string | null
          recipient_id: string | null
          sender_id: string | null
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
          message_type?: string | null
          recipient_id?: string | null
          sender_id?: string | null
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
          message_type?: string | null
          recipient_id?: string | null
          sender_id?: string | null
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
          }
        ]
      },
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
          }
        ]
      },
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
      },
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
      },
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
          post_id: string
          user_id: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          }
        ]
      },
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
          }
        ]
      },
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
          post_id: string
          user_id: string
        }
        Relationships: [
          {
            foreignKeyName: "post_saves_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          }
        ]
      },
      posts: {
        Row: {
          comments_count: number | null
          content: string
          created_at: string
          creator_id: string
          id: string
          is_ppv: boolean | null
          likes_count: number | null
          media_url: string[] | null
          ppv_amount: number | null
          tags: string[] | null
          updated_at: string
          video_urls: string[] | null
          visibility: string | null
        }
        Insert: {
          comments_count?: number | null
          content: string
          created_at?: string
          creator_id: string
          id?: string
          is_ppv?: boolean | null
          likes_count?: number | null
          media_url?: string[] | null
          ppv_amount?: number | null
          tags?: string[] | null
          updated_at?: string
          video_urls?: string[] | null
          visibility?: string | null
        }
        Update: {
          comments_count?: number | null
          content?: string
          created_at?: string
          creator_id?: string
          id?: string
          is_ppv?: boolean | null
          likes_count?: number | null
          media_url?: string[] | null
          ppv_amount?: number | null
          tags?: string[] | null
          updated_at?: string
          video_urls?: string[] | null
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
          }
        ]
      },
      stories: {
        Row: {
          created_at: string
          creator_id: string
          expires_at: string
          id: string
          is_active: boolean | null
          media_url: string
          screenshot_disabled: boolean | null
        }
        Insert: {
          created_at?: string
          creator_id: string
          expires_at?: string
          id?: string
          is_active?: boolean | null
          media_url: string
          screenshot_disabled?: boolean | null
        }
        Update: {
          created_at?: string
          creator_id?: string
          expires_at?: string
          id?: string
          is_active?: boolean | null
          media_url?: string
          screenshot_disabled?: boolean | null
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
          }
        ]
      },
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
      },
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
          id: string
          image_url?: string | null
          is_active?: boolean | null
          title?: string | null
        }
        Update: {
          content_type?: string
          created_at?: string | null
          description?: string | null
          expires_at: string
          id: string
          image_url?: string | null
          is_active?: boolean | null
          title?: string | null
        }
        Relationships: []
      },
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
          status: string
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
          }
        ]
      }
    },
    Views: {
      profiles_with_stats: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string | null
          subscriber_count: number | null
          updated_at: string | null
          username: string | null
        }
        Relationships: []
      },
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
    },
    Functions: {
      cleanup_expired_demo_content: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    },
    Enums: {
      body_type: "athletic" | "average" | "slim" | "curvy" | "muscular" | "plus_size"
      drinking_status: "non_drinker" | "occasional" | "regular"
      education_level: "high_school" | "college" | "bachelor" | "master" | "phd"
      nordic_country: "denmark" | "finland" | "iceland" | "norway" | "sweden"
      relationship_status: "single" | "couple" | "other"
      smoking_status: "non_smoker" | "occasional" | "regular"
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database['public']['Tables'] & Database['public']['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
      Database['public']['Views'])
  ? (Database['public']['Tables'] &
      Database['public']['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database['public']['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof Database['public']['Enums']
    ? Database['public']['Enums'][PublicEnumNameOrOptions]
    : never
