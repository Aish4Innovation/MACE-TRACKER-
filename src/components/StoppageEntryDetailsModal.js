import React from 'react';
import '../styles/StoppageEntry.css';

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${formatDate(dateString)} at ${time}`;
};

function StoppageEntryDetailsModal({ closeModal, entry }) {
    if (!entry) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <span className="close-btn" onClick={closeModal}>&times;</span>
                <h3>Stoppage Details</h3>

                <div className="modal-details-view">
                    <p><strong>ID:</strong> {entry.id}</p>
                    <p><strong>Vehicle No:</strong> {entry.vehicleNo}</p>
                    <p><strong>From:</strong> {formatDateTime(entry.from_date)}</p>
                    <p><strong>To:</strong> {formatDateTime(entry.to_date)}</p>
                    <p><strong>Reason:</strong> {entry.reason}</p>

                    {entry.spare_vehicle && (
                        <p><strong>Spare Vehicle:</strong> {entry.spare_vehicle}</p>
                    )}

                    <p>
                        <strong>Status:</strong>{' '}
                        <span className={`status-badge ${entry.status.toLowerCase()}`}>
                            {entry.status}
                        </span>
                    </p>

                    <p><strong>Created On:</strong> {formatDateTime(entry.created_at)}</p>
                    {entry.updated_at && (
                        <p><strong>Last Updated:</strong> {formatDateTime(entry.updated_at)}</p>
                    )}
                </div>

                <div className="form-actions" style={{ textAlign: 'center' }}>
                    <button onClick={closeModal} className="cancel-btn">Close</button>
                </div>
            </div>
        </div>
    );
}

export default StoppageEntryDetailsModal;