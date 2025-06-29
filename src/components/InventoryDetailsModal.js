// salesapp/src/components/InventoryDetailsModal.js
import React from 'react';
import { FaTimes } from 'react-icons/fa';
import '../styles/Inventory.css'; // <-- Correct CSS import for YOUR setup

const InventoryDetailsModal = ({ isOpen, onClose, item }) => {
    if (!isOpen || !item) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content inventory-details-modal">
                
                <h3>Inventory Item Details: {item.su_number}</h3>

                <div className="details-grid">
                    <div className="detail-item">
                        <strong>BU Number:</strong> {item.su_number}
                    </div>
                    <div className="detail-item">
                        <strong>Item Name:</strong> {item.item_name}
                    </div>
                    <div className="detail-item">
                        <strong>Category:</strong> {item.category}
                    </div>
                    <div className="detail-item">
                        <strong>Quantity:</strong> {item.quantity} {item.unit_of_measure}
                    </div>
                    <div className="detail-item full-width">
                        <strong>Location:</strong> {item.location || 'N/A'}
                    </div>
                    {item.description && (
                        <div className="detail-item full-width">
                            <strong>Description:</strong> {item.description}
                        </div>
                    )}
                    <div className="detail-item">
                        <strong>Created At:</strong> {formatDate(item.created_at)}
                    </div>
                    <div className="detail-item">
                        <strong>Last Updated:</strong> {formatDate(item.updated_at)}
                    </div>
                </div>

                <div className="form-actions" style={{ justifyContent: 'center' }}>
                    <button type="button" className="cancel-btn" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default InventoryDetailsModal;