export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type StoryStatus = "draft" | "published" | "archived";
export type TranslationPublicationStatus = "draft" | "published" | "archived";
export type UserRole = "admin" | "editor";
export type MediaProvider = "wix" | "cloudinary";
export type BlockType =
  | "heading"
  | "rich_text"
  | "image"
  | "image_text_split"
  | "gallery"
  | "quote"
  | "youtube"
  | "callout"
  | "button_group"
  | "section_intro"
  | "divider"
  | "spacer";

/**
 * Dove CMS database schema.
 * All Dove application tables live in the `dove` Postgres schema, isolated from
 * the MTK Media `public` schema tables on the shared Supabase project.
 */
export interface Database {
  dove: {
    Tables: {
      form_submissions: {
        Row: {
          id: string;
          form_type: "contact" | "volunteer" | "travel" | "partnership";
          status: "received" | "delivered" | "delivery_failed" | "spam" | "archived";
          recipient: string;
          name: string;
          email: string;
          phone: string | null;
          organization: string | null;
          reason: string | null;
          message: string | null;
          locale: "en" | "es";
          payload: Json;
          delivery_error: string | null;
          provider_message_id: string | null;
          received_at: string;
          delivered_at: string | null;
          archived_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          form_type: "contact" | "volunteer" | "travel" | "partnership";
          status?: "received" | "delivered" | "delivery_failed" | "spam" | "archived";
          recipient: string;
          name: string;
          email: string;
          phone?: string | null;
          organization?: string | null;
          reason?: string | null;
          message?: string | null;
          locale: "en" | "es";
          payload?: Json;
          delivery_error?: string | null;
          provider_message_id?: string | null;
          received_at?: string;
          delivered_at?: string | null;
          archived_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          form_type?: "contact" | "volunteer" | "travel" | "partnership";
          status?: "received" | "delivered" | "delivery_failed" | "spam" | "archived";
          recipient?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          organization?: string | null;
          reason?: string | null;
          message?: string | null;
          locale?: "en" | "es";
          payload?: Json;
          delivery_error?: string | null;
          provider_message_id?: string | null;
          received_at?: string;
          delivered_at?: string | null;
          archived_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          display_name: string;
          role: UserRole;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name: string;
          role?: UserRole;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string;
          role?: UserRole;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      media_assets: {
        Row: {
          id: string;
          provider: MediaProvider;
          url: string;
          public_id: string | null;
          mime_type: string | null;
          width: number | null;
          height: number | null;
          bytes: number | null;
          original_filename: string | null;
          source: string | null;
          source_url: string | null;
          focal_x: number | null;
          focal_y: number | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          provider: MediaProvider;
          url: string;
          public_id?: string | null;
          mime_type?: string | null;
          width?: number | null;
          height?: number | null;
          bytes?: number | null;
          original_filename?: string | null;
          source?: string | null;
          source_url?: string | null;
          focal_x?: number | null;
          focal_y?: number | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          provider?: MediaProvider;
          url?: string;
          public_id?: string | null;
          mime_type?: string | null;
          width?: number | null;
          height?: number | null;
          bytes?: number | null;
          original_filename?: string | null;
          source?: string | null;
          source_url?: string | null;
          focal_x?: number | null;
          focal_y?: number | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      stories: {
        Row: {
          id: string;
          status: StoryStatus;
          author_id: string | null;
          author_name: string | null;
          cover_media_id: string | null;
          featured_home: boolean;
          featured_stories: boolean;
          published_at: string | null;
          scheduled_at: string | null;
          legacy_wix_id: string | null;
          legacy_wix_url: string | null;
          legacy_wix_slug: string | null;
          created_by: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
          archived_at: string | null;
        };
        Insert: {
          id?: string;
          status?: StoryStatus;
          author_id?: string | null;
          author_name?: string | null;
          cover_media_id?: string | null;
          featured_home?: boolean;
          featured_stories?: boolean;
          published_at?: string | null;
          scheduled_at?: string | null;
          legacy_wix_id?: string | null;
          legacy_wix_url?: string | null;
          legacy_wix_slug?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
          archived_at?: string | null;
        };
        Update: {
          id?: string;
          status?: StoryStatus;
          author_id?: string | null;
          author_name?: string | null;
          cover_media_id?: string | null;
          featured_home?: boolean;
          featured_stories?: boolean;
          published_at?: string | null;
          scheduled_at?: string | null;
          legacy_wix_id?: string | null;
          legacy_wix_url?: string | null;
          legacy_wix_slug?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
          archived_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "stories_cover_media_id_fkey";
            columns: ["cover_media_id"];
            isOneToOne: false;
            referencedRelation: "media_assets";
            referencedColumns: ["id"];
          }
        ];
      };
      story_translations: {
        Row: {
          id: string;
          story_id: string;
          locale: "en" | "es";
          slug: string;
          title: string;
          excerpt: string;
          seo_title: string | null;
          seo_description: string | null;
          publication_status: TranslationPublicationStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          story_id: string;
          locale: "en" | "es";
          slug: string;
          title: string;
          excerpt?: string;
          seo_title?: string | null;
          seo_description?: string | null;
          publication_status?: TranslationPublicationStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          story_id?: string;
          locale?: "en" | "es";
          slug?: string;
          title?: string;
          excerpt?: string;
          seo_title?: string | null;
          seo_description?: string | null;
          publication_status?: TranslationPublicationStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "story_translations_story_id_fkey";
            columns: ["story_id"];
            isOneToOne: false;
            referencedRelation: "stories";
            referencedColumns: ["id"];
          }
        ];
      };
      story_blocks: {
        Row: {
          id: string;
          story_translation_id: string;
          block_type: BlockType;
          sort_order: number;
          data: Json;
          settings: Json;
          visible: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          story_translation_id: string;
          block_type: BlockType;
          sort_order?: number;
          data?: Json;
          settings?: Json;
          visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          story_translation_id?: string;
          block_type?: BlockType;
          sort_order?: number;
          data?: Json;
          settings?: Json;
          visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "story_blocks_story_translation_id_fkey";
            columns: ["story_translation_id"];
            isOneToOne: false;
            referencedRelation: "story_translations";
            referencedColumns: ["id"];
          }
        ];
      };
      categories: {
        Row: {
          id: string;
          internal_key: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          internal_key: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          internal_key?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      category_translations: {
        Row: {
          id: string;
          category_id: string;
          locale: "en" | "es";
          name: string;
          slug: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          locale: "en" | "es";
          name: string;
          slug: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          locale?: "en" | "es";
          name?: string;
          slug?: string;
        };
        Relationships: [
          {
            foreignKeyName: "category_translations_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
      story_categories: {
        Row: {
          story_id: string;
          category_id: string;
        };
        Insert: {
          story_id: string;
          category_id: string;
        };
        Update: {
          story_id?: string;
          category_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "story_categories_story_id_fkey";
            columns: ["story_id"];
            isOneToOne: false;
            referencedRelation: "stories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "story_categories_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
      tags: {
        Row: {
          id: string;
          internal_key: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          internal_key: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          internal_key?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      tag_translations: {
        Row: {
          id: string;
          tag_id: string;
          locale: "en" | "es";
          name: string;
          slug: string;
        };
        Insert: {
          id?: string;
          tag_id: string;
          locale: "en" | "es";
          name: string;
          slug: string;
        };
        Update: {
          id?: string;
          tag_id?: string;
          locale?: "en" | "es";
          name?: string;
          slug?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tag_translations_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          }
        ];
      };
      story_tags: {
        Row: {
          story_id: string;
          tag_id: string;
        };
        Insert: {
          story_id: string;
          tag_id: string;
        };
        Update: {
          story_id?: string;
          tag_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "story_tags_story_id_fkey";
            columns: ["story_id"];
            isOneToOne: false;
            referencedRelation: "stories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "story_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          }
        ];
      };
      redirects: {
        Row: {
          id: string;
          source_path: string;
          destination_path: string;
          status_code: number;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          source_path: string;
          destination_path: string;
          status_code?: number;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          source_path?: string;
          destination_path?: string;
          status_code?: number;
          active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      wix_import_map: {
        Row: {
          id: string;
          entity_type: "post" | "category" | "tag" | "media" | "author";
          wix_id: string;
          local_id: string;
          wix_url: string | null;
          source_checksum: string | null;
          imported_at: string;
          last_synced_at: string;
        };
        Insert: {
          id?: string;
          entity_type: "post" | "category" | "tag" | "media" | "author";
          wix_id: string;
          local_id: string;
          wix_url?: string | null;
          source_checksum?: string | null;
          imported_at?: string;
          last_synced_at?: string;
        };
        Update: {
          id?: string;
          entity_type?: "post" | "category" | "tag" | "media" | "author";
          wix_id?: string;
          local_id?: string;
          wix_url?: string | null;
          source_checksum?: string | null;
          imported_at?: string;
          last_synced_at?: string;
        };
        Relationships: [];
      };
      audit_log: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          action?: string;
          entity_type?: string;
          entity_id?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      migration_runs: {
        Row: {
          id: string;
          source: string;
          started_at: string;
          completed_at: string | null;
          status: "running" | "completed" | "failed" | "dry_run";
          stats: Json;
          errors: Json;
        };
        Insert: {
          id?: string;
          source?: string;
          started_at?: string;
          completed_at?: string | null;
          status?: "running" | "completed" | "failed" | "dry_run";
          stats?: Json;
          errors?: Json;
        };
        Update: {
          id?: string;
          source?: string;
          started_at?: string;
          completed_at?: string | null;
          status?: "running" | "completed" | "failed" | "dry_run";
          stats?: Json;
          errors?: Json;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      is_editor: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
