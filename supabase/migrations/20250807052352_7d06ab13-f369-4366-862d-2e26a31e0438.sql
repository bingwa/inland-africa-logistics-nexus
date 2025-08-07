-- Fix RLS policy for fuel_records to allow all authenticated users to insert
DROP POLICY IF EXISTS "Drivers can insert fuel records for their trips" ON fuel_records;

CREATE POLICY "All authenticated users can insert fuel records" 
ON fuel_records 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated'::text);