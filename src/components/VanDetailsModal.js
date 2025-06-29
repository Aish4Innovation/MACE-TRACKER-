// salesapp/src/components/VanDetailsModal.js
import React from 'react';
import { FaTimes } from 'react-icons/fa';
import '../styles/VanMaster.css'; // Reusing modal styles

const VanDetailsModal = ({ isOpen, onClose, vanData }) => {
    if (!isOpen || !vanData) return null;

    // Helper to format date if needed (assuming created_at/updated_at are full timestamps)
    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        // Format to a readable string, e.g., "DD/MM/YYYY HH:MM AM/PM"
        return date.toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content van-details-modal"> {/* Added specific class for this modal */}
                
                <h3>Van Details: {vanData.vehicle_number}</h3>

                <div className="details-grid">
                    <div className="detail-item"><strong>Vehicle Number:</strong> {vanData.vehicle_number}</div>
                    <div className="detail-item"><strong>Model (Year):</strong> {vanData.model} ({vanData.manufacturing_year})</div>
                    <div className="detail-item"><strong>Make:</strong> {vanData.vehicle_make}</div>
                    <div className="detail-item"><strong>Type:</strong> {vanData.type}</div>
                    <div className="detail-item"><strong>Contract Type:</strong> {vanData.contract_type || 'N/A'}</div>
                    <div className="detail-item"><strong>Owner Name:</strong> {vanData.owner_name || 'N/A'}</div>

                    <div className="detail-item full-width"><strong>Driver Name:</strong> {vanData.driver_name}</div>
                    <div className="detail-item full-width"><strong>Driver Mobile:</strong> {vanData.mobile_number}</div>

                    <div className="detail-item"><strong>State:</strong> {vanData.state}</div>
                    <div className="detail-item"><strong>Region:</strong> {vanData.region || 'N/A'}</div>
                    <div className="detail-item"><strong>Zone:</strong> {vanData.zone || 'N/A'}</div>
                    <div className="detail-item"><strong>City:</strong> {vanData.city}</div>

                    <div className="detail-item full-width"><strong>Address:</strong> {vanData.address || 'N/A'}</div>

                    <div className="detail-item"><strong>Created At:</strong> {formatDate(vanData.created_at)}</div>
                    <div className="detail-item"><strong>Last Updated:</strong> {formatDate(vanData.updated_at)}</div>

                    {/* Add any other specific details or custom fields here */}
                </div>

                <div className="form-actions" style={{ justifyContent: 'center', marginTop: '30px' }}>
                    <button type="button" className="cancel-btn" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default VanDetailsModal;