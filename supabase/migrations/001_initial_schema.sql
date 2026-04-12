-- Initial Schema for Magnetic Fundraising Toolkit
-- Tables: organisation_profiles, outputs, usage_log
-- Includes RLS policies, triggers, and indexes

-- =====================================================
-- 1. CREATE TABLES
-- =====================================================

-- Table: organisation_profiles
CREATE TABLE organisation_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  cvr_number TEXT,
  website_url TEXT,
  mission TEXT,
  programs TEXT,
  target_audience TEXT,
  geographic_focus TEXT,
  key_messages TEXT,
  brand_voice TEXT,
  annual_income TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT organisation_profiles_user_id_unique UNIQUE (user_id)
);

-- Table: outputs
CREATE TABLE outputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_slug TEXT NOT NULL,
  title TEXT,
  input_data JSONB,
  output_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: usage_log
CREATE TABLE usage_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_slug TEXT NOT NULL,
  tokens_used INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 2. CREATE INDEXES
-- =====================================================

CREATE INDEX idx_organisation_profiles_user_id ON organisation_profiles(user_id);
CREATE INDEX idx_outputs_user_id_created_at ON outputs(user_id, created_at DESC);
CREATE INDEX idx_usage_log_user_id_created_at ON usage_log(user_id, created_at DESC);

-- =====================================================
-- 3. CREATE TRIGGER FUNCTION FOR updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to organisation_profiles
CREATE TRIGGER update_organisation_profiles_updated_at
  BEFORE UPDATE ON organisation_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 4. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE organisation_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE outputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_log ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. CREATE RLS POLICIES
-- =====================================================

-- Policies for organisation_profiles
CREATE POLICY "Users can view their own organisation profile"
  ON organisation_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own organisation profile"
  ON organisation_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own organisation profile"
  ON organisation_profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own organisation profile"
  ON organisation_profiles
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for outputs
CREATE POLICY "Users can view their own outputs"
  ON outputs
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own outputs"
  ON outputs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own outputs"
  ON outputs
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own outputs"
  ON outputs
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for usage_log
CREATE POLICY "Users can view their own usage logs"
  ON usage_log
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage logs"
  ON usage_log
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage logs"
  ON usage_log
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own usage logs"
  ON usage_log
  FOR DELETE
  USING (auth.uid() = user_id);
