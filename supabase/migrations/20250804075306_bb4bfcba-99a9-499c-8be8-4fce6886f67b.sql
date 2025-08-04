-- Allow all authenticated users to insert maintenance records
CREATE POLICY "All authenticated users can create maintenance records" 
ON public.maintenance 
FOR INSERT 
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

-- Drop the existing restrictive policy for INSERT operations
DROP POLICY IF EXISTS "Managers and admins can manage maintenance" ON public.maintenance;

-- Recreate the management policy for UPDATE and DELETE only
CREATE POLICY "Managers and admins can update and delete maintenance" 
ON public.maintenance 
FOR UPDATE 
TO authenticated
USING (is_manager_or_admin());

CREATE POLICY "Managers and admins can delete maintenance" 
ON public.maintenance 
FOR DELETE 
TO authenticated
USING (is_manager_or_admin());