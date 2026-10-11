function computeZArray(str) {
    const n = str.length;
    const z = new Array(n).fill(0);
    let L = 0, R = 0;
    
    for (let i = 1; i < n; i++) {
        if (i > R) {
            L = R = i;
            while (R < n && str[R - L] === str[R]) {
                R++;
            }
            z[i] = R - L;
            R--;
        } else {
            let k = i - L;
            if (z[k] < R - i + 1) {
                z[i] = z[k];
            } else {
                L = i;
                while (R < n && str[R - L] === str[R]) {
                    R++;
                }
                z[i] = R - L;
                R--;
            }
        }
    }
    return z;
}

function zAlgorithmSearch(text, pattern) {
    if (!pattern || pattern.length === 0) return { matches: [], comparisons: 0 };
    
    const concat = pattern + "$" + text;
    const z = computeZArray(concat);
    const matches = [];
    let comparisons = concat.length; // Approximate comparisons made in building Z array

    const patternLen = pattern.length;
    for (let i = 0; i < z.length; i++) {
        if (z[i] === patternLen) {
            matches.push(i - patternLen - 1);
        }
    }

    return { matches, comparisons };
}

module.exports = { zAlgorithmSearch };
