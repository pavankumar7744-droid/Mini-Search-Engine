const express = require('express');
const router = express.Router();
const { Graph } = require('../algorithms/dinic');
const { vertexCover2Approx } = require('../algorithms/vertexCover');
const { isPrime } = require('../algorithms/millerRabin');
const { reservoirSampling } = require('../algorithms/reservoirSampling');

router.post('/max-flow', (req, res) => {
    const { V, edges, source, sink } = req.body;
    if (!V || !edges || source === undefined || sink === undefined) {
        return res.status(400).json({ error: 'Invalid graph input' });
    }

    const g = new Graph(V);
    edges.forEach(e => {
        g.addEdge(e.u, e.v, e.capacity);
    });

    const result = g.dinicMaxflow(source, sink);
    res.json(result);
});

router.post('/vertex-cover', (req, res) => {
    const { edges } = req.body;
    if (!edges) {
        return res.status(400).json({ error: 'Invalid edges' });
    }

    const result = vertexCover2Approx(edges);
    res.json(result);
});

router.post('/primality', (req, res) => {
    const { number } = req.body;
    if (number === undefined) return res.status(400).json({ error: 'Invalid number' });
    
    // Convert to BigInt handled inside function, k=10 iterations
    const result = isPrime(number, 10); 
    res.json(result);
});

router.post('/reservoir', (req, res) => {
    const { stream, k } = req.body;
    if (!stream || k === undefined) return res.status(400).json({ error: 'Invalid input' });

    const result = reservoirSampling(stream, k);
    res.json({ sample: result });
});

module.exports = router;
