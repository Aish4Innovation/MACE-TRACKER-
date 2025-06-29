import React, { useState, useEffect } from 'react';
import '../styles/Inventory.css';

const InventoryFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const itemOptions = [
        'Ramco SuperGrade (PPC)',
        'Ramco Supercrete (PPC)',
        'Ramco OPC 43 Grade',
        'Ramco OPC 53 Grade',
        'Ramco Ramco Innertite',
        'Ramco Super Fast'
    ];
    const categoryOptions = ['Finished Goods', 'Raw Material', 'Packaging', 'Sample', 'Other'];

    const [formData, setFormData] = useState({
        su_number: '',
        item_name: '',
        quantity: '',
        unit_of_measure: '',
        description: '',
        location: '',
        category: ''
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                su_number: initialData.su_number || '',
                item_name: initialData.item_name || '',
                quantity: initialData.quantity || '',
                unit_of_measure: initialData.unit_of_measure || '',
                description: initialData.description || '',
                location: initialData.location || '',
                category: initialData.category || ''
            });
        } else {
            setFormData({
                su_number: '',
                item_name: '',
                quantity: '',
                unit_of_measure: '',
                description: '',
                location: '',
                category: 'Consumable'
            });
        }
        setFormErrors({});
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (formErrors[name]) {
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        let errors = {};
        if (!formData.su_number.trim()) errors.su_number = 'BU (SU) Number is required';
        if (!formData.item_name.trim()) errors.item_name = 'Item Name is required';
        if (formData.quantity === '' || isNaN(formData.quantity) || parseInt(formData.quantity) < 0) {
            errors.quantity = 'Valid quantity (non-negative number) is required';
        }
        if (!formData.unit_of_measure.trim()) errors.unit_of_measure = 'Unit of Measure is required';
        if (!formData.category.trim()) errors.category = 'Category is required';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content inventory-form-modal">
                <h3>{initialData ? 'Edit Inventory Item' : 'Add New Inventory Item'}</h3>

                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="su_number">BU (SU) Number:</label>
                            <input
                                type="text"
                                id="su_number"
                                name="su_number"
                                value={formData.su_number}
                                onChange={handleChange}
                                className={formErrors.su_number ? 'input-error' : ''}
                                disabled={!!initialData}
                            />
                            {formErrors.su_number && <span className="error-message">{formErrors.su_number}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="item_name">Item:</label>
                            <select
                                id="item_name"
                                name="item_name"
                                value={formData.item_name}
                                onChange={handleChange}
                                className={formErrors.item_name ? 'input-error' : ''}
                            >
                                <option value="">Select Item</option>
                                {itemOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                            {formErrors.item_name && <span className="error-message">{formErrors.item_name}</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="category">Category:</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className={formErrors.category ? 'input-error' : ''}
                            >
                                <option value="">Select Category</option>
                                {categoryOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                            {formErrors.category && <span className="error-message">{formErrors.category}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="quantity">Quantity:</label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                className={formErrors.quantity ? 'input-error' : ''}
                            />
                            {formErrors.quantity && <span className="error-message">{formErrors.quantity}</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="unit_of_measure">Unit of Measure (UOM):</label>
                            <input
                                type="text"
                                id="unit_of_measure"
                                name="unit_of_measure"
                                value={formData.unit_of_measure}
                                onChange={handleChange}
                                className={formErrors.unit_of_measure ? 'input-error' : ''}
                            />
                            {formErrors.unit_of_measure && <span className="error-message">{formErrors.unit_of_measure}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="location">Location (Optional):</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group full-width">
                            <label htmlFor="description">Description (Optional):</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                            ></textarea>
                        </div>
                    </div>

                    {/* Button Row: Add Left, Cancel Right */}
                    <div className="form-actions">
                        <div className="left-action">
                            <button type="submit" className="submit-btn">
                                {initialData ? 'Update Item' : 'Add Item'}
                            </button>
                        </div>
                        <div className="right-action">
                            <button type="button" className="cancel-btn" onClick={onClose}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InventoryFormModal;
