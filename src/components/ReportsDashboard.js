import React from 'react';
import '../styles/Dashboard.css'; // You can use your existing dashboard styles
import VanStateChart from './VanStateChart'; // Import the new chart component
import InventoryCategoryChart from './InventoryCategoryChart';
import StoppageReasonPieChart from './StoppageReasonPieChart';

function ReportsDashboard() {
    return (
        <div className="reports-container">
            <h2 className="reports-header">Report & Analysis</h2>
            <p>This is where your real-time charts and graphs will be displayed!</p>
            {/* Chart components will be added here in Phase 3 */}
            <div className="charts-grid">
                {/* Van Master Chart */}
                <div className="chart-placeholder">
                    <VanStateChart />
                </div>

                <div className="chart-placeholder">
                    <InventoryCategoryChart />
                </div>
                
                
                <div className="chart-placeholder">
                    <StoppageReasonPieChart />
                </div>
            </div>
        </div>
    );
}

export default ReportsDashboard;
