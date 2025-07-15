
-- Add new columns to trucks table for Kenyan licensing and certification tracking
ALTER TABLE public.trucks 
ADD COLUMN ntsa_expiry DATE,
ADD COLUMN insurance_expiry DATE,
ADD COLUMN tgl_expiry DATE,
ADD COLUMN last_service_mileage INTEGER DEFAULT 0;

-- Update existing trucks to have default values
UPDATE public.trucks 
SET last_service_mileage = COALESCE(mileage, 0) 
WHERE last_service_mileage IS NULL;
