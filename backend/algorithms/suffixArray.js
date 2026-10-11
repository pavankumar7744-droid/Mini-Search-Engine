class SuffixNode {
    constructor(index, rank) {
        this.index = index;
        this.rank = rank;
    }
}

function buildSuffixArray(text) {
    const n = text.length;
    let suffixes = new Array(n);
    
    for (let i = 0; i < n; i++) {
        suffixes[i] = new SuffixNode(i, [text.charCodeAt(i), i + 1 < n ? text.charCodeAt(i + 1) : -1]);
    }

    suffixes.sort((a, b) => {
        if (a.rank[0] === b.rank[0]) {
            return a.rank[1] - b.rank[1];
        }
        return a.rank[0] - b.rank[0];
    });

    let ind = new Array(n);
    for (let k = 4; k < 2 * n; k = k * 2) {
        let rank = 0;
        let prev_rank = suffixes[0].rank[0];
        suffixes[0].rank[0] = rank;
        ind[suffixes[0].index] = 0;

        for (let i = 1; i < n; i++) {
            if (suffixes[i].rank[0] === prev_rank && suffixes[i].rank[1] === suffixes[i - 1].rank[1]) {
                prev_rank = suffixes[i].rank[0];
                suffixes[i].rank[0] = rank;
            } else {
                prev_rank = suffixes[i].rank[0];
                suffixes[i].rank[0] = ++rank;
            }
            ind[suffixes[i].index] = i;
        }

        for (let i = 0; i < n; i++) {
            let nextindex = suffixes[i].index + k / 2;
            suffixes[i].rank[1] = (nextindex < n) ? suffixes[ind[nextindex]].rank[0] : -1;
        }

        suffixes.sort((a, b) => {
            if (a.rank[0] === b.rank[0]) {
                return a.rank[1] - b.rank[1];
            }
            return a.rank[0] - b.rank[0];
        });
    }

    const suffixArr = new Array(n);
    for (let i = 0; i < n; i++) {
        suffixArr[i] = suffixes[i].index;
    }
    return suffixArr;
}

function kasai(text, suffixArr) {
    const n = suffixArr.length;
    const lcp = new Array(n).fill(0);
    const invSuff = new Array(n).fill(0);
    
    for (let i = 0; i < n; i++) {
        invSuff[suffixArr[i]] = i;
    }

    let k = 0;
    for (let i = 0; i < n; i++) {
        if (invSuff[i] === n - 1) {
            k = 0;
            continue;
        }
        
        let j = suffixArr[invSuff[i] + 1];
        while (i + k < n && j + k < n && text[i + k] === text[j + k]) {
            k++;
        }
        
        lcp[invSuff[i]] = k;
        if (k > 0) {
            k--;
        }
    }
    return lcp;
}

module.exports = { buildSuffixArray, kasai };
