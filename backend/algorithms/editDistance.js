function levenshteinDistance(s1, s2) {
    const m = s1.length;
    const n = s2.length;
    
    // Create a 2D array dp of size (m+1) x (n+1)
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    let comparisons = 0;

    for (let i = 0; i <= m; i++) {
        for (let j = 0; j <= n; j++) {
            comparisons++;
            if (i === 0) {
                dp[i][j] = j; 
            } else if (j === 0) {
                dp[i][j] = i; 
            } else if (s1[i - 1] === s2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(
                    dp[i][j - 1],    // Insert
                    dp[i - 1][j],    // Remove
                    dp[i - 1][j - 1] // Replace
                );
            }
        }
    }

    return { distance: dp[m][n], comparisons };
}

module.exports = { levenshteinDistance };
