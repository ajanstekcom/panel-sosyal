import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Sidebar from '../components/Sidebar.jsx';
import LivePriceGrid from '../components/LiveData/LivePriceGrid.jsx';
import RightPanel from '../components/RightPanel.jsx';
import '../styles/App.css';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [rightPanelWidth, setRightPanelWidth] = useState(500);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="dashboard-layout">
            <Sidebar onLogout={logout} user={user} />

            <main style={{ flex: 1, padding: '24px', overflowY: 'auto', background: '#f5f5f7' }}>
                <header style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '-0.5px' }}>Canlı Piyasalar</h1>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                        {currentTime.toLocaleString('tr-TR', {
                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                            hour: '2-digit', minute: '2-digit', second: '2-digit'
                        })}
                    </div>
                </header>

                <LivePriceGrid />
            </main>

            <RightPanel width={rightPanelWidth} setWidth={setRightPanelWidth} />
        </div>
    );
};

export default Dashboard;
