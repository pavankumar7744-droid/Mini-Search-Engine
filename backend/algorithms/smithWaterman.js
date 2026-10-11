function smithWaterman(s1, s2) {
    const m = s1.length;
    const n = s2.length;
    const matchScore = 2;
    const mismatchPenalty = -1;
    const gapPenalty = -1;

    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    let maxScore = 0;
    let comparisons = 0;

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            comparisons++;
            let scoreDiag = dp[i - 1][j - 1] + (s1[i - 1] === s2[j - 1] ? matchScore : mismatchPenalty);
            let scoreUp = dp[i - 1][j] + gapPenalty;
            let scoreLeft = dp[i][j - 1] + gapPenalty;

            dp[i][j] = Math.max(0, scoreDiag, scoreUp, scoreLeft);
            
            if (dp[i][j] > maxScore) {
                maxScore = dp[i][j];
            }
        }
    }
    return { score: maxScore, comparisons };
}

module.exports = { smithWaterman };
