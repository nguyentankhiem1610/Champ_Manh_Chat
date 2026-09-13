-- ============================================================
-- Migration 036: Farmer Farming Profile (Thẻ 17 - Thông tin canh tác)
-- ============================================================
-- Adds personal information and farming data fields to public.profiles:
-- 1. Personal Information: full_name, farm_address
-- 2. Production Information: crop_type, farm_area, gps_lat, gps_lng, gps_location_name, farming_model, farming_model_other
-- 3. Crop Season Information: rice_variety, rice_variety_other, sowing_date, crop_season, crop_season_other, growth_stage, expected_yield
-- ============================================================

-- Add new columns to profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS farm_address TEXT,
  ADD COLUMN IF NOT EXISTS crop_type TEXT DEFAULT 'Lúa',
  ADD COLUMN IF NOT EXISTS farm_area NUMERIC,
  ADD COLUMN IF NOT EXISTS gps_lat DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS gps_lng DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS gps_location_name TEXT,
  ADD COLUMN IF NOT EXISTS farming_model TEXT,
  ADD COLUMN IF NOT EXISTS farming_model_other TEXT,
  ADD COLUMN IF NOT EXISTS rice_variety TEXT,
  ADD COLUMN IF NOT EXISTS rice_variety_other TEXT,
  ADD COLUMN IF NOT EXISTS sowing_date DATE,
  ADD COLUMN IF NOT EXISTS crop_season TEXT,
  ADD COLUMN IF NOT EXISTS crop_season_other TEXT,
  ADD COLUMN IF NOT EXISTS growth_stage TEXT,
  ADD COLUMN IF NOT EXISTS expected_yield NUMERIC,
  ADD COLUMN IF NOT EXISTS current_salinity NUMERIC;

-- Comments for documentation
COMMENT ON COLUMN public.profiles.full_name IS 'Họ và tên của người nông dân';
COMMENT ON COLUMN public.profiles.farm_address IS 'Địa chỉ sản xuất / canh tác nông nghiệp';
COMMENT ON COLUMN public.profiles.crop_type IS 'Loại cây trồng (Mặc định: Lúa)';
COMMENT ON COLUMN public.profiles.farm_area IS 'Diện tích sản xuất (ha)';
COMMENT ON COLUMN public.profiles.gps_lat IS 'Vĩ độ GPS vị trí ruộng';
COMMENT ON COLUMN public.profiles.gps_lng IS 'Kinh độ GPS vị trí ruộng';
COMMENT ON COLUMN public.profiles.gps_location_name IS 'Tên hoặc mô tả vị trí GPS';
COMMENT ON COLUMN public.profiles.farming_model IS 'Mô hình canh tác hiện tại (Lúa độc canh, Lúa-Lúa, Lúa-Tôm, Lúa-Màu, Khác)';
COMMENT ON COLUMN public.profiles.farming_model_other IS 'Chi tiết mô hình canh tác nếu chọn Khác';
COMMENT ON COLUMN public.profiles.rice_variety IS 'Giống đang sử dụng (OM18, OM5451, Đài Thơm 8, IR4625, IR50404, Khác)';
COMMENT ON COLUMN public.profiles.rice_variety_other IS 'Tên giống khác nếu chọn Khác';
COMMENT ON COLUMN public.profiles.sowing_date IS 'Ngày gieo sạ / trồng';
COMMENT ON COLUMN public.profiles.crop_season IS 'Vụ sản xuất (Đông Xuân, Hè Thu, Thu Đông, Vụ Mùa, Khác)';
COMMENT ON COLUMN public.profiles.crop_season_other IS 'Tên vụ khác nếu chọn Khác';
COMMENT ON COLUMN public.profiles.growth_stage IS 'Giai đoạn sinh trưởng hiện tại (Gieo sạ, Mạ, Đẻ nhánh, Làm đòng, Trổ, Chín, Thu hoạch)';
COMMENT ON COLUMN public.profiles.expected_yield IS 'Sản lượng dự kiến (tấn/vụ)';
COMMENT ON COLUMN public.profiles.current_salinity IS 'Độ mặn hiện tại (‰ hoặc g/L)';
