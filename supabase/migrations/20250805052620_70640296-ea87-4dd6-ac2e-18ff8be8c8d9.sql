-- Add new fields to maintenance table for service type and route information
ALTER TABLE public.maintenance 
ADD COLUMN service_type character varying DEFAULT 'maintenance',
ADD COLUMN route_taken text;

-- Add comment to clarify the service_type values
COMMENT ON COLUMN public.maintenance.service_type IS 'Type of service: "maintenance" or "servicing"';
COMMENT ON COLUMN public.maintenance.route_taken IS 'Route taken - required for maintenance type services';