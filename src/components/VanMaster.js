import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import VanFormModal from './VanFormModal';
import VanDetailsModal from './VanDetailsModal';
import { FaPlus, FaEdit, FaTrashAlt, FaSearch, FaFilter, FaTimesCircle, FaEye } from 'react-icons/fa';
import '../styles/VanMaster.css';

// Constants
const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman & Diu",
  "Lakshadweep", "Delhi", "Puducherry"
].sort();

const tamilNaduRegions = [
  "North Tamil Nadu",
  "South Tamil Nadu"
];

const zoneData = {
  "North Tamil Nadu": [
    "Chennai", "Vellore", "Kancheepuram", "Villupuram", "Tiruvannamalai", "Cuddalore"
  ],
  "South Tamil Nadu": [
    "Madurai", "Trichy", "Tirunelveli", "Coimbatore", "Salem", "Thanjavur", "Virudhunagar"
  ]
};

const vehicleTypes = ["LCV", "HCV", "Cement Carrier", "Tanker", "Other"];
const contractTypes = ["Own", "Leased"];

function VanMaster() {
  const [vans, setVans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVan, setEditingVan] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingVan, setViewingVan] = useState(null);
  const [filterState, setFilterState] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [filterZone, setFilterZone] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterContractType, setFilterContractType] = useState('');

  const fetchVans = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/api/vans');
      setVans(response.data);
    } catch (err) {
      console.error("Error fetching vans:", err);
      setError('Failed to load vans. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVans();
  }, []);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "filterState") {
      setFilterState(value);
      setFilterRegion('');
      setFilterZone('');
    } else if (name === "filterRegion") {
      setFilterRegion(value);
      setFilterZone('');
    } else if (name === "filterZone") {
      setFilterZone(value);
    } else if (name === "filterType") {
      setFilterType(value);
    } else if (name === "filterContractType") {
      setFilterContractType(value);
    }
  };

  const handleClearFilters = () => {
    setFilterState('');
    setFilterRegion('');
    setFilterZone('');
    setFilterType('');
    setFilterContractType('');
    setSearchTerm('');
  };

  const availableFilterRegions = useMemo(() => {
    return filterState === "Tamil Nadu" ? tamilNaduRegions : [];
  }, [filterState]);

  const availableFilterZones = useMemo(() => {
    if (filterState === "Tamil Nadu" && filterRegion) {
      return zoneData[filterRegion] || [];
    }
    return [];
  }, [filterState, filterRegion]);

  const filteredVans = vans.filter(van => {
    const matchesSearch = searchTerm.toLowerCase() === '' ||
      (van.vehicle_number && van.vehicle_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (van.driver_name && van.driver_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (van.model && van.model.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (van.city && van.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (van.zone && van.zone.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilters =
      (filterState === '' || (van.state || '') === filterState) &&
      (filterRegion === '' || (van.region || '') === filterRegion) &&
      (filterZone === '' || (van.zone || '') === filterZone) &&
      (filterType === '' || (van.type || '') === filterType) &&
      (filterContractType === '' || (van.contract_type || '') === filterContractType);

    return matchesSearch && matchesFilters;
  });

  const handleAddVanClick = () => {
    setEditingVan(null);
    setIsModalOpen(true);
  };

  const handleEditVanClick = (van) => {
    setEditingVan(van);
    setIsModalOpen(true);
  };

  const handleViewVanClick = (van) => {
    setViewingVan(van);
    setIsViewModalOpen(true);
  };

  const handleDeleteVan = async (vanId) => {
    if (window.confirm("Are you sure you want to delete this van?")) {
      try {
        await axios.delete(`http://localhost:5000/api/vans/${vanId}`);
        alert('Van deleted successfully!');
        fetchVans();
      } catch (err) {
        console.error("Error deleting van:", err);
        alert('Failed to delete van.');
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingVan) {
        await axios.put(`http://localhost:5000/api/vans/${editingVan.id}`, formData);
        alert('Van updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/vans', formData);
        alert('Van added successfully!');
      }
      setIsModalOpen(false);
      fetchVans();
    } catch (err) {
      console.error("Error submitting form:", err);
      alert('Failed to save van.');
    }
  };

  if (loading) return <div className="van-master-container"><p>Loading vans...</p></div>;
  if (error) return <div className="van-master-container"><p className="error-message">{error}</p></div>;

  const areFiltersActive = searchTerm || filterState || filterRegion || filterZone || filterType || filterContractType;

  return (
    <div className="van-master-container">
      <div className="van-master-header">
        <h2>Van Master</h2>
        <div className="search-add-group">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by vehicle no., driver..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <button className="add-van-btn" onClick={handleAddVanClick}>
            <FaPlus /> Add New Van
          </button>
        </div>
      </div>

      <div className="van-filters-section">
        <FaFilter className="filter-icon" />
        <div className="filter-group">
          <label>State:</label>
          <select name="filterState" value={filterState} onChange={handleFilterChange}>
            <option value="">All States</option>
            {indianStates.map(state => <option key={state} value={state}>{state}</option>)}
          </select>
        </div>

        {filterState === "Tamil Nadu" && (
          <div className="filter-group">
            <label>Region:</label>
            <select name="filterRegion" value={filterRegion} onChange={handleFilterChange}>
              <option value="">All Regions</option>
              {availableFilterRegions.map(region => <option key={region} value={region}>{region}</option>)}
            </select>
          </div>
        )}

        {filterRegion && filterState === "Tamil Nadu" && (
          <div className="filter-group">
            <label>Zone:</label>
            <select name="filterZone" value={filterZone} onChange={handleFilterChange}>
              <option value="">All Zones</option>
              {availableFilterZones.map(zone => <option key={zone} value={zone}>{zone}</option>)}
            </select>
          </div>
        )}

        <div className="filter-group">
          <label>Type:</label>
          <select name="filterType" value={filterType} onChange={handleFilterChange}>
            <option value="">All Types</option>
            {vehicleTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>

        <div className="filter-group">
          <label>Contract:</label>
          <select name="filterContractType" value={filterContractType} onChange={handleFilterChange}>
            <option value="">All Contracts</option>
            {contractTypes.map(contract => <option key={contract} value={contract}>{contract}</option>)}
          </select>
        </div>

        {areFiltersActive && (
          <button className="clear-filters-btn" onClick={handleClearFilters}>
            <FaTimesCircle /> Clear Filters
          </button>
        )}
      </div>

      <div className="van-cards-container">
        {filteredVans.length ? filteredVans.map(van => (
          <div key={van.id} className="van-card">
            <div className="van-card-header">
              <h3>{van.vehicle_number}</h3>
              <span className={`status-indicator ${van.status === 'Active' ? 'active' : 'maintenance'}`}>
                {van.status || 'Active'}
              </span>
            </div>
            <p><strong>Model:</strong> {van.model} ({van.manufacturing_year})</p>
            <p><strong>Driver:</strong> {van.driver_name}</p>
            <p><strong>Location:</strong> {van.city}, {van.state}</p>
            <div className="van-card-actions">
              <button className="action-btn view-btn" onClick={() => handleViewVanClick(van)}>
                <FaEye /> View
              </button>
              <button className="action-btn edit-btn" onClick={() => handleEditVanClick(van)}>
                <FaEdit /> Edit
              </button>
              <button className="action-btn delete-btn" onClick={() => handleDeleteVan(van.id)}>
                <FaTrashAlt /> Delete
              </button>
            </div>
          </div>
        )) : <p>No vans found.</p>}
      </div>

      {isModalOpen && (
        <VanFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFormSubmit}
          initialData={editingVan}
        />
      )}

      {isViewModalOpen && (
        <VanDetailsModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          vanData={viewingVan}
        />
      )}
    </div>
  );
}

export default VanMaster;
