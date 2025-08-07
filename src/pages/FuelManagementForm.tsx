import React, { useState } from 'react';
import { createFuelRecord } from '../services/fuelService';

function FuelManagementForm() {
  const [formData, setFormData] = useState({
    truckId: '',
    fuelType: '',
    quantity: '', // captured as string; converted on submit
    amount: '',   // captured as string; converted on submit
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createFuelRecord({
        truck_id: formData.truckId,
        liters: parseFloat(formData.quantity),
        total_cost: parseFloat(formData.amount),
        fuel_date: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Truck ID field */}
      <label>
        Truck ID:
        <input name="truckId" value={formData.truckId} onChange={handleChange} />
      </label>
      {/* Fuel Type field */}
      <label>
        Fuel Type:
        <select name="fuelType" value={formData.fuelType} onChange={handleChange}>
          <option value="diesel">Diesel</option>
          <option value="petrol">Petrol</option>
          <option value="kerosene">Kerosene</option>
        </select>
      </label>
      {/* Quantity field */}
      <label>
        Quantity:
        <input name="quantity" type="number" value={formData.quantity} onChange={handleChange} />
      </label>
      {/* Amount field */}
      <label>
        Amount:
        <input name="amount" type="number" value={formData.amount} onChange={handleChange} />
      </label>
      {/* Removed fields: fuelStation, paymentMethod, and receipt */}
      <button type="submit">Submit</button>
    </form>
  );
}

export default FuelManagementForm;