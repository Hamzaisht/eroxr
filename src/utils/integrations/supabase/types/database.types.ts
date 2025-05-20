
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
          username: string
          avatar_url: string
          created_at: string
          updated_at: string
          is_age_verified: boolean
          date_of_birth: string | null
          bio: string | null
          subscription_tier: string | null
          can_access_bodycontact: boolean
        }
      }
      dating_ads: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          location: string
          created_at: string
          updated_at: string
          is_active: boolean
          is_verified: boolean
          is_premium: boolean
          tags: string[]
        }
      }
    }
    Enums: {
      nordic_country: "denmark" | "finland" | "iceland" | "norway" | "sweden"
    }
  }
}
