// salesapp/src/components/DashboardLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom'; // Outlet renders child routes
import TopNavigationBar from './TopNavigationBar';
import '../styles/Dashboard.css';

function Dashboard() {
    return (
        <div className="dashboard-layout">
            <TopNavigationBar />
            <main className="dashboard-content">
                {/* This Outlet will render the matched child route component (e.g., VanMaster) */}
                <Outlet />
            </main>
        </div>
    );
}

export default Dashboard;
