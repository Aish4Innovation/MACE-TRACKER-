// salesapp/src/components/TopNavigationBar.js
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaTruck, FaBox, FaRoad, FaStopwatch, FaUserCircle, FaSignOutAlt, FaChartBar } from 'react-icons/fa'; // Importing new FaChartBar icon
import '../styles/TopNavigationBar.css';

function TopNavigationBar() {
    const location = useLocation(); // Hook to get current route information
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));
    const userName = user ? user.name || user.email : 'User'; // Display user name or email

    const handleLogout = () => {
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        navigate('/'); // Redirect to login page
    };

    return (
        <nav className="top-nav-bar">
            <div className="nav-brand">
                {/* You can replace this with your MACE Track logo */}
                <span>MACE Track</span>
            </div>

            <div className="nav-links">
                <Link
                    to="/dashboard/van-master"
                    className={`nav-item ${location.pathname.startsWith('/dashboard/van-master') ? 'active' : ''}`}
                >
                    <FaTruck className="nav-icon" />
                    <span>Van Master</span>
                </Link>
                <Link
                    to="/dashboard/inventory"
                    className={`nav-item ${location.pathname.startsWith('/dashboard/inventory') ? 'active' : ''}`}
                >
                    <FaBox className="nav-icon" />
                    <span>Inventory</span>
                </Link>
                <Link
                    to="/dashboard/kilometer-entry"
                    className={`nav-item ${location.pathname.startsWith('/dashboard/kilometer-entry') ? 'active' : ''}`}
                >
                    <FaRoad className="nav-icon" />
                    <span>Kilometer Entry</span>
                </Link>
                <Link
                    to="/dashboard/stoppage-entry"
                    className={`nav-item ${location.pathname.startsWith('/dashboard/stoppage-entry') ? 'active' : ''}`}
                >
                    <FaStopwatch className="nav-icon" />
                    <span>Stoppage Entry</span>
                </Link>
                {/* --- New Link for Reports & Analysis --- */}
                <Link
                    to="/dashboard/reports"
                    className={`nav-item ${location.pathname.startsWith('/dashboard/reports') ? 'active' : ''}`}
                >
                    <FaChartBar className="nav-icon" />
                    <span>Report & Analysis</span>
                </Link>
                {/* --- End of New Link --- */}
            </div>

            <div className="nav-user-info">
                <FaUserCircle className="user-icon" />
                <span>{userName}</span>
                <button onClick={handleLogout} className="logout-btn">
                    <FaSignOutAlt className="logout-icon" />
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default TopNavigationBar;
