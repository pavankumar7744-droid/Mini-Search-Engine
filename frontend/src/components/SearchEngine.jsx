import React, { useState } from 'react';

const API_BASE = 'http://localhost:3000/api';

export default function SearchEngine() {
    const [query, setQuery] = useState('');
    const [mode, setMode] = useState('pattern'); // pattern, fuzzy, similarity
    const [results, setResults] = useState(null);
    const [selection, setSelection] = useState(null);
    const [stats, setStats] = useState(null);
    const [comparisonStats, setComparisonStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showDebug, setShowDebug] = useState(false);

    const handleSearch = async (compare = false) => {
        if (!query) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/search/${mode}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, maxDistance: 2, compare })
            });
            const data = await res.json();
            setResults(data.results);
            setSelection(data.selection);
            setStats(data.stats);
            setComparisonStats(data.comparisonStats);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <div className="search-container">
            <div className="search-box">
                <input 
                    type="text" 
                    className="search-input" 
                    placeholder="Search across your documents... (Use commas for multi-pattern)" 
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch(false)}
                />
                <button className="search-button" onClick={() => handleSearch(false)}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </div>

            <div className="search-options">
                <label className="radio-label">
                    <input type="radio" name="mode" checked={mode === 'pattern'} onChange={() => setMode('pattern')} /> Exact / Multi-Pattern
                </label>
                <label className="radio-label">
                    <input type="radio" name="mode" checked={mode === 'fuzzy'} onChange={() => setMode('fuzzy')} /> Fuzzy Search
                </label>
                <label className="radio-label">
                    <input type="radio" name="mode" checked={mode === 'similarity'} onChange={() => setMode('similarity')} /> Document Similarity
                </label>

                <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem' }}>
                    <button className="btn" style={{backgroundColor: '#6366f1'}} onClick={() => handleSearch(true)}>
                        Compare Algorithms
                    </button>
                    <button className="btn" style={{backgroundColor: '#475569'}} onClick={() => setShowDebug(!showDebug)}>
                        {showDebug ? 'Hide Debug' : 'Engine Debug'}
                    </button>
                </div>
            </div>

            {showDebug && selection && (
                <div className="card" style={{borderColor: 'orange', width: '100%', maxWidth: '800px', fontFamily: 'monospace'}}>
                    <h3 style={{color: 'orange'}}>Engine Debug</h3>
                    <p><strong>Query Analysis</strong> -{'>'} Detected: {selection.queryType}</p>
                    <p><strong>Candidates Evaluated:</strong></p>
                    <ul>
                        {selection.alternatives.map((alt, idx) => (
                            <li key={idx}>{alt.name}: {alt.score} - {alt.reason}</li>
                        ))}
                    </ul>
                    <p><strong>Selected Algorithm:</strong> {selection.selected}</p>
                </div>
            )}

            {stats && selection && (
                <div style={{ display: 'flex', gap: '1.5rem', width: '100%', maxWidth: '1000px', marginTop: '1rem' }}>
                    
                    {/* Search Analysis Panel */}
                    <div className="card" style={{ flex: 1, borderTop: '4px solid var(--accent-blue)' }}>
                        <h3 style={{marginTop: 0}}>SEARCH ANALYSIS</h3>
                        <p>Query: <span style={{color: 'var(--accent-blue)'}}>{query}</span></p>
                        <p><strong>Selected Algorithm:</strong> {selection.selected}</p>
                        <p style={{fontStyle: 'italic', color: 'var(--text-muted)'}}>Reason: {selection.reason}</p>
                        <hr style={{borderColor: 'var(--border-color)', margin: '1rem 0'}}/>
                        <p>Execution time: {stats.executionTimeMs.toFixed(3)} ms</p>
                        <p>Documents processed: {stats.documentsSearched}</p>
                        <p>Total Comparisons: {stats.totalComparisons}</p>
                        <p>Matches Found: {results ? results.reduce((acc, curr) => acc + curr.matchCount, 0) : 0}</p>
                        
                        <p style={{fontSize: '0.8rem', color: '#64748b', marginTop: '1rem'}}>
                            Note: Only the selected algorithm was executed. Alternative algorithms were ranked based on task suitability.
                        </p>
                    </div>

                    {/* Algorithm Ranking Panel */}
                    <div className="card" style={{ flex: 1, borderTop: '4px solid #8b5cf6' }}>
                        <h3 style={{marginTop: 0}}>ALGORITHM SELECTION</h3>
                        <div style={{fontFamily: 'monospace', fontSize: '0.9rem'}}>
                            {selection.alternatives.map((alt, idx) => (
                                <div key={idx} style={{marginBottom: '1rem'}}>
                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <strong style={{color: idx === 0 ? 'var(--success)' : 'inherit'}}>#{idx+1} {alt.name}</strong>
                                        <span>Suitability: {alt.score}%</span>
                                    </div>
                                    <div style={{color: 'var(--text-muted)'}}>Reason: {alt.reason}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Comparison Mode Results */}
            {comparisonStats && (
                <div className="card" style={{ width: '100%', maxWidth: '1000px', borderTop: '4px solid #ec4899' }}>
                    <h3 style={{marginTop: 0}}>ALGORITHM BENCHMARK COMPARISON</h3>
                    <table style={{width: '100%', textAlign: 'left', borderCollapse: 'collapse'}}>
                        <thead>
                            <tr style={{borderBottom: '1px solid var(--border-color)'}}>
                                <th style={{padding: '0.5rem'}}>Algorithm</th>
                                <th style={{padding: '0.5rem'}}>Execution Time</th>
                                <th style={{padding: '0.5rem'}}>Comparisons</th>
                                <th style={{padding: '0.5rem'}}>Matches</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comparisonStats.map((stat, idx) => (
                                <tr key={idx} style={{borderBottom: '1px solid var(--border-color)'}}>
                                    <td style={{padding: '0.5rem'}}>{stat.algorithm}</td>
                                    <td style={{padding: '0.5rem'}}>{stat.timeMs.toFixed(3)} ms</td>
                                    <td style={{padding: '0.5rem'}}>{stat.comparisons}</td>
                                    <td style={{padding: '0.5rem'}}>{stat.matches}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="results-area" style={{maxWidth: '1000px'}}>
                {results && <h3 style={{borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem'}}>Document Search Results</h3>}
                {results && results.length === 0 && <p>No matches found.</p>}
                {results && results.map((r, i) => (
                    <div key={i} className="result-card">
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <h4 className="result-title">#{i+1} {r.filename}</h4>
                            <span style={{fontSize: '0.9rem', color: 'var(--success)'}}>{r.matchCount} matches (density: {r.matchDensity.toFixed(4)})</span>
                        </div>
                        <div className="result-snippet">
                            {r.snippet}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
