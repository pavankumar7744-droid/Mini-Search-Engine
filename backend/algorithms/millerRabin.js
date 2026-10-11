function power(base, exp, mod) {
    let res = 1n;
    base = base % mod;
    while (exp > 0n) {
        if (exp % 2n === 1n) res = (res * base) % mod;
        exp = exp / 2n;
        base = (base * base) % mod;
    }
    return res;
}

function millerRabin(d, n) {
    // Pick a random number in [2..n-2]
    // Since we can't easily do big randoms, we'll pick a small deterministic set of witnesses or a pseudo-random witness
    let a = 2n + BigInt(Math.floor(Math.random() * (Number(n) - 4))); 

    let x = power(a, d, n);

    if (x === 1n || x === n - 1n) return true;

    while (d !== n - 1n) {
        x = (x * x) % n;
        d *= 2n;

        if (x === 1n) return false;
        if (x === n - 1n) return true;
    }

    return false;
}

function isPrime(n, k) {
    if (typeof n !== 'bigint') n = BigInt(n);
    if (n <= 1n || n === 4n) return { result: false, iterations: 0 };
    if (n <= 3n) return { result: true, iterations: 0 };

    let d = n - 1n;
    while (d % 2n === 0n) {
        d /= 2n;
    }

    let iterations = 0;
    for (let i = 0; i < k; i++) {
        iterations++;
        if (!millerRabin(d, n)) {
            return { result: false, iterations };
        }
    }

    return { result: true, iterations };
}

module.exports = { isPrime };
