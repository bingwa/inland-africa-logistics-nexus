
-- First, let's modify the profiles table to include all the fields from the profile page
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS employee_id VARCHAR,
ADD COLUMN IF NOT EXISTS department VARCHAR,
ADD COLUMN IF NOT EXISTS join_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS location VARCHAR,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact VARCHAR,
ADD COLUMN IF NOT EXISTS license_number VARCHAR,
ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS sms_notifications BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS push_notifications BOOLEAN DEFAULT true;

-- Update the handle_new_user function to populate more fields from signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    full_name, 
    role, 
    phone, 
    employee_id,
    email_notifications,
    sms_notifications,
    push_notifications
  )
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'role', 'user'),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    COALESCE(new.raw_user_meta_data->>'employee_id', ''),
    true,
    false,
    true
  );
  RETURN new;
END;
$$;

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Create a table for driver-specific trip assignments
CREATE TABLE IF NOT EXISTS public.driver_trip_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status VARCHAR DEFAULT 'assigned',
  UNIQUE(driver_id, trip_id)
);

-- Enable RLS on driver_trip_assignments
ALTER TABLE public.driver_trip_assignments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for driver assignments
CREATE POLICY "Drivers can view their own assignments" 
  ON public.driver_trip_assignments 
  FOR SELECT 
  USING (driver_id = auth.uid());

-- Create a view for driver trip details
CREATE OR REPLACE VIEW public.driver_trip_view AS
SELECT 
  t.*,
  dta.assigned_at,
  dta.status as assignment_status,
  trucks.truck_number,
  trucks.make,
  trucks.model
FROM public.trips t
JOIN public.driver_trip_assignments dta ON t.id = dta.trip_id
LEFT JOIN public.trucks ON t.truck_id = trucks.id
WHERE dta.driver_id = auth.uid();
