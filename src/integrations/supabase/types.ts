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
      anime: {
        Row: {
          banner_image: string | null
          cover_image: string | null
          created_at: string | null
          episode_count: number | null
          genres: string[] | null
          id: string
          rating: number | null
          release_year: number | null
          status: Database["public"]["Enums"]["content_status"] | null
          studio: string | null
          synopsis: string | null
          title: string
          title_english: string | null
          title_japanese: string | null
          updated_at: string | null
        }
        Insert: {
          banner_image?: string | null
          cover_image?: string | null
          created_at?: string | null
          episode_count?: number | null
          genres?: string[] | null
          id?: string
          rating?: number | null
          release_year?: number | null
          status?: Database["public"]["Enums"]["content_status"] | null
          studio?: string | null
          synopsis?: string | null
          title: string
          title_english?: string | null
          title_japanese?: string | null
          updated_at?: string | null
        }
        Update: {
          banner_image?: string | null
          cover_image?: string | null
          created_at?: string | null
          episode_count?: number | null
          genres?: string[] | null
          id?: string
          rating?: number | null
          release_year?: number | null
          status?: Database["public"]["Enums"]["content_status"] | null
          studio?: string | null
          synopsis?: string | null
          title?: string
          title_english?: string | null
          title_japanese?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      chapters: {
        Row: {
          chapter_number: number
          created_at: string | null
          google_drive_link: string | null
          id: string
          manga_id: string | null
          page_count: number | null
          release_date: string | null
          thumbnail: string | null
          title: string
        }
        Insert: {
          chapter_number: number
          created_at?: string | null
          google_drive_link?: string | null
          id?: string
          manga_id?: string | null
          page_count?: number | null
          release_date?: string | null
          thumbnail?: string | null
          title: string
        }
        Update: {
          chapter_number?: number
          created_at?: string | null
          google_drive_link?: string | null
          id?: string
          manga_id?: string | null
          page_count?: number | null
          release_date?: string | null
          thumbnail?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "chapters_manga_id_fkey"
            columns: ["manga_id"]
            isOneToOne: false
            referencedRelation: "manga"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string | null
          id: string
          last_message_at: string | null
          participant_one_id: string
          participant_two_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          participant_one_id: string
          participant_two_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          participant_one_id?: string
          participant_two_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_participant_one_id_fkey"
            columns: ["participant_one_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_participant_two_id_fkey"
            columns: ["participant_two_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      episodes: {
        Row: {
          air_date: string | null
          anime_id: string | null
          created_at: string | null
          description: string | null
          duration: number | null
          episode_number: number
          google_drive_link: string | null
          id: string
          season_id: string | null
          thumbnail: string | null
          title: string
        }
        Insert: {
          air_date?: string | null
          anime_id?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          episode_number: number
          google_drive_link?: string | null
          id?: string
          season_id?: string | null
          thumbnail?: string | null
          title: string
        }
        Update: {
          air_date?: string | null
          anime_id?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          episode_number?: number
          google_drive_link?: string | null
          id?: string
          season_id?: string | null
          thumbnail?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "episodes_anime_id_fkey"
            columns: ["anime_id"]
            isOneToOne: false
            referencedRelation: "anime"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "episodes_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          content_id: string
          content_type: string
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      manga: {
        Row: {
          artist: string | null
          author: string | null
          banner_image: string | null
          chapter_count: number | null
          cover_image: string | null
          created_at: string | null
          genres: string[] | null
          id: string
          rating: number | null
          status: Database["public"]["Enums"]["content_status"] | null
          synopsis: string | null
          title: string
          title_english: string | null
          title_japanese: string | null
          updated_at: string | null
        }
        Insert: {
          artist?: string | null
          author?: string | null
          banner_image?: string | null
          chapter_count?: number | null
          cover_image?: string | null
          created_at?: string | null
          genres?: string[] | null
          id?: string
          rating?: number | null
          status?: Database["public"]["Enums"]["content_status"] | null
          synopsis?: string | null
          title: string
          title_english?: string | null
          title_japanese?: string | null
          updated_at?: string | null
        }
        Update: {
          artist?: string | null
          author?: string | null
          banner_image?: string | null
          chapter_count?: number | null
          cover_image?: string | null
          created_at?: string | null
          genres?: string[] | null
          id?: string
          rating?: number | null
          status?: Database["public"]["Enums"]["content_status"] | null
          synopsis?: string | null
          title?: string
          title_english?: string | null
          title_japanese?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          read_at: string | null
          recipient_id: string
          sender_id: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          read_at?: string | null
          recipient_id: string
          sender_id: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          author_id: string | null
          category: Database["public"]["Enums"]["news_category"] | null
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image: string | null
          id: string
          published_at: string | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          category?: Database["public"]["Enums"]["news_category"] | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          category?: Database["public"]["Enums"]["news_category"] | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "news_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          dark_mode: boolean | null
          display_name: string | null
          id: string
          language: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          dark_mode?: boolean | null
          display_name?: string | null
          id: string
          language?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          dark_mode?: boolean | null
          display_name?: string | null
          id?: string
          language?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      seasons: {
        Row: {
          anime_id: string | null
          cover_image: string | null
          created_at: string
          description: string | null
          episode_count: number | null
          id: string
          release_year: number | null
          season_number: number
          title: string
          updated_at: string
        }
        Insert: {
          anime_id?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          episode_count?: number | null
          id?: string
          release_year?: number | null
          season_number: number
          title: string
          updated_at?: string
        }
        Update: {
          anime_id?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          episode_count?: number | null
          id?: string
          release_year?: number | null
          season_number?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "seasons_anime_id_fkey"
            columns: ["anime_id"]
            isOneToOne: false
            referencedRelation: "anime"
            referencedColumns: ["id"]
          },
        ]
      }
      user_history: {
        Row: {
          content_id: string
          content_type: string
          created_at: string | null
          id: string
          last_accessed: string | null
          last_chapter: number | null
          last_episode: number | null
          progress_percentage: number | null
          user_id: string | null
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string | null
          id?: string
          last_accessed?: string | null
          last_chapter?: number | null
          last_episode?: number | null
          progress_percentage?: number | null
          user_id?: string | null
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string | null
          id?: string
          last_accessed?: string | null
          last_chapter?: number | null
          last_episode?: number | null
          progress_percentage?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      content_status: "ongoing" | "completed" | "upcoming" | "cancelled"
      news_category: "industry" | "reviews" | "trailers" | "events"
      user_role: "user" | "moderator" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      content_status: ["ongoing", "completed", "upcoming", "cancelled"],
      news_category: ["industry", "reviews", "trailers", "events"],
      user_role: ["user", "moderator", "admin"],
    },
  },
} as const
