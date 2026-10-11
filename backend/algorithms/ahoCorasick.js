class AhoCorasick {
    constructor(patterns) {
        this.patterns = patterns;
        this.trie = [{ next: {}, fail: 0, output: [] }];
        this.buildTrie();
        this.buildFailureLinks();
    }

    buildTrie() {
        for (let i = 0; i < this.patterns.length; i++) {
            let word = this.patterns[i];
            let current = 0;
            for (let j = 0; j < word.length; j++) {
                let char = word[j];
                if (!this.trie[current].next[char]) {
                    this.trie.push({ next: {}, fail: 0, output: [] });
                    this.trie[current].next[char] = this.trie.length - 1;
                }
                current = this.trie[current].next[char];
            }
            this.trie[current].output.push(word);
        }
    }

    buildFailureLinks() {
        let queue = [];
        for (let char in this.trie[0].next) {
            let state = this.trie[0].next[char];
            this.trie[state].fail = 0;
            queue.push(state);
        }

        while (queue.length > 0) {
            let current = queue.shift();
            for (let char in this.trie[current].next) {
                let nextState = this.trie[current].next[char];
                queue.push(nextState);

                let failState = this.trie[current].fail;
                while (failState !== 0 && !this.trie[failState].next[char]) {
                    failState = this.trie[failState].fail;
                }

                this.trie[nextState].fail = this.trie[failState].next[char] || 0;
                this.trie[nextState].output = this.trie[nextState].output.concat(this.trie[this.trie[nextState].fail].output);
            }
        }
    }

    search(text) {
        let current = 0;
        let results = [];
        let comparisons = 0;

        for (let i = 0; i < text.length; i++) {
            let char = text[i];
            comparisons++;
            while (current !== 0 && !this.trie[current].next[char]) {
                current = this.trie[current].fail;
                comparisons++;
            }
            current = this.trie[current].next[char] || 0;
            
            if (this.trie[current].output.length > 0) {
                for (let word of this.trie[current].output) {
                    results.push({ word, index: i - word.length + 1 });
                }
            }
        }

        return { results, comparisons };
    }
}

module.exports = { AhoCorasick };
