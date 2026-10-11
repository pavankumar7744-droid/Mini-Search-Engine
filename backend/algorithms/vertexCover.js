function vertexCover2Approx(edges) {
    // edges is an array of [u, v]
    let covered = new Set();
    let matching = [];

    // Simple maximal matching approach
    for (let i = 0; i < edges.length; i++) {
        let u = edges[i][0];
        let v = edges[i][1];

        if (!covered.has(u) && !covered.has(v)) {
            covered.add(u);
            covered.add(v);
            matching.push([u, v]);
        }
    }

    return { 
        cover: Array.from(covered),
        matchingUsed: matching,
        size: covered.size
    };
}

module.exports = { vertexCover2Approx };
