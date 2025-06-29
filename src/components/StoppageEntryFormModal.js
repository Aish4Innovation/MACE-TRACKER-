import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/StoppageEntry.css';

function StoppageEntryFormModal({ closeModal, refresh, editData }) {
    const isEdit = Boolean(editData);

    const [form, setForm] = useState({
        vehicle_no: '',
        from_date: '',
        to_date: '',
        spare_vehicle: '',
        reason: '',
        status: 'Ongoing'
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isEdit && editData) {
            setForm({
                vehicle_no: editData.vehicle_no || '',
                from_date: editData.from_date?.substring(0, 10) || '',
                to_date: editData.to_date?.substring(0, 10) || '',
                spare_vehicle: editData.spare_vehicle || '',
                reason: editData.reason || '',
                status: editData.status || 'Ongoing'
            });
        }
    }, [editData, isEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const errs = {};
        if (!form.vehicle_no) errs.vehicle_no = 'Vehicle No is required';
        if (!form.from_date) errs.from_date = 'From date is required';
        if (!form.to_date) errs.to_date = 'To date is required';
        if (!form.reason) errs.reason = 'Reason is required';

        if (form.from_date && form.to_date && new Date(form.from_date) > new Date(form.to_date)) {
            errs.to_date = 'To date cannot be before From date';
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            console.log("Validation errors:", errors);
            return;
        }

        try {
            if (isEdit) {
                await axios.put(`http://localhost:5000/api/stoppages/${editData.id}`, form);
            } else {
                await axios.post('http://localhost:5000/api/stoppages', form);
            }
            refresh();
            closeModal();
        } catch (err) {
            console.error('Error submitting stoppage entry:', err);
            if (err.response?.data?.message) {
                alert(`Failed to save entry: ${err.response.data.message}`);
            } else {
                alert('Failed to save entry. Please try again.');
            }
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>{isEdit ? 'Edit Stoppage' : 'Report Stoppage'}</h3>
                <form onSubmit={handleSubmit} className="stoppage-form">

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="vehicle_no">Vehicle No*</label>
                            <input
                                type="text"
                                id="vehicle_no"
                                name="vehicle_no"
                                value={form.vehicle_no}
                                onChange={handleChange}
                                className={errors.vehicle_no ? 'input-error' : ''}
                            />
                            {errors.vehicle_no && <span className="error-message">{errors.vehicle_no}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="from_date">From Date*</label>
                            <input
                                type="date"
                                id="from_date"
                                name="from_date"
                                value={form.from_date}
                                onChange={handleChange}
                                className={errors.from_date ? 'input-error' : ''}
                            />
                            {errors.from_date && <span className="error-message">{errors.from_date}</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="to_date">To Date*</label>
                            <input
                                type="date"
                                id="to_date"
                                name="to_date"
                                value={form.to_date}
                                onChange={handleChange}
                                className={errors.to_date ? 'input-error' : ''}
                            />
                            {errors.to_date && <span className="error-message">{errors.to_date}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="spare_vehicle">Spare Vehicle (if any)</label>
                            <input
                                type="text"
                                id="spare_vehicle"
                                name="spare_vehicle"
                                value={form.spare_vehicle}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="reason">Reason for Stoppage*</label>
                            <select
                                id="reason"
                                name="reason"
                                value={form.reason}
                                onChange={handleChange}
                                className={errors.reason ? 'input-error' : ''}
                            >
                                <option value="">Select a reason</option>
                                <option value="Flat Tire">Flat Tire</option>
                                <option value="Mechanical Issue">Mechanical Issue</option>
                                <option value="Minor mechanical issue">Minor mechanical issue</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.reason && <span className="error-message">{errors.reason}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <select
                                id="status"
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                            >
                                <option value="Ongoing">Ongoing</option>
                                <option value="Resolved">Resolved</option>
                            </select>
                        </div>
                    </div>

                    {/* Reversed button layout: Add/Update on left, Cancel on right */}
                    <div className="form-actions">
                        <div className="left-action">
                            <button type="submit" className="submit-btn">{isEdit ? 'Update' : 'Add'}</button>
                        </div>
                        <div className="right-action">
                            <button type="button" onClick={closeModal} className="cancel-btn">Cancel</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default StoppageEntryFormModal;
