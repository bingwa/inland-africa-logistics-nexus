-- Add maintenance fields
ALTER TABLE public.maintenance
  ADD COLUMN IF NOT EXISTS labor_cost numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'corrective';

-- Limit category values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'maintenance_category_valid'
  ) THEN
    ALTER TABLE public.maintenance 
      ADD CONSTRAINT maintenance_category_valid 
      CHECK (category IN ('corrective','preventive','emergency'));
  END IF;
END $$;

-- Add fuel record fields
ALTER TABLE public.fuel_records
  ADD COLUMN IF NOT EXISTS previous_odometer integer,
  ADD COLUMN IF NOT EXISTS current_odometer integer,
  ADD COLUMN IF NOT EXISTS route text;

-- Add cost to truck_documents for compliance records
ALTER TABLE public.truck_documents
  ADD COLUMN IF NOT EXISTS cost numeric NOT NULL DEFAULT 0;

-- Create fuel_prices table
CREATE TABLE IF NOT EXISTS public.fuel_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  region text NOT NULL DEFAULT 'KE',
  fuel_type text NOT NULL DEFAULT 'diesel',
  price_per_liter numeric NOT NULL,
  effective_date date NOT NULL DEFAULT CURRENT_DATE,
  is_current boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Ensure one current price per region/fuel_type
CREATE UNIQUE INDEX IF NOT EXISTS uniq_fuel_prices_current 
ON public.fuel_prices(region, fuel_type) WHERE is_current;

-- RLS for fuel_prices
ALTER TABLE public.fuel_prices ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'fuel_prices' AND policyname = 'All authenticated users can view fuel prices'
  ) THEN
    CREATE POLICY "All authenticated users can view fuel prices"
    ON public.fuel_prices FOR SELECT
    USING (auth.role() = 'authenticated');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'fuel_prices' AND policyname = 'Managers and admins can manage fuel prices'
  ) THEN
    CREATE POLICY "Managers and admins can manage fuel prices"
    ON public.fuel_prices FOR ALL
    USING (public.is_manager_or_admin());
  END IF;
END $$;

-- Seed initial Kenya diesel price if none exists
INSERT INTO public.fuel_prices (region, fuel_type, price_per_liter, is_current)
SELECT 'KE', 'diesel', 195, true
WHERE NOT EXISTS (
  SELECT 1 FROM public.fuel_prices WHERE region='KE' AND fuel_type='diesel' AND is_current = true
);
