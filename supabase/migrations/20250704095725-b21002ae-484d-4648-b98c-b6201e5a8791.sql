
-- Remove cargo management and inventory related tables
DROP TABLE IF EXISTS public.cargo CASCADE;
DROP TABLE IF EXISTS public.spare_parts CASCADE;
DROP TABLE IF EXISTS public.parts_usage CASCADE;

-- Clean up any references in maintenance table
ALTER TABLE public.maintenance 
DROP COLUMN IF EXISTS parts_used;
