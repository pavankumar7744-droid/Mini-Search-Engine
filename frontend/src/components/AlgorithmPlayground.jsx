import React, { useState } from 'react';

const API_BASE = 'http://localhost:3000/api';

export default function AlgorithmPlayground() {
    const [activeTab, setActiveTab] = useState('maxflow');

    return (
        <div>
            <h2>Algorithm Playground</h2>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button className="btn" onClick={() => setActiveTab('maxflow')}>Max Flow (Dinic)</button>
                <button className="btn" onClick={() => setActiveTab('vertexcover')}>Vertex Cover</button>
                <button className="btn" onClick={() => setActiveTab('primality')}>Primality (Miller-Rabin)</button>
            </div>

            {activeTab === 'maxflow' && <MaxFlowDemo />}
            {activeTab === 'vertexcover' && <VertexCoverDemo />}
            {activeTab === 'primality' && <PrimalityDemo />}
        </div>
    );
}

function MaxFlowDemo() {
    const [result, setResult] = useState(null);
    const runDemo = async () => {
        // Hardcoded example for demonstration: Students -> Projects matching
        const payload = {
            V: 6, // 0: source, 1,2: students, 3,4: projects, 5: sink
            source: 0,
            sink: 5,
            edges: [
                { u: 0, v: 1, capacity: 1 },
                { u: 0, v: 2, capacity: 1 },
                { u: 1, v: 3, capacity: 1 },
                { u: 1, v: 4, capacity: 1 },
                { u: 2, v: 3, capacity: 1 },
                { u: 3, v: 5, capacity: 1 },
                { u: 4, v: 5, capacity: 1 },
            ]
        };
        const res = await fetch(`${API_BASE}/algorithms/max-flow`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        setResult(data);
    };

    return (
        <div className="card">
            <h3>Dinic's Maximum Flow</h3>
            <p>Demonstration of Maximum Bipartite Matching using Max Flow.</p>
            <button className="btn" onClick={runDemo}>Run Dinic's Algorithm</button>
            {result && (
                <div style={{marginTop: '1rem', fontFamily: 'monospace'}}>
                    <p>Maximum flow / matching: {result.maxFlow}</p>
                    <p>BFS iterations (Level graphs built): {result.iterations}</p>
                </div>
            )}
        </div>
    );
}

function VertexCoverDemo() {
    const [result, setResult] = useState(null);
    const runDemo = async () => {
        const payload = {
            edges: [
                [0, 1], [0, 2], [1, 3], [3, 4], [4, 5]
            ]
        };
        const res = await fetch(`${API_BASE}/algorithms/vertex-cover`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        setResult(data);
    };

    return (
        <div className="card">
            <h3>Vertex Cover 2-Approximation</h3>
            <p>NP-hard problem approximated using maximal matching.</p>
            <button className="btn" onClick={runDemo}>Run Approximation</button>
            {result && (
                <div style={{marginTop: '1rem', fontFamily: 'monospace'}}>
                    <p>Approximate Vertex Cover: [{result.cover.join(', ')}]</p>
                    <p>Size: {result.size}</p>
                    <p>Approximation guarantee: 2</p>
                </div>
            )}
        </div>
    );
}

function PrimalityDemo() {
    const [num, setNum] = useState(104729);
    const [result, setResult] = useState(null);

    const runDemo = async () => {
        const res = await fetch(`${API_BASE}/algorithms/primality`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ number: num })
        });
        const data = await res.json();
        setResult(data);
    };

    return (
        <div className="card">
            <h3>Miller-Rabin Primality Test</h3>
            <div style={{display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem'}}>
                <input type="number" value={num} onChange={e => setNum(e.target.value)} />
                <button className="btn" onClick={runDemo}>Test Primality</button>
            </div>
            {result && (
                <div style={{fontFamily: 'monospace'}}>
                    <p>Result: {result.result ? 'Probably Prime' : 'Composite'}</p>
                    <p>Witness iterations: {result.iterations}</p>
                </div>
            )}
        </div>
    );
}
