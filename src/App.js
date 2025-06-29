import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import VanMaster from './components/VanMaster';
import Inventory from './components/Inventory';
import KilometerEntry from './components/KilometerEntry';
import StoppageEntry from './components/StoppageEntry';
import ForgotPasswordPage from './components/ForgotPasswordPage';

import ReportsDashboard from './components/ReportsDashboard'; // Import the new component

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot" element={<ForgotPasswordPage />} />
                    

                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Navigate to="van-master" replace />} />
                        <Route path="van-master" element={<VanMaster />} />
                        <Route path="inventory" element={<Inventory />} />
                        <Route path="kilometer-entry" element={<KilometerEntry />} />
                        <Route path="stoppage-entry" element={<StoppageEntry />} />
                        {/* --- New Route for Reports --- */}
                        <Route path="reports" element={<ReportsDashboard />} />
                        {/* --- End of New Route --- */}
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
