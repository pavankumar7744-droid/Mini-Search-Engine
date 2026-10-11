function determineQueryType(query, mode) {
    if (mode === 'fuzzy') return 'Approximate';
    if (mode === 'similarity') return 'Similarity';
    if (query.includes(',')) return 'Multi-pattern';
    return 'Exact single-pattern';
}

function selectAlgorithms(query, mode, documents) {
    const queryType = determineQueryType(query, mode);
    
    let selection = {};

    if (queryType === 'Exact single-pattern') {
        selection = {
            queryType,
            selected: 'KMP',
            reason: 'Single exact pattern search. KMP provides O(n+m) worst-case time complexity.',
            alternatives: [
                { name: 'KMP', score: 95, reason: 'Optimal for single exact pattern.' },
                { name: 'ZAlgorithm', score: 90, reason: 'Suitable for exact matching.' },
                { name: 'RabinKarp', score: 85, reason: 'Suitable, but has potential hash collisions.' },
                { name: 'AhoCorasick', score: 30, reason: 'Overhead is too high for a single pattern.' },
                { name: 'Fuzzy-Levenshtein', score: 10, reason: 'Query is not fuzzy.' }
            ]
        };
    } else if (queryType === 'Multi-pattern') {
        selection = {
            queryType,
            selected: 'AhoCorasick',
            reason: 'Multiple patterns detected. Aho-Corasick searches all patterns simultaneously in O(n + m + z).',
            alternatives: [
                { name: 'AhoCorasick', score: 98, reason: 'Designed for multi-pattern search.' },
                { name: 'KMP', score: 40, reason: 'Would require separate passes for each pattern.' },
                { name: 'RabinKarp', score: 35, reason: 'Would require separate passes.' }
            ]
        };
    } else if (queryType === 'Approximate') {
        selection = {
            queryType,
            selected: 'Fuzzy-Levenshtein',
            reason: 'Approximate/fuzzy query requested. Levenshtein computes minimum edit distance.',
            alternatives: [
                { name: 'Fuzzy-Levenshtein', score: 95, reason: 'Standard edit distance matching.' },
                { name: 'DamerauLevenshtein', score: 90, reason: 'Good if transpositions are expected.' },
                { name: 'KMP', score: 5, reason: 'Cannot handle fuzzy matching.' }
            ]
        };
    } else if (queryType === 'Similarity') {
        selection = {
            queryType,
            selected: 'SmithWaterman',
            reason: 'Document comparison requested. Smith-Waterman is ideal for local sequence alignment.',
            alternatives: [
                { name: 'SmithWaterman', score: 95, reason: 'Finds optimal local alignments.' },
                { name: 'SuffixArray', score: 85, reason: 'Useful for finding longest common substrings.' }
            ]
        };
    }

    // Sort alternatives by score descending
    selection.alternatives.sort((a, b) => b.score - a.score);

    return selection;
}

module.exports = { selectAlgorithms, determineQueryType };
