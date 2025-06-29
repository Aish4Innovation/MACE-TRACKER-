import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/KilometerEntry.css';

function KilometerFormModal({ closeModal, refresh, editData }) {
  const [form, setForm] = useState({
    vehicle_number: '',
    gps_number: '',
    starting_km: '',
    ending_km: '',
    day_km: '',
    date: '',
    authorization: 'Pending'
  });

  useEffect(() => {
    if (editData) {
      const formattedDate = editData.entryDate
        ? new Date(editData.entryDate).toISOString().split('T')[0]
        : '';

      setForm({
        id: editData.id,
        vehicle_number: editData.vehicleNo || '',
        gps_number: editData.gpsNumber || '',
        starting_km: editData.openingKm,
        ending_km: editData.closingKm,
        day_km: editData.dayKm,
        date: formattedDate,
        authorization: editData.authorization
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDayKmCalculation = (e) => {
    const { name, value } = e.target;
    const newForm = { ...form, [name]: value };

    const starting = parseFloat(newForm.starting_km) || 0;
    const ending = parseFloat(newForm.ending_km) || 0;

    if (ending >= starting) {
      newForm.day_km = (ending - starting).toFixed(2);
    } else {
      newForm.day_km = '';
    }

    setForm(newForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.vehicle_number || !form.date || form.starting_km === '' || form.ending_km === '') {
      alert('Please fill in all required fields (Vehicle No., Date, Starting KM, and Ending KM).');
      return;
    }

    if (parseFloat(form.ending_km) < parseFloat(form.starting_km)) {
      alert('Ending KM must be greater than or equal to Starting KM.');
      return;
    }

    const payload = {
      vehicleNo: form.vehicle_number,
      gpsNumber: form.gps_number,
      openingKm: parseFloat(form.starting_km),
      closingKm: parseFloat(form.ending_km),
      entryDate: form.date,
      authorization: form.authorization
    };

    try {
      if (editData) {
        await axios.put(`http://localhost:5000/api/kilometer-entries/${editData.id}`, payload);
        alert('Kilometer entry updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/kilometer-entries', payload);
        alert('Kilometer entry added successfully!');
      }
      refresh();
      closeModal();
    } catch (err) {
      console.error('Error submitting form:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || 'Failed to save entry. Please check the console for details.';
      alert(errorMessage);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{editData ? 'Edit Kilometer Entry' : 'Add Kilometer Entry'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Vehicle No:</label>
            <input
              type="text"
              name="vehicle_number"
              value={form.vehicle_number}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>GPS Number:</label>
            <input
              type="text"
              name="gps_number"
              value={form.gps_number}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Starting KM:</label>
            <input
              type="number"
              name="starting_km"
              value={form.starting_km}
              onChange={handleChange}
              onBlur={handleDayKmCalculation}
              required
            />
          </div>

          <div className="form-group">
            <label>Ending KM:</label>
            <input
              type="number"
              name="ending_km"
              value={form.ending_km}
              onChange={handleChange}
              onBlur={handleDayKmCalculation}
              required
            />
          </div>

          <div className="form-group">
            <label>Day KM:</label>
            <input type="text" name="day_km" value={form.day_km} readOnly />
          </div>

          <div className="form-group">
            <label>Entry Date:</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>

          {editData && (
            <div className="form-group">
              <label>Authorization Status:</label>
              <input type="text" name="authorization" value={form.authorization} readOnly />
            </div>
          )}

          <div className="form-actions">
            <button type="submit">{editData ? 'Update' : 'Add'}</button>
            <button type="button" onClick={closeModal} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default KilometerFormModal;
