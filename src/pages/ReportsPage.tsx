// ...existing imports...
import { getSparesReport } from '../services/reportsService';
import React, { useEffect, useState } from 'react';

function ReportsPage() {
	// ...existing state/code...
	const [sparesReport, setSparesReport] = useState([]);

	useEffect(() => {
		async function fetchReport() {
			const reportData = await getSparesReport();
			setSparesReport(reportData);
		}
		fetchReport();
	}, []);

	return (
		<div>
			<h2>Spares Report</h2>
			<table>
				<thead>
					<tr>
						<th>Truck ID</th>
						<th>Quantity</th>
						<th>Amount</th>
						<th>Service Type</th>
					</tr>
				</thead>
				<tbody>
					{sparesReport.map((row, idx) => (
						<tr key={idx}>
							<td>{row.truck_id}</td>
							<td>{row.quantity}</td>
							<td>{row.amount}</td>
							<td>{row.service_type === 'servicing' ? 'Servicing' : 'Maintenance'}</td>
						</tr>
					))}
				</tbody>
			</table>
			{/* ...existing content... */}
		</div>
	);
}

export default ReportsPage;
