import db from '../db';

export async function createFuelRecord(data: { truckId: string; fuelType: string; quantity: number; amount: number; }) {
  // Make sure that the database table 'fuel_records' has columns 'truck_id', 'fuel_type', 'quantity', 'amount'.
  const query = `
    INSERT INTO fuel_records (truck_id, fuel_type, quantity, amount)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [data.truckId, data.fuelType, data.quantity, data.amount];
  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error creating fuel record:", error);
    throw error;
  }
}
  } catch (error) {
    throw error;
  }
}
  }
}
