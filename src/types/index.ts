export interface OrganisationProfile {
  id: string
  user_id: string
  name: string
  cvr_number: string | null
  website_url: string | null
  mission: string | null
  programs: string | null
  target_audience: string | null
  geographic_focus: string | null
  key_messages: string | null
  brand_voice: string | null
  annual_income: string | null
  logo_url: string | null
  created_at: string
  updated_at: string
}

export interface Output {
  id: string
  user_id: string
  tool_slug: string
  title: string | null
  input_data: Record<string, unknown> | null
  output_text: string
  created_at: string
}

export interface UsageLog {
  id: string
  user_id: string
  tool_slug: string
  tokens_used: number | null
  created_at: string
}

export interface ToolConfig {
  slug: string
  name: string
  description: string
  icon: string
}
