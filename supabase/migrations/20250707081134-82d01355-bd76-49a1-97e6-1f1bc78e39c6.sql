
-- Add items_purchased column to maintenance table
ALTER TABLE public.maintenance 
ADD COLUMN items_purchased TEXT;
