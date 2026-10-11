const express = require('express');
const router = express.Router();
const { searchDocuments } = require('../search/searchEngine');
const { updateStats } = require('../services/documentStorage');

router.post('/:mode', (req, res) => {
    // Mode is now basically a strong hint ('pattern', 'fuzzy', 'similarity')
    const { query, maxDistance, compare } = req.body;
    const mode = req.params.mode;

    if (!query) {
        return res.status(400).json({ error: 'Empty query' });
    }

    const result = searchDocuments(query, mode, maxDistance || 2, compare || false);
    
    updateStats(result.stats.executionTimeMs, result.stats.algorithm);

    res.json(result);
});

module.exports = router;
