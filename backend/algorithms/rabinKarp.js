function rabinKarpSearch(text, pattern) {
    if (!pattern || pattern.length === 0) return { matches: [], comparisons: 0 };
    
    const matches = [];
    const d = 256;
    const q = 101; // A prime number
    let p = 0; // hash value for pattern
    let t = 0; // hash value for text
    let h = 1;
    let comparisons = 0;
    
    const m = pattern.length;
    const n = text.length;

    if (m > n) return { matches, comparisons };

    // The value of h would be "pow(d, M-1)%q"
    for (let i = 0; i < m - 1; i++) {
        h = (h * d) % q;
    }

    // Calculate the hash value of pattern and first window of text
    for (let i = 0; i < m; i++) {
        p = (d * p + pattern.charCodeAt(i)) % q;
        t = (d * t + text.charCodeAt(i)) % q;
    }

    // Slide the pattern over text one by one
    for (let i = 0; i <= n - m; i++) {
        // Check the hash values of current window of text and pattern.
        // If the hash values match then only check for characters continuously
        if (p === t) {
            let j = 0;
            for (j = 0; j < m; j++) {
                comparisons++;
                if (text[i + j] !== pattern[j]) {
                    break;
                }
            }
            if (j === m) {
                matches.push(i);
            }
        }
        
        // Calculate hash value for next window of text
        if (i < n - m) {
            t = (d * (t - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % q;
            // We might get negative value of t, converting it to positive
            if (t < 0) {
                t = (t + q);
            }
        }
    }

    return { matches, comparisons };
}

module.exports = { rabinKarpSearch };
