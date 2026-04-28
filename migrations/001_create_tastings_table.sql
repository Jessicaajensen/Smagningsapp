
-- Create tastings table
CREATE TABLE IF NOT EXISTS public.tastings (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  beverage_type VARCHAR(50) NOT NULL,
  responses JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tastings_user_id ON public.tastings(user_id);
CREATE INDEX IF NOT EXISTS idx_tastings_beverage_type ON public.tastings(beverage_type);
CREATE INDEX IF NOT EXISTS idx_tastings_created_at ON public.tastings(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.tastings ENABLE ROW LEVEL SECURITY;

-- Create RLS policy: Users can only see their own tastings
CREATE POLICY "Users can view their own tastings"
  ON public.tastings
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create RLS policy: Users can only insert their own tastings
CREATE POLICY "Users can insert their own tastings"
  ON public.tastings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policy: Users can only update their own tastings
CREATE POLICY "Users can update their own tastings"
  ON public.tastings
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create RLS policy: Users can only delete their own tastings
CREATE POLICY "Users can delete their own tastings"
  ON public.tastings
  FOR DELETE
  USING (auth.uid() = user_id);

-- Optional: Create a view for tastings statistics
CREATE OR REPLACE VIEW public.tastings_summary AS
SELECT
  user_id,
  beverage_type,
  COUNT(*) as tasting_count,
  MAX(created_at) as last_tasting_date,
  MIN(created_at) as first_tasting_date
FROM public.tastings
GROUP BY user_id, beverage_type;
