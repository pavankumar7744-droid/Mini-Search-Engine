class Edge {
    constructor(v, flow, C, rev) {
        this.v = v;
        this.flow = flow;
        this.C = C;
        this.rev = rev;
    }
}

class Graph {
    constructor(V) {
        this.V = V;
        this.adj = Array(V).fill(null).map(() => []);
        this.level = Array(V).fill(0);
    }

    addEdge(u, v, C) {
        let a = new Edge(v, 0, C, this.adj[v].length);
        let b = new Edge(u, 0, 0, this.adj[u].length);
        this.adj[u].push(a);
        this.adj[v].push(b);
    }

    BFS(s, t) {
        for (let i = 0; i < this.V; i++) this.level[i] = -1;
        this.level[s] = 0;
        let q = [];
        q.push(s);
        while (q.length > 0) {
            let u = q.shift();
            for (let i = 0; i < this.adj[u].length; i++) {
                let e = this.adj[u][i];
                if (this.level[e.v] < 0 && e.flow < e.C) {
                    this.level[e.v] = this.level[u] + 1;
                    q.push(e.v);
                }
            }
        }
        return this.level[t] >= 0;
    }

    sendFlow(u, flow, t, start) {
        if (u === t) return flow;
        for (; start[u] < this.adj[u].length; start[u]++) {
            let e = this.adj[u][start[u]];
            if (this.level[e.v] === this.level[u] + 1 && e.flow < e.C) {
                let curr_flow = Math.min(flow, e.C - e.flow);
                let temp_flow = this.sendFlow(e.v, curr_flow, t, start);
                if (temp_flow > 0) {
                    e.flow += temp_flow;
                    this.adj[e.v][e.rev].flow -= temp_flow;
                    return temp_flow;
                }
            }
        }
        return 0;
    }

    dinicMaxflow(s, t) {
        if (s === t) return -1;
        let total = 0;
        let iterations = 0;
        while (this.BFS(s, t)) {
            iterations++;
            let start = Array(this.V).fill(0);
            while (true) {
                let flow = this.sendFlow(s, Number.MAX_VALUE, t, start);
                if (flow === 0) break;
                total += flow;
            }
        }
        return { maxFlow: total, iterations };
    }
}

module.exports = { Graph };
