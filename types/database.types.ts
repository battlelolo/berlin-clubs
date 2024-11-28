// types/database.types.ts
export interface Database {
    public: {
      Tables: {
        clubs: {
          Row: {
            id: string
            name: string
            description: string | null
            location: string
            coordinates: unknown
            address: string | null
            music_types: string[] | null
            rating: number | null
            price_range: number | null
            opening_hours: any | null
            features: string[] | null
            images: string[] | null
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: string
            name: string
            description?: string | null
            location: string
            coordinates?: unknown
            address?: string | null
            music_types?: string[] | null
            rating?: number | null
            price_range?: number | null
            opening_hours?: any | null
            features?: string[] | null
            images?: string[] | null
            created_at?: string
            updated_at?: string
          }
          Update: Partial<Database['public']['Tables']['clubs']['Insert']>
        }
      }
    }
  }