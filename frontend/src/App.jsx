import React, { useState } from 'react';
import './index.css';
import SearchEngine from './components/SearchEngine';
import Documents from './components/Documents';
import AlgorithmPlayground from './components/AlgorithmPlayground';
import Stats from './components/Stats';

function App() {
  const [currentView, setCurrentView] = useState('search');

  const renderView = () => {
    switch (currentView) {
      case 'search': return <SearchEngine />;
      case 'documents': return <Documents />;
      case 'playground': return <AlgorithmPlayground />;
      case 'stats': return <Stats />;
      default: return <SearchEngine />;
    }
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <h1 className="logo">TextHack</h1>
        <div className="nav-links">
          <button className={`nav-link ${currentView === 'search' ? 'active' : ''}`} onClick={() => setCurrentView('search')}>Search Engine</button>
          <button className={`nav-link ${currentView === 'documents' ? 'active' : ''}`} onClick={() => setCurrentView('documents')}>Documents</button>
          <button className={`nav-link ${currentView === 'playground' ? 'active' : ''}`} onClick={() => setCurrentView('playground')}>Algorithm Playground</button>
          <button className={`nav-link ${currentView === 'stats' ? 'active' : ''}`} onClick={() => setCurrentView('stats')}>Engine Statistics</button>
        </div>
        <div style={{ color: 'var(--success)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: 8, height: 8, backgroundColor: 'var(--success)', borderRadius: '50%', display: 'inline-block' }}></span>
          Engine Ready
        </div>
      </nav>
      
      <main className="main-content">
        {renderView()}
      </main>
    </div>
  );
}

export default App;
