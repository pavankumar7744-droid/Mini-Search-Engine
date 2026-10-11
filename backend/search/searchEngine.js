const { kmpSearch } = require('../algorithms/kmp');
const { zAlgorithmSearch } = require('../algorithms/zAlgorithm');
const { rabinKarpSearch } = require('../algorithms/rabinKarp');
const { levenshteinDistance } = require('../algorithms/editDistance');
const { damerauLevenshtein } = require('../algorithms/damerauLevenshtein');
const { AhoCorasick } = require('../algorithms/ahoCorasick');
const { smithWaterman } = require('../algorithms/smithWaterman');
const { indexerInstance } = require('./indexer');
const { selectAlgorithms } = require('./algorithmSelector');

function executeAlgorithm(doc, query, algorithm, maxDistance = 2) {
    let matches = [];
    let comparisons = 0;
    let snippet = "";
    let isMatch = false;

    if (algorithm === 'KMP') {
        const res = kmpSearch(doc.content.toLowerCase(), query.toLowerCase());
        matches = res.matches;
        comparisons = res.comparisons;
        if (matches.length > 0) isMatch = true;
    } else if (algorithm === 'ZAlgorithm') {
        const res = zAlgorithmSearch(doc.content.toLowerCase(), query.toLowerCase());
        matches = res.matches;
        comparisons = res.comparisons;
        if (matches.length > 0) isMatch = true;
    } else if (algorithm === 'RabinKarp') {
        const res = rabinKarpSearch(doc.content.toLowerCase(), query.toLowerCase());
        matches = res.matches;
        comparisons = res.comparisons;
        if (matches.length > 0) isMatch = true;
    } else if (algorithm === 'AhoCorasick') {
        const patterns = query.split(',').map(s => s.trim().toLowerCase());
        const ac = new AhoCorasick(patterns);
        const res = ac.search(doc.content.toLowerCase());
        matches = res.results.map(r => r.index);
        comparisons = res.comparisons;
        if (matches.length > 0) isMatch = true;
    } else if (algorithm === 'Fuzzy-Levenshtein') {
        const words = doc.content.split(/\s+/);
        const queryLower = query.toLowerCase();
        let minDist = Infinity;
        words.forEach(w => {
            const res = levenshteinDistance(w.toLowerCase(), queryLower);
            comparisons += res.comparisons;
            if (res.distance <= maxDistance) {
                isMatch = true;
                if (res.distance < minDist) minDist = res.distance;
            }
        });
        if (isMatch) matches.push({ type: 'fuzzy', minDist });
    } else if (algorithm === 'DamerauLevenshtein') {
        const words = doc.content.split(/\s+/);
        const queryLower = query.toLowerCase();
        let minDist = Infinity;
        words.forEach(w => {
            const res = damerauLevenshtein(w.toLowerCase(), queryLower);
            comparisons += res.comparisons;
            if (res.distance <= maxDistance) {
                isMatch = true;
                if (res.distance < minDist) minDist = res.distance;
            }
        });
        if (isMatch) matches.push({ type: 'fuzzy', minDist });
    } else if (algorithm === 'SmithWaterman') {
        // Here query is treated as another document content
        const res = smithWaterman(doc.content.toLowerCase().substring(0, 500), query.toLowerCase().substring(0, 500)); // Truncate for performance in this demo
        comparisons = res.comparisons;
        if (res.score > 0) {
            isMatch = true;
            matches.push({ type: 'similarity', score: res.score });
        }
    }

    if (isMatch) {
        let matchIdx = typeof matches[0] === 'number' ? matches[0] : 0;
        let start = Math.max(0, matchIdx - 30);
        let end = Math.min(doc.content.length, matchIdx + query.length + 30);
        snippet = doc.content.substring(start, end);
    }

    return { isMatch, matches, comparisons, snippet };
}

function searchDocuments(query, mode, maxDistance = 2, compare = false) {
    const docs = indexerInstance.getDocuments();
    
    // 1. Algorithm Selection
    const selection = selectAlgorithms(query, mode, docs);
    const primaryAlgorithm = selection.selected;

    // 2. Search Execution (Primary)
    let totalComparisons = 0;
    const startTime = process.hrtime.bigint();
    const results = [];

    docs.forEach(doc => {
        const res = executeAlgorithm(doc, query, primaryAlgorithm, maxDistance);
        totalComparisons += res.comparisons;
        
        if (res.isMatch) {
            // Document Ranking Metrics
            let matchDensity = res.matches.length / doc.content.length;
            results.push({
                docId: doc.id,
                filename: doc.filename,
                matchCount: res.matches.length,
                matches: res.matches,
                snippet: res.snippet + "...",
                comparisons: res.comparisons,
                matchDensity
            });
        }
    });

    const endTime = process.hrtime.bigint();
    const executionTimeMs = Number(endTime - startTime) / 1000000.0;

    // Document Ranking: Sort by matchCount, then matchDensity
    results.sort((a, b) => {
        if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount;
        return b.matchDensity - a.matchDensity;
    });

    // 3. Optional Benchmark / Compare
    let comparisonStats = null;
    if (compare) {
        comparisonStats = [];
        const algorithmsToCompare = selection.alternatives.slice(0, 3).map(a => a.name);
        if (!algorithmsToCompare.includes(primaryAlgorithm)) algorithmsToCompare.unshift(primaryAlgorithm);

        algorithmsToCompare.forEach(algo => {
            let algoComps = 0;
            let algoMatches = 0;
            const sTime = process.hrtime.bigint();
            
            docs.forEach(doc => {
                const res = executeAlgorithm(doc, query, algo, maxDistance);
                algoComps += res.comparisons;
                if (res.isMatch) algoMatches += res.matches.length;
            });
            
            const eTime = process.hrtime.bigint();
            comparisonStats.push({
                algorithm: algo,
                timeMs: Number(eTime - sTime) / 1000000.0,
                comparisons: algoComps,
                matches: algoMatches
            });
        });
    }

    return {
        results,
        selection,
        stats: {
            algorithm: primaryAlgorithm,
            executionTimeMs,
            documentsSearched: docs.length,
            totalComparisons
        },
        comparisonStats
    };
}

module.exports = { searchDocuments };
