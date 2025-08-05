// ...existing imports...
export async function getSparesReport() {
	// Aggregate spares by truck with totals for quantity and amount filtered by service type.
	const query = `
		SELECT 
			truck_id, 
			SUM(quantity) AS quantity, 
			SUM(amount) AS amount, 
			service_type
		FROM spares_transactions
		GROUP BY truck_id, service_type;
	`;
	// ...existing DB connection & query execution...
	const results = await db.query(query);
	return results;
}
// ...existing exports...
