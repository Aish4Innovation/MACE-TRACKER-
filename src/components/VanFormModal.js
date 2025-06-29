// salesapp/src/components/VanFormModal.js
import React, { useState, useEffect, useMemo } from 'react';
import { FaTimes } from 'react-icons/fa';
import '../styles/VanMaster.css';

// --- Data for Cascading Dropdowns ---
const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman & Diu",
    "Lakshadweep", "Delhi", "Puducherry"
].sort(); // Sort alphabetically for better UX

const tamilNaduRegions = [
    "North Tamil Nadu",
    "South Tamil Nadu"
];

// Define zones based on regions of Tamil Nadu
const zoneData = {
    "North Tamil Nadu": [
        "Chennai",
        "Vellore",
        "Kancheepuram",
        "Villupuram",
        "Tiruvannamalai",
        "Cuddalore"
    ],
    "South Tamil Nadu": [
        "Madurai",
        "Trichy",
        "Tirunelveli",
        "Coimbatore", // Often considered West, but commonly grouped for larger region splits
        "Salem",
        "Thanjavur",
        "Virudhunagar"
    ]
    // Add more regions and their zones as needed for other states
    // For example: "Karnataka": ["Bengaluru Zone", "Mysore Zone"], etc.
};


const VanFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        state: '', region: '', zone: '', city: '', vehicle_number: '',
        vehicle_make: '', model: '', type: '', manufacturing_year: '',
        contract_type: '', owner_name: '', address: '', driver_name: '', mobile_number: ''
    });
    const [formErrors, setFormErrors] = useState({});

    // Populate form if initialData is provided (for editing)
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            // Reset form for adding new van
            setFormData({
                state: '', region: '', zone: '', city: '', vehicle_number: '',
                vehicle_make: '', model: '', type: '', manufacturing_year: '',
                contract_type: '', owner_name: '', address: '', driver_name: '', mobile_number: ''
            });
        }
        setFormErrors({}); // Clear errors on modal open/data change
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newFormData = { ...formData, [name]: value };

        // Handle cascading logic:
        if (name === "state") {
            // If state changes, reset region and zone
            newFormData.region = '';
            newFormData.zone = '';
        } else if (name === "region") {
            // If region changes, reset zone
            newFormData.zone = '';
        }

        setFormData(newFormData);

        // Clear error for the current field as user types/selects
        if (formErrors[name]) {
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    // Memoize available regions and zones for performance (though not strictly necessary for small lists)
    const availableRegions = useMemo(() => {
        return formData.state === "Tamil Nadu" ? tamilNaduRegions : [];
    }, [formData.state]);

    const availableZones = useMemo(() => {
        if (formData.state === "Tamil Nadu" && formData.region) {
            return zoneData[formData.region] || [];
        }
        return [];
    }, [formData.state, formData.region]);


    const validateForm = () => {
        let errors = {};
        if (!formData.state.trim()) errors.state = 'State is required';
        if (formData.state === "Tamil Nadu" && !formData.region.trim()) errors.region = 'Region is required for Tamil Nadu';
        if (formData.state === "Tamil Nadu" && formData.region && !formData.zone.trim()) errors.zone = 'Zone is required for selected region';
        if (!formData.city.trim()) errors.city = 'City is required';
        if (!formData.vehicle_number.trim()) errors.vehicle_number = 'Vehicle Number is required';
        if (!formData.vehicle_make.trim()) errors.vehicle_make = 'Vehicle Make is required';
        if (!formData.model.trim()) errors.model = 'Model is required';
        if (!formData.type.trim()) errors.type = 'Type is required';
        if (!formData.manufacturing_year || isNaN(formData.manufacturing_year) || formData.manufacturing_year.toString().length !== 4 || formData.manufacturing_year < 1900 || formData.manufacturing_year > new Date().getFullYear() + 1) { // Added basic year range validation
            errors.manufacturing_year = 'Valid 4-digit year is required (e.g., 2023)';
        }
        if (!formData.driver_name.trim()) errors.driver_name = 'Driver Name is required';
        if (!formData.mobile_number.trim()) {
            errors.mobile_number = 'Mobile number is required';
        } else if (!/^\d{10}$/.test(formData.mobile_number)) {
            errors.mobile_number = 'Mobile number must be 10 digits';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData); // Call the onSubmit prop from parent
        } else {
            // A visual cue for errors is handled by input-error class
            // alert('Please correct the highlighted errors in the form.'); // Can keep or remove alert
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>{initialData ? 'Edit Van Details' : 'Add New Van'}</h3>
                <form onSubmit={handleSubmit}>
                    {/* Row 1: State, Region, Zone, City */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>State *</label>
                            <select name="state" value={formData.state} onChange={handleChange} className={formErrors.state ? 'input-error' : ''}>
                                <option value="">Select State</option>
                                {indianStates.map(state => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                            {formErrors.state && <p className="error-message">{formErrors.state}</p>}
                        </div>

                        {formData.state === "Tamil Nadu" && (
                            <>
                                <div className="form-group">
                                    <label>Region *</label>
                                    <select name="region" value={formData.region} onChange={handleChange} className={formErrors.region ? 'input-error' : ''}>
                                        <option value="">Select Region</option>
                                        {tamilNaduRegions.map(region => (
                                            <option key={region} value={region}>{region}</option>
                                        ))}
                                    </select>
                                    {formErrors.region && <p className="error-message">{formErrors.region}</p>}
                                </div>

                                {formData.region && (
                                    <div className="form-group">
                                        <label>Zone *</label>
                                        <select name="zone" value={formData.zone} onChange={handleChange} className={formErrors.zone ? 'input-error' : ''}>
                                            <option value="">Select Zone</option>
                                            {availableZones.map(zone => (
                                                <option key={zone} value={zone}>{zone}</option>
                                            ))}
                                        </select>
                                        {formErrors.zone && <p className="error-message">{formErrors.zone}</p>}
                                    </div>
                                )}
                            </>
                        )}
                        {/* City remains visible regardless of state/region */}
                        <div className="form-group">
                            <label>City *</label>
                            <input type="text" name="city" value={formData.city} onChange={handleChange} className={formErrors.city ? 'input-error' : ''} />
                            {formErrors.city && <p className="error-message">{formErrors.city}</p>}
                        </div>
                    </div>

                    {/* Row 2: Vehicle Number, Make, Model, Type */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Vehicle Number *</label>
                            <input type="text" name="vehicle_number" value={formData.vehicle_number} onChange={handleChange} className={formErrors.vehicle_number ? 'input-error' : ''} />
                            {formErrors.vehicle_number && <p className="error-message">{formErrors.vehicle_number}</p>}
                        </div>
                        <div className="form-group">
                            <label>Vehicle Make *</label>
                            <input type="text" name="vehicle_make" value={formData.vehicle_make} onChange={handleChange} className={formErrors.vehicle_make ? 'input-error' : ''} />
                            {formErrors.vehicle_make && <p className="error-message">{formErrors.vehicle_make}</p>}
                        </div>
                        <div className="form-group">
                            <label>Model *</label>
                            <input type="text" name="model" value={formData.model} onChange={handleChange} className={formErrors.model ? 'input-error' : ''} />
                            {formErrors.model && <p className="error-message">{formErrors.model}</p>}
                        </div>
                        <div className="form-group">
                            <label>Type *</label>
                            <select name="type" value={formData.type} onChange={handleChange} className={formErrors.type ? 'input-error' : ''}>
                                <option value="">Select Type</option>
                                <option value="LCV">LCV (Light Commercial Vehicle)</option>
                                <option value="HCV">HCV (Heavy Commercial Vehicle)</option>
                                <option value="Cement Carrier">Cement Carrier</option>
                                <option value="Tanker">Tanker</option>
                                <option value="Other">Other</option>
                            </select>
                            {formErrors.type && <p className="error-message">{formErrors.type}</p>}
                        </div>
                    </div>

                    {/* Row 3: Manufacturing Year, Contract Type, Owner Name */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Manufacturing Year *</label>
                            <input type="number" name="manufacturing_year" value={formData.manufacturing_year} onChange={handleChange} className={formErrors.manufacturing_year ? 'input-error' : ''} />
                            {formErrors.manufacturing_year && <p className="error-message">{formErrors.manufacturing_year}</p>}
                        </div>
                        <div className="form-group">
                            <label>Contract Type</label>
                            <select name="contract_type" value={formData.contract_type} onChange={handleChange}>
                                <option value="">Select Type</option>
                                <option value="Own">Own</option>
                                <option value="Leased">Leased</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Owner Name</label>
                            <input type="text" name="owner_name" value={formData.owner_name} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Row 4: Address */}
                    <div className="form-row">
                        <div className="form-group full-width">
                            <label>Address</label>
                            <textarea name="address" value={formData.address} onChange={handleChange} rows="2"></textarea>
                        </div>
                    </div>

                    {/* Row 5: Driver Name, Mobile Number */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Driver Name *</label>
                            <input type="text" name="driver_name" value={formData.driver_name} onChange={handleChange} className={formErrors.driver_name ? 'input-error' : ''} />
                            {formErrors.driver_name && <p className="error-message">{formErrors.driver_name}</p>}
                        </div>
                        <div className="form-group">
                            <label>Mobile Number *</label>
                            <input type="text" name="mobile_number" value={formData.mobile_number} onChange={handleChange} className={formErrors.mobile_number ? 'input-error' : ''} />
                            {formErrors.mobile_number && <p className="error-message">{formErrors.mobile_number}</p>}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="submit-btn">{initialData ? 'Update Van' : 'Add Van'}</button>
                        <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VanFormModal;