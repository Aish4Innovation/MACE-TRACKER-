import React from 'react';
import '../styles/KilometerEntry.css'; // Ensure this path is correct

function KilometerDetailsModal({ entry, closeModal }) {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {/* The 'X' button element has been removed from here */}
                
                <h3>Kilometer Entry Details</h3>
                <div className="details-container">
                    <p><strong>Vehicle No:</strong> {entry.vehicleNo}</p>
                    <p><strong>GPS Number:</strong> {entry.gpsNumber || 'N/A'}</p>
                    <p><strong>Opening KM:</strong> {entry.openingKm}</p>
                    <p><strong>Closing KM:</strong> {entry.closingKm}</p>
                    <p><strong>Day KM:</strong> {entry.dayKm}</p>
                    <p><strong>Authorization:</strong> {entry.authorization}</p>
                    <p><strong>Entry Date:</strong> {new Date(entry.entryDate).toLocaleDateString()}</p>
                </div>
                <div className="modal-actions">
                    <button onClick={closeModal} className="close-button">Close</button>
                </div>
            </div>
        </div>
    );
}

export default KilometerDetailsModal;