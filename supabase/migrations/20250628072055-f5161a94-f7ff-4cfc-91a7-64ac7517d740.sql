
-- Add estimated_wear_tear_ksh column to the trips table
ALTER TABLE public.trips 
ADD COLUMN estimated_wear_tear_ksh NUMERIC;

-- Add a comment to describe the column
COMMENT ON COLUMN public.trips.estimated_wear_tear_ksh IS 'Estimated wear and tear cost in Kenyan Shillings for the trip';
