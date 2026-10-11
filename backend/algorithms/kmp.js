function computeLPS(pattern) {
    const lps = new Array(pattern.length).fill(0);
    let length = 0;
    let i = 1;

    while (i < pattern.length) {
        if (pattern[i] === pattern[length]) {
            length++;
            lps[i] = length;
            i++;
        } else {
            if (length !== 0) {
                length = lps[length - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
    return lps;
}

function kmpSearch(text, pattern) {
    if (!pattern || pattern.length === 0) return { matches: [], comparisons: 0 };
    
    const lps = computeLPS(pattern);
    const matches = [];
    let i = 0; // index for text
    let j = 0; // index for pattern

    let comparisons = 0;

    while (i < text.length) {
        comparisons++;
        if (pattern[j] === text[i]) {
            j++;
            i++;
        }

        if (j === pattern.length) {
            matches.push(i - j);
            j = lps[j - 1];
        } else if (i < text.length && pattern[j] !== text[i]) {
            if (j !== 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }

    return { matches, comparisons };
}

module.exports = { kmpSearch };
