-- ============================================================
-- Migration 037: Add Current Salinity to Farmer Profiles (Mục 2.4 - Độ mặn hiện tại)
-- ============================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS current_salinity NUMERIC;

COMMENT ON COLUMN public.profiles.current_salinity IS 'Độ mặn hiện tại (‰ hoặc g/L)';

