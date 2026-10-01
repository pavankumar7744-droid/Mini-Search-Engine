class SearchEngine {
    constructor() {
        this.documents = new Map(); // id -> { name, termFreq, totalWords }
        this.invertedIndex = new Map(); // term -> Set of docIds
    }

    tokenize(text) {
        if (!text) return [];
        // Lowercase and match only words (alphanumeric)
        return text.toLowerCase().match(/\b[a-z0-9]+\b/g) || [];
    }

    addDocument(id, name, content) {
        const tokens = this.tokenize(content);
        const termFreq = new Map();
        
        for (const token of tokens) {
            termFreq.set(token, (termFreq.get(token) || 0) + 1);
        }

        const lines = content.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

        this.documents.set(id, {
            name: name,
            termFreq: termFreq,
            totalWords: tokens.length,
            lines: lines
        });

        for (const term of termFreq.keys()) {
            if (!this.invertedIndex.has(term)) {
                this.invertedIndex.set(term, new Set());
            }
            this.invertedIndex.get(term).add(id);
        }
    }

    removeDocument(id) {
        this.documents.delete(id);
        // We could clean up the inverted index, but for a simple session-based engine, 
        // it's fine to leave dangling docIds if we clear the whole session eventually.
        // Or properly remove:
        for (const [term, docIds] of this.invertedIndex.entries()) {
            docIds.delete(id);
            if (docIds.size === 0) {
                this.invertedIndex.delete(term);
            }
        }
    }

    clear() {
        this.documents.clear();
        this.invertedIndex.clear();
    }

    // Levenshtein distance for fuzzy matching
    levenshtein(a, b) {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;
        const matrix = [];
        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // substitution
                        Math.min(
                            matrix[i][j - 1] + 1, // insertion
                            matrix[i - 1][j] + 1  // deletion
                        )
                    );
                }
            }
        }
        return matrix[b.length][a.length];
    }

    // Find similar terms in index if exact term not found
    getFuzzyTerms(queryTerm, threshold = 2) {
        const terms = [];
        for (const term of this.invertedIndex.keys()) {
            if (Math.abs(term.length - queryTerm.length) <= threshold) {
                if (this.levenshtein(term, queryTerm) <= threshold) {
                    terms.push(term);
                }
            }
        }
        return terms;
    }

    search(query) {
        const queryTokens = this.tokenize(query);
        if (queryTokens.length === 0) return [];

        const totalDocs = this.documents.size;
        if (totalDocs === 0) return [];

        const docScores = new Map();
        const docMatchedTerms = new Map();

        for (let qTerm of queryTokens) {
            let termsToSearch = [qTerm];
            
            // Fuzzy matching: if exact term is not in index, find closest matches
            if (!this.invertedIndex.has(qTerm)) {
                const fuzzyTerms = this.getFuzzyTerms(qTerm, 2);
                if (fuzzyTerms.length > 0) {
                    termsToSearch = fuzzyTerms;
                }
            }

            for (const term of termsToSearch) {
                const docIds = this.invertedIndex.get(term);
                if (!docIds) continue; // Word not in any document

                const df = docIds.size; // Document frequency
                const idf = Math.log(totalDocs / df) + 1; // IDF + 1 to avoid 0

                for (const docId of docIds) {
                    const doc = this.documents.get(docId);
                    const tf = doc.termFreq.get(term) / doc.totalWords; // Term frequency
                    const tfidf = tf * idf;

                    docScores.set(docId, (docScores.get(docId) || 0) + tfidf);
                    
                    if (!docMatchedTerms.has(docId)) docMatchedTerms.set(docId, new Set());
                    docMatchedTerms.get(docId).add(term);
                }
            }
        }

        // Rank documents
        const results = [];
        for (const [docId, score] of docScores.entries()) {
            const doc = this.documents.get(docId);
            const matchedTerms = Array.from(docMatchedTerms.get(docId) || []);
            
            let snippet = "";
            let snippetLineNum = 0;
            if (matchedTerms.length > 0) {
                const regexStr = matchedTerms.map(t => '\\b' + t + '\\b').join('|');
                const regex = new RegExp(regexStr, 'i');
                for (let i = 0; i < doc.lines.length; i++) {
                    if (regex.test(doc.lines[i])) {
                        snippet = doc.lines[i];
                        snippetLineNum = i + 1;
                        break;
                    }
                }
            }

            // Truncate snippet
            if (snippet.length > 150) {
                const matchObj = new RegExp(matchedTerms.join('|'), 'i').exec(snippet);
                if (matchObj) {
                    const idx = matchObj.index;
                    const start = Math.max(0, idx - 60);
                    const end = Math.min(snippet.length, idx + 90);
                    snippet = (start > 0 ? "..." : "") + snippet.substring(start, end) + (end < snippet.length ? "..." : "");
                } else {
                    snippet = snippet.substring(0, 150) + "...";
                }
            }

            results.push({
                id: docId,
                name: doc.name,
                score: score.toFixed(4),
                snippet: snippet,
                lineNum: snippetLineNum,
                matchedTerms: matchedTerms
            });
        }

        return results.sort((a, b) => b.score - a.score);
    }
}

module.exports = SearchEngine;
