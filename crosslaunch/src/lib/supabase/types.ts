export interface Database {
  public: {
    Tables: {
      startups: {
        Row: {
          id: string
          name: string
          url: string | null
          description: string | null
          business_model: string | null
          category: string | null
          keywords: string[] | null
          founded_year: number | null
          headquarters_country: string | null
          is_successful: boolean | null
          success_indicators: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          url?: string | null
          description?: string | null
          business_model?: string | null
          category?: string | null
          keywords?: string[] | null
          founded_year?: number | null
          headquarters_country?: string | null
          is_successful?: boolean | null
          success_indicators?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          url?: string | null
          description?: string | null
          business_model?: string | null
          category?: string | null
          keywords?: string[] | null
          founded_year?: number | null
          headquarters_country?: string | null
          is_successful?: boolean | null
          success_indicators?: any | null
          created_at?: string
          updated_at?: string
        }
      }
      markets: {
        Row: {
          id: string
          country_code: string
          country_name: string | null
          population: number | null
          internet_penetration: number | null
          gdp_per_capita: number | null
          languages: string[] | null
          primary_search_engine: string | null
          app_stores: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          country_code: string
          country_name?: string | null
          population?: number | null
          internet_penetration?: number | null
          gdp_per_capita?: number | null
          languages?: string[] | null
          primary_search_engine?: string | null
          app_stores?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          country_code?: string
          country_name?: string | null
          population?: number | null
          internet_penetration?: number | null
          gdp_per_capita?: number | null
          languages?: string[] | null
          primary_search_engine?: string | null
          app_stores?: string[] | null
          created_at?: string
        }
      }
      opportunities: {
        Row: {
          id: string
          startup_id: string | null
          market_country_code: string | null
          opportunity_score: number | null
          presence_signals: any | null
          competitive_landscape: any | null
          market_readiness: any | null
          last_checked: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          startup_id?: string | null
          market_country_code?: string | null
          opportunity_score?: number | null
          presence_signals?: any | null
          competitive_landscape?: any | null
          market_readiness?: any | null
          last_checked?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          startup_id?: string | null
          market_country_code?: string | null
          opportunity_score?: number | null
          presence_signals?: any | null
          competitive_landscape?: any | null
          market_readiness?: any | null
          last_checked?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_searches: {
        Row: {
          id: string
          user_id: string | null
          search_query: string | null
          startup_url: string | null
          results: any | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          search_query?: string | null
          startup_url?: string | null
          results?: any | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          search_query?: string | null
          startup_url?: string | null
          results?: any | null
          created_at?: string
        }
      }
    }
  }
}

export type Startup = Database['public']['Tables']['startups']['Row']
export type Market = Database['public']['Tables']['markets']['Row']
export type Opportunity = Database['public']['Tables']['opportunities']['Row']
export type UserSearch = Database['public']['Tables']['user_searches']['Row']