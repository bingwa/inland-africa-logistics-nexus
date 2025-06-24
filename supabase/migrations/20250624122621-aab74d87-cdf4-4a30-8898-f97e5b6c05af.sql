
-- Enable RLS on all tables
ALTER TABLE public.trucks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cargo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fuel_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spare_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parts_usage ENABLE ROW LEVEL SECURITY;

-- Create user profiles table for additional user data
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  full_name text,
  role text DEFAULT 'user',
  phone text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create policies for all authenticated users to access data
CREATE POLICY "Allow authenticated users to view trucks" ON public.trucks
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert trucks" ON public.trucks
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update trucks" ON public.trucks
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to delete trucks" ON public.trucks
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to view drivers" ON public.drivers
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert drivers" ON public.drivers
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update drivers" ON public.drivers
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to delete drivers" ON public.drivers
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to view trips" ON public.trips
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert trips" ON public.trips
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update trips" ON public.trips
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to delete trips" ON public.trips
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to view cargo" ON public.cargo
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert cargo" ON public.cargo
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update cargo" ON public.cargo
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to delete cargo" ON public.cargo
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to view fuel_records" ON public.fuel_records
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert fuel_records" ON public.fuel_records
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update fuel_records" ON public.fuel_records
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to delete fuel_records" ON public.fuel_records
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to view maintenance" ON public.maintenance
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert maintenance" ON public.maintenance
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update maintenance" ON public.maintenance
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to delete maintenance" ON public.maintenance
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to view spare_parts" ON public.spare_parts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert spare_parts" ON public.spare_parts
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update spare_parts" ON public.spare_parts
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to delete spare_parts" ON public.spare_parts
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to view parts_usage" ON public.parts_usage
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert parts_usage" ON public.parts_usage
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update parts_usage" ON public.parts_usage
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to delete parts_usage" ON public.parts_usage
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Insert sample data
INSERT INTO public.trucks (truck_number, license_plate, make, model, year, capacity_tons, fuel_type, status, mileage, purchase_date, last_service_date, next_service_due, vin, telematics_id, last_gps_lat, last_gps_lng) VALUES
('TRK001', 'KCB 123A', 'Mercedes-Benz', 'Actros', 2022, 25.0, 'Diesel', 'active', 45000, '2022-01-15', '2024-11-15', '2025-02-15', 'WDB9634321L123456', 'TEL001', -1.286389, 36.817223),
('TRK002', 'KCB 456B', 'Volvo', 'FH16', 2021, 30.0, 'Diesel', 'active', 68000, '2021-06-20', '2024-10-10', '2025-01-10', 'YV2XTT6H8MA123457', 'TEL002', -1.292066, 36.821946),
('TRK003', 'KCB 789C', 'Scania', 'R450', 2023, 28.0, 'Diesel', 'maintenance', 25000, '2023-03-10', '2024-09-20', '2024-12-20', 'YS2R4X20005123458', 'TEL003', -1.302135, 36.833128),
('TRK004', 'KCB 012D', 'MAN', 'TGX', 2020, 26.0, 'Diesel', 'active', 85000, '2020-08-05', '2024-11-01', '2025-02-01', 'WMA06XZZ6KM123459', 'TEL004', -1.319568, 36.925843);

INSERT INTO public.drivers (employee_id, full_name, license_number, license_expiry, phone, email, hire_date, status, address, compliance_score, hours_of_service_today) VALUES
('EMP001', 'John Mwangi', 'DL001234567', '2026-05-15', '+254712345678', 'john.mwangi@company.com', '2020-03-15', 'active', 'Nairobi, Kenya', 95.5, 6.5),
('EMP002', 'Mary Wanjiku', 'DL001234568', '2025-12-20', '+254723456789', 'mary.wanjiku@company.com', '2019-07-22', 'active', 'Mombasa, Kenya', 92.3, 8.0),
('EMP003', 'Peter Kiprotich', 'DL001234569', '2027-01-10', '+254734567890', 'peter.kiprotich@company.com', '2021-11-08', 'active', 'Kisumu, Kenya', 88.7, 5.5),
('EMP004', 'Grace Njeri', 'DL001234570', '2026-08-30', '+254745678901', 'grace.njeri@company.com', '2022-02-14', 'active', 'Nakuru, Kenya', 96.2, 7.2);

INSERT INTO public.trips (trip_number, origin, destination, planned_departure, planned_arrival, truck_id, driver_id, status, distance_km, cargo_value_usd, fuel_cost, toll_cost, other_expenses, customer_contact, notes) VALUES
('TRIP001', 'Nairobi', 'Mombasa', '2024-12-01 06:00:00', '2024-12-01 18:00:00', (SELECT id FROM trucks WHERE truck_number = 'TRK001'), (SELECT id FROM drivers WHERE employee_id = 'EMP001'), 'completed', 480.5, 15000, 8500, 1200, 500, '+254700123456', 'Delivered construction materials'),
('TRIP002', 'Mombasa', 'Kisumu', '2024-12-02 08:00:00', '2024-12-03 16:00:00', (SELECT id FROM trucks WHERE truck_number = 'TRK002'), (SELECT id FROM drivers WHERE employee_id = 'EMP002'), 'in_progress', 680.2, 22000, 11200, 1800, 750, '+254700234567', 'Carrying agricultural products'),
('TRIP003', 'Nairobi', 'Nakuru', '2024-12-03 07:30:00', '2024-12-03 12:30:00', (SELECT id FROM trucks WHERE truck_number = 'TRK004'), (SELECT id FROM drivers WHERE employee_id = 'EMP004'), 'planned', 160.8, 8500, 2800, 400, 200, '+254700345678', 'Electronics delivery');

INSERT INTO public.cargo (cargo_number, client_name, client_contact, pickup_address, delivery_address, description, weight_kg, value, status, special_instructions, trip_id) VALUES
('CRG001', 'Kenya Construction Co.', '+254700123456', 'Industrial Area, Nairobi', 'Port Reitz, Mombasa', 'Steel reinforcement bars', 24500, 750000, 'delivered', 'Handle with care - heavy machinery required', (SELECT id FROM trips WHERE trip_number = 'TRIP001')),
('CRG002', 'East Africa Agro Ltd', '+254700234567', 'Kilifi Port', 'Kisumu Port', 'Coffee beans export', 18200, 1100000, 'in_transit', 'Temperature controlled transport required', (SELECT id FROM trips WHERE trip_number = 'TRIP002')),
('CRG003', 'TechHub Kenya', '+254700345678', 'Westlands, Nairobi', 'Nakuru Mall', 'Computer equipment', 2800, 425000, 'pending', 'Fragile items - secure packaging', (SELECT id FROM trips WHERE trip_number = 'TRIP003'));

INSERT INTO public.fuel_records (truck_id, driver_id, trip_id, fuel_date, liters, cost_per_liter, total_cost, fuel_station, receipt_number, payment_method, odometer_reading, carbon_offset_kg) VALUES
((SELECT id FROM trucks WHERE truck_number = 'TRK001'), (SELECT id FROM drivers WHERE employee_id = 'EMP001'), (SELECT id FROM trips WHERE trip_number = 'TRIP001'), '2024-12-01 05:30:00', 180.5, 158.50, 28629.25, 'Total Energies Nairobi', 'RCP001234', 'Company Card', 45180, 478.5),
((SELECT id FROM trucks WHERE truck_number = 'TRK002'), (SELECT id FROM drivers WHERE employee_id = 'EMP002'), (SELECT id FROM trips WHERE trip_number = 'TRIP002'), '2024-12-02 07:45:00', 220.8, 159.20, 35151.36, 'Shell Mombasa', 'RCP001235', 'Company Card', 68220, 585.2);

INSERT INTO public.maintenance (truck_id, maintenance_type, description, service_date, cost, technician, service_provider, status, mileage_at_service, downtime_hours, next_service_date) VALUES
((SELECT id FROM trucks WHERE truck_number = 'TRK001'), 'Scheduled', 'Regular service and oil change', '2024-11-15', 45000, 'David Kamau', 'Mercedes Service Center', 'completed', 44800, 4, '2025-02-15'),
((SELECT id FROM trucks WHERE truck_number = 'TRK003'), 'Repair', 'Brake system overhaul', '2024-11-20', 85000, 'Samuel Ochieng', 'Scania Workshop', 'in_progress', 24950, 24, '2025-01-20');

INSERT INTO public.spare_parts (part_name, part_number, category, description, quantity_in_stock, unit_price, minimum_stock_level, supplier, location, lead_time_days, supplier_rating) VALUES
('Brake Pads - Heavy Duty', 'BP-HD-001', 'Brakes', 'Heavy duty brake pads for commercial vehicles', 25, 12500, 10, 'AutoParts Kenya Ltd', 'Warehouse A-1', 7, 4),
('Engine Oil Filter', 'EOF-STD-002', 'Engine', 'Standard engine oil filter', 50, 2800, 15, 'Filter Pro Kenya', 'Warehouse B-2', 3, 5),
('Air Filter', 'AF-HD-003', 'Engine', 'Heavy duty air filter', 30, 4200, 12, 'AutoParts Kenya Ltd', 'Warehouse A-1', 5, 4),
('Tire - 315/80R22.5', 'TR-315-004', 'Tires', 'Commercial truck tire', 20, 35000, 8, 'Bridgestone Kenya', 'Warehouse C-3', 14, 5);

INSERT INTO public.parts_usage (maintenance_id, part_id, quantity_used, cost_per_unit, total_cost) VALUES
((SELECT id FROM maintenance WHERE description = 'Brake system overhaul'), (SELECT id FROM spare_parts WHERE part_number = 'BP-HD-001'), 4, 12500, 50000);
