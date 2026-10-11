function reservoirSampling(stream, k) {
    let reservoir = [];
    for (let i = 0; i < k && i < stream.length; i++) {
        reservoir.push(stream[i]);
    }

    for (let i = k; i < stream.length; i++) {
        let j = Math.floor(Math.random() * (i + 1));
        if (j < k) {
            reservoir[j] = stream[i];
        }
    }

    return reservoir;
}

module.exports = { reservoirSampling };
