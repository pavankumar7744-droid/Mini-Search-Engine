import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:3000/api';

export default function Stats() {
    const [stats, setStats] = useState(null);
    const [docsCount, setDocsCount] = useState(0);

    useEffect(() => {
        const fetchStats = async () => {
            const res = await fetch(`${API_BASE}/stats`);
            const data = await res.json();
            setStats(data);

            const docRes = await fetch(`${API_BASE}/documents`);
            const docData = await docRes.json();
            setDocsCount(docData.length);
        };
        fetchStats();
    }, []);

    if (!stats) return <p>Loading stats...</p>;

    return (
        <div>
            <h2>Engine Statistics</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="card">
                    <h3>General Overview</h3>
                    <p>Documents Indexed: {docsCount}</p>
                    <p>Total Search Operations: {stats.searches}</p>
                </div>

                <div className="card">
                    <h3>Algorithm Usage</h3>
                    {Object.entries(stats.algorithms).map(([algo, count]) => (
                        <div key={algo} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>{algo}</span>
                            <strong>{count} searches</strong>
                        </div>
                    ))}
                    {Object.keys(stats.algorithms).length === 0 && <p>No searches performed yet.</p>}
                </div>
            </div>
        </div>
    );
}
