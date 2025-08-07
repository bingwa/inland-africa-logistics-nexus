import { supabase } from '../integrations/supabase/client';

export async function createFuelRecord(data: { truck_id: string; liters: number; total_cost: number; fuel_date: string; odometer_reading?: number; }) {
  const { data: result, error } = await supabase
    .from('fuel_records')
    .insert({
      truck_id: data.truck_id,
      liters: data.liters,
      total_cost: data.total_cost,
      cost_per_liter: data.total_cost / data.liters,
      fuel_date: data.fuel_date,
      odometer_reading: data.odometer_reading
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating fuel record:", error);
    throw error;
  }

  return result;
}
