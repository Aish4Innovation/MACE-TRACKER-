import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/StoppageEntry.css';
import StoppageEntryFormModal from './StoppageEntryFormModal';
import StoppageEntryDetailsModal from './StoppageEntryDetailsModal';
// Import specific icons for View, Edit, Delete, Plus, Search, Filter, Clear Filters
import { FaEye, FaEdit, FaTrashAlt, FaPlus, FaSearch, FaFilter, FaTimesCircle } from 'react-icons/fa'; 

function StoppageEntry() {
    const [stoppageEntries, setStoppageEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [editEntry, setEditEntry] = useState(null); // for editing
    const [searchText, setSearchText] = useState('');
    const [filterStatus, setFilterStatus] = useState(''); // New state for status filter

    const fetchStoppageEntries = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/stoppages');
            setStoppageEntries(response.data);
        } catch (err) {
            console.error('Error fetching stoppage entries:', err);
            setError('Failed to fetch stoppage entries. Please check the backend server.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStoppageEntries();
    }, []);

    const openFormModal = () => {
        setEditEntry(null); // clear previous edit
        setIsFormModalOpen(true);
    };
    const closeFormModal = () => {
        setEditEntry(null);
        setIsFormModalOpen(false);
    };

    const handleResolve = async (id) => {
        // IMPORTANT: In a real application, replace window.confirm with a custom modal for better UX
        if (window.confirm('Mark this stoppage as Resolved?')) { 
            try {
                await axios.put(`http://localhost:5000/api/stoppages/${id}`, { status: 'Resolved' });
                fetchStoppageEntries();
            } catch (err) {
                console.error('Error updating status:', err);
                alert('Failed to update status.'); // Using alert as per previous pattern
            }
        }
    };

    const handleDelete = async (id) => {
        // IMPORTANT: In a real application, replace window.confirm with a custom modal for better UX
        if (window.confirm('Delete this stoppage entry?')) {
            try {
                await axios.delete(`http://localhost:5000/api/stoppages/${id}`);
                fetchStoppageEntries();
            } catch (err) {
                console.error('Error deleting entry:', err);
                alert('Failed to delete entry.'); // Using alert as per previous pattern
            }
        }
    };

    const handleEditClick = (entry) => {
        setEditEntry(entry); // set the entry to edit
        setIsFormModalOpen(true); // open the modal in edit mode
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    // Handler for status filter change
    const handleFilterChange = (e) => {
        setFilterStatus(e.target.value);
    };

    // Handler for clearing all filters (including search text)
    const handleClearFilters = () => {
        setFilterStatus('');
        setSearchText('');
    };

    // Filtered entries based on search text and status filter
    const filteredEntries = stoppageEntries.filter(entry => {
        const matchesSearch = entry.vehicle_no?.toLowerCase().includes(searchText.toLowerCase());
        const matchesStatus = filterStatus === '' || entry.status?.toLowerCase() === filterStatus.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    // Check if any filters are active to show/hide the "Clear Filters" button
    const areFiltersActive = searchText || filterStatus;


    return (
        <div className="stoppage-entry-container">
            <div className="header-actions">
                <h2>Van Stoppage Entry</h2>
                <div className="search-and-add">
                    {/* Search bar */}
                    <div className="search-bar"> 
                        <FaSearch className="search-icon" /> 
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search by vehicle number..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>
                    {/* Report Stoppage button - NOW BELOW search bar in markup */}
                    <button onClick={openFormModal} className="add-button">
                        <FaPlus /> Report Stoppage 
                    </button>
                </div>
            </div>

            {/* New Filter Section */}
            <div className="stoppage-filters-section">
                <FaFilter className="filter-icon" />
                <div className="filter-group">
                    <label>Status:</label>
                    <select name="statusFilter" value={filterStatus} onChange={handleFilterChange}>
                        <option value="">All Statuses</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Resolved">Resolved</option>
                    </select>
                </div>

                {areFiltersActive && (
                    <button className="clear-filters-btn" onClick={handleClearFilters}>
                        <FaTimesCircle /> Clear Filters
                    </button>
                )}
            </div>

            {loading ? (
                <p>Loading stoppage entries...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : filteredEntries.length === 0 ? (
                <p className="no-items-message">No stoppage entries found.</p> 
            ) : (
                <div className="card-container">
                    {filteredEntries.map(entry => (
                        <div key={entry.id} className="stoppage-card">
                            <div className="card-header">
                                <h4> {entry.vehicle_no}</h4>
                                <span className={`status-badge ${entry.status?.toLowerCase()}`}>
                                    {entry.status}
                                </span>
                            </div>
                            <div className="card-details" onClick={() => setSelectedEntry(entry)}>
                                <p><strong>From:</strong> {formatDate(entry.from_date)}</p>
                                <p><strong>To:</strong> {formatDate(entry.to_date)}</p>
                                <p><strong>Reason:</strong> {entry.reason}</p>
                                {entry.spare_vehicle && (
                                    <p><strong>Spare:</strong> {entry.spare_vehicle}</p>
                                )}
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
                    ))}
                </div>
            )}

            {/* Form Modal */}
            {isFormModalOpen && (
                <StoppageEntryFormModal
                    closeModal={closeFormModal}
                    refresh={fetchStoppageEntries}
                    editData={editEntry} 
                />
            )}

            {/* Details Modal */}
            {selectedEntry && (
                <StoppageEntryDetailsModal
                    entry={selectedEntry}
                    closeModal={() => setSelectedEntry(null)}
                />
            )}
        </div>
    );
}

export default StoppageEntry;