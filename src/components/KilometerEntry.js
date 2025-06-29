import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/KilometerEntry.css';
import KilometerFormModal from './KilometerFormModal';
import KilometerDetailsModal from './KilometerDetailsModal';
import { FaPlus, FaSearch, FaEye, FaEdit, FaTrashAlt, FaTimesCircle, FaFilter } from 'react-icons/fa';

function KilometerEntry() {
    const [entries, setEntries] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState(''); // New state for status filter
    const [fromDate, setFromDate] = useState('');         // New state for From Date
    const [toDate, setToDate] = useState('');             // New state for To Date
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchEntries = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:5000/api/kilometer-entries');
            setEntries(response.data);
        } catch (err) {
            console.error('Error fetching kilometer entries:', err);
            setError('Failed to load kilometer entries. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    // --- Updated Filtered Entries Logic ---
    const filteredEntries = entries.filter(entry => {
        // 1. Filter by search query (Vehicle No)
        const matchesSearch = entry.vehicleNo?.toLowerCase().includes(searchQuery.toLowerCase());

        // 2. Filter by status
        const matchesStatus = statusFilter === '' || entry.authorization?.toLowerCase() === statusFilter.toLowerCase();

        // 3. Filter by date range
        const entryDate = new Date(entry.entryDate);
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;

        const matchesDate = (!from || entryDate >= from) && (!to || entryDate <= to);

        return matchesSearch && matchesStatus && matchesDate;
    });
    
    // Check if any filter is active to show the clear button
    const isFilterActive = searchQuery !== '' || statusFilter !== '' || fromDate !== '' || toDate !== '';

    // --- Updated Clear Filters Handler ---
    const handleClearFilters = () => {
        setSearchQuery('');
        setStatusFilter('');
        setFromDate('');
        setToDate('');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this entry?')) {
            try {
                await axios.delete(`http://localhost:5000/api/kilometer-entries/${id}`);
                alert('Entry deleted successfully!');
                fetchEntries();
            } catch (error) {
                console.error('Error deleting entry:', error);
                alert('Failed to delete entry. Please try again.');
            }
        }
    };

    const handleAddClick = () => {
        setEditData(null);
        setShowFormModal(true);
    };

    const handleEditClick = (entry) => {
        setEditData(entry);
        setShowFormModal(true);
    };

    if (loading) {
        return <div className="kilometer-entry-container"><p>Loading entries...</p></div>;
    }

    if (error) {
        return <div className="kilometer-entry-container"><p className="error-message">{error}</p></div>;
    }

    return (
        <div className="kilometer-entry-container">
            {/* Header Section with Title, Search, and Add Button */}
            <div className="kilometer-entry-header">
                <h2>Van Kilometer Management</h2>
                <div className="search-add-group">
                    <div className="search-bar">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search by Vehicle No..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="add-kilometer-btn" onClick={handleAddClick}>
                        <FaPlus /> Add Kilometer Entry
                    </button>
                </div>
            </div>

            {/* New Filter Section with consistent layout */}
            <div className="filter-row">
                <span className="filter-icon"><FaFilter /></span>
                <div className="filter-group">
                    <label htmlFor="statusFilter">Status:</label>
                    <select
                        id="statusFilter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="yet to authorize">Yet to Authorize</option>
                        <option value="authorized">Authorized</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label htmlFor="fromDate">From Date:</label>
                    <input
                        id="fromDate"
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <label htmlFor="toDate">To Date:</label>
                    <input
                        id="toDate"
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                    />
                </div>
                {isFilterActive && (
                    <div className="filter-clear">
                        <button className="clear-filters-btn" onClick={handleClearFilters}>
                            <FaTimesCircle /> Clear Filters
                        </button>
                    </div>
                )}
            </div>

            {/* Entries Card Container */}
            <div className="card-container">
                {filteredEntries.length > 0 ? (
                    filteredEntries.map(entry => (
                        <div key={entry.id} className="kilometer-card">
                            <div className="card-header">
                                <h4>{entry.vehicleNo}</h4>
                                <span className={`status-badge ${entry.authorization?.toLowerCase()?.replace(/\s/g, '-')}`}>
                                    {entry.authorization}
                                </span>
                            </div>
                            <div className="card-details">
                                <p><strong>GPS No:</strong> {entry.gpsNumber || 'N/A'}</p>
                                <p><strong>Opening KM:</strong> {entry.openingKm}</p>
                                <p><strong>Closing KM:</strong> {entry.closingKm}</p>
                                <p><strong>Day KM:</strong> {entry.dayKm}</p>
                                <p><strong>Date:</strong> {new Date(entry.entryDate).toLocaleDateString()}</p>
                            </div>
                            <div className="card-buttons">
                                <button className="action-btn view-btn" onClick={() => setSelectedEntry(entry)}>
                                    <FaEye /> View
                                </button>
                                <button className="action-btn edit-btn" onClick={() => handleEditClick(entry)}>
                                    <FaEdit /> Edit
                                </button>
                                <button className="action-btn delete-btn" onClick={() => handleDelete(entry.id)}>
                                    <FaTrashAlt /> Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-items-message">No kilometer entries found. Add a new entry!</p>
                )}
            </div>

            {/* Modals */}
            {showFormModal && (
                <KilometerFormModal
                    closeModal={() => setShowFormModal(false)}
                    refresh={fetchEntries}
                    editData={editData}
                />
            )}

            {selectedEntry && (
                <KilometerDetailsModal
                    entry={selectedEntry}
                    closeModal={() => setSelectedEntry(null)}
                />
            )}
        </div>
    );
}

export default KilometerEntry;