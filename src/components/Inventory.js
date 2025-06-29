// salesapp/src/components/Inventory.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrashAlt, FaEye, FaSearch, FaFilter, FaTimesCircle } from 'react-icons/fa'; // Added FaTimesCircle icon
import '../styles/Inventory.css';
import InventoryFormModal from './InventoryFormModal';
import InventoryDetailsModal from './InventoryDetailsModal';

function Inventory() {
    const [inventoryItems, setInventoryItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [viewingItem, setViewingItem] = useState(null);

    const fetchInventoryItems = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:5000/api/inventory');
            setInventoryItems(response.data);
        } catch (err) {
            console.error("Error fetching inventory items:", err);
            setError('Failed to load inventory items. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventoryItems();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // --- NEW FUNCTION TO CLEAR FILTERS ---
    const handleClearFilters = () => {
        setSearchTerm('');
        setCategoryFilter('');
        setLocationFilter('');
    };

    // --- LOGIC TO CHECK IF ANY FILTER IS ACTIVE ---
    const isFilterActive = searchTerm !== '' || categoryFilter !== '' || locationFilter !== '';

    const filteredItems = inventoryItems.filter(item =>
        (item.item_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         item.su_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         item.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         item.category?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (categoryFilter === '' || item.category === categoryFilter) &&
        (locationFilter === '' || item.location === locationFilter)
    );

    const handleAddItemClick = () => {
        setEditingItem(null);
        setIsFormModalOpen(true);
    };

    const handleEditItemClick = (item) => {
        setEditingItem(item);
        setIsFormModalOpen(true);
    };

    const handleViewItemClick = (item) => {
        setViewingItem(item);
        setIsDetailsModalOpen(true);
    };

    const handleDeleteItem = async (itemId) => {
        if (window.confirm("Are you sure you want to delete this inventory item? This action cannot be undone.")) {
            try {
                await axios.delete(`http://localhost:5000/api/inventory/${itemId}`);
                alert('Inventory item deleted successfully!');
                fetchInventoryItems();
            } catch (err) {
                console.error("Error deleting inventory item:", err);
                alert('Failed to delete inventory item. Please try again.');
            }
        }
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (editingItem) {
                await axios.put(`http://localhost:5000/api/inventory/${editingItem.id}`, formData);
                alert('Inventory item updated successfully!');
            } else {
                await axios.post('http://localhost:5000/api/inventory', formData);
                alert('Inventory item added successfully!');
            }
            setIsFormModalOpen(false);
            fetchInventoryItems();
        } catch (err) {
            console.error("Error submitting inventory form:", err.response?.data || err.message);
            const errorMessage = err.response?.data?.message || 'Failed to save inventory item.';
            alert(errorMessage);
        }
    };

    const uniqueLocations = Array.from(new Set(inventoryItems.map(item => item.location || 'N/A')));
    const uniqueCategories = Array.from(new Set(inventoryItems.map(item => item.category || 'N/A')));

    if (loading) {
        return <div className="inventory-master-container"><p>Loading inventory...</p></div>;
    }

    if (error) {
        return <div className="inventory-master-container"><p className="error-message">{error}</p></div>;
    }

    return (
        <div className="inventory-master-container">
            <div className="inventory-master-header">
                <h2>Van Inventory Management</h2>
                <div className="search-add-group">
                    <div className="search-bar">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search inventory items..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <button className="add-item-btn" onClick={handleAddItemClick}>
                        <FaPlus /> Add Inventory Entry
                    </button>
                </div>
            </div>

            {/* Filter Row - Aligned with Van Master UI */}
            <div className="filter-row">
                <div className="filter-group">
                    <FaFilter className="filter-icon" />
                </div>
                <div className="filter-group">
                    <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                        <option value="">All Categories</option>
                        {uniqueCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <div className="filter-group">
                    <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
                        <option value="">All Locations</option>
                        {uniqueLocations.map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                        ))}
                    </select>
                </div>

                {/* --- ADDED CONDITIONAL "CLEAR FILTERS" BUTTON --- */}
                {isFilterActive && (
                    <div className="filter-clear">
                        <button className="clear-filters-btn" onClick={handleClearFilters}>
                            <FaTimesCircle /> Clear Filters
                        </button>
                    </div>
                )}
            </div>

            <div className="inventory-cards-container">
                {filteredItems.length > 0 ? (
                    filteredItems.map(item => (
                        <div className="inventory-card" key={item.id}>
                            <div className="inventory-card-header">
                                <h3>{item.su_number}</h3>
                                <span className="item-category">{item.category}</span>
                            </div>
                            <p><strong>Item:</strong> {item.item_name}</p>
                            <p><strong>Quantity:</strong> {item.quantity} {item.unit_of_measure}</p>
                            <p><strong>Location:</strong> {item.location || 'N/A'}</p>
                            <div className="inventory-card-actions">
                                <button className="action-btn view-btn" onClick={() => handleViewItemClick(item)}>
                                    <FaEye /> View
                                </button>
                                <button className="action-btn edit-btn" onClick={() => handleEditItemClick(item)}>
                                    <FaEdit /> Edit
                                </button>
                                <button className="action-btn delete-btn" onClick={() => handleDeleteItem(item.id)}>
                                    <FaTrashAlt /> Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-items-message">No inventory items found. Add a new entry!</p>
                )}
            </div>

            {isFormModalOpen && (
                <InventoryFormModal
                    isOpen={isFormModalOpen}
                    onClose={() => setIsFormModalOpen(false)}
                    onSubmit={handleFormSubmit}
                    initialData={editingItem}
                />
            )}

            {isDetailsModalOpen && (
                <InventoryDetailsModal
                    isOpen={isDetailsModalOpen}
                    onClose={() => setIsDetailsModalOpen(false)}
                    item={viewingItem}
                />
            )}
        </div>
    );
}

export default Inventory;