# TextHack - Mini Search Engine

TextHack is a fully functional Mini Search Engine web application demonstrating various advanced string, graph, and randomised algorithms.

## Features
- **Document Management**: Upload `.txt` and `.pdf` files. Extracts text and indexes them. Documents are persistently stored across restarts.
- **Search Engine**: Search across indexed documents using algorithms taught in Advanced Algorithms.
- **Algorithm Playground**: Demonstrates Max Flow (Dinic), Vertex Cover (2-Approximation), and Miller-Rabin Primality Testing.
- **Engine Statistics**: Provides analysis on algorithmic usage and execution metrics.

## Algorithms Implemented
1. **Knuth-Morris-Pratt (KMP)**
   - **Purpose**: Linear-time pattern matching.
   - **Time Complexity**: O(n + m)
   - **Space Complexity**: O(m)
   - **Used**: Default Pattern Search

2. **Z Algorithm**
   - **Purpose**: Linear-time pattern matching using Z-array.
   - **Time Complexity**: O(n + m)
   - **Space Complexity**: O(n + m)
   - **Used**: Pattern Search Option

3. **Rabin-Karp**
   - **Purpose**: Pattern matching using rolling hash.
   - **Time Complexity**: O(n + m) average, O(nm) worst
   - **Space Complexity**: O(1)
   - **Used**: Pattern Search Option

4. **Aho-Corasick**
   - **Purpose**: Multi-pattern matching using Automaton/Trie.
   - **Time Complexity**: O(n + m + z)
   - **Space Complexity**: O(m * |Alphabet|)
   - **Used**: Pattern Search Option (Comma-separated queries)

5. **Suffix Array & Kasai's LCP**
   - **Purpose**: Fast indexing and substring matching.
   - **Time Complexity**: Construction O(n log^2 n), Kasai O(n)
   - **Space Complexity**: O(n)
   - **Used**: Internally available for similarity

6. **Levenshtein Distance**
   - **Purpose**: Edit distance (Wagner-Fischer).
   - **Time Complexity**: O(nm)
   - **Space Complexity**: O(nm)
   - **Used**: Fuzzy Search

7. **Damerau-Levenshtein**
   - **Purpose**: Edit distance with transpositions.
   - **Time Complexity**: O(nm)
   - **Space Complexity**: O(nm)
   - **Used**: Advanced Fuzzy Search

8. **Smith-Waterman**
   - **Purpose**: Local sequence alignment.
   - **Time Complexity**: O(nm)
   - **Space Complexity**: O(nm)
   - **Used**: Document similarity logic

9. **Dinic's Algorithm**
   - **Purpose**: Maximum Flow in network.
   - **Time Complexity**: O(V^2 E)
   - **Space Complexity**: O(V + E)
   - **Used**: Algorithm Playground (Bipartite Matching demo)

10. **Vertex Cover 2-Approximation**
    - **Purpose**: Approximates NP-Hard Vertex Cover using maximal matching.
    - **Time Complexity**: O(E)
    - **Space Complexity**: O(V)
    - **Used**: Algorithm Playground

11. **Miller-Rabin Primality Test**
    - **Purpose**: Probabilistic test for primality.
    - **Time Complexity**: O(k log^3 n)
    - **Space Complexity**: O(1)
    - **Used**: Algorithm Playground

12. **Reservoir Sampling**
    - **Purpose**: Random sampling over a stream.
    - **Time Complexity**: O(n)
    - **Space Complexity**: O(k)
    - **Used**: Internal Sampling Endpoint

## Architecture
- **Frontend**: React (Vite) + Vanilla CSS. Provides the dark, technical dashboard interface.
- **Backend**: Node.js + Express. Exposes REST APIs.
- **Indexing/Storage**: Custom lightweight local JSON storage (`backend/data/db.json`), persists uploads.
- **Algorithms**: Implemented manually in plain Javascript without utilizing specialized built-in structures (e.g. `java.util` equivalents).

## Running the Project

**1. Backend**
\`\`\`bash
cd backend
npm install
node server.js
\`\`\`
*(Runs on http://localhost:3000)*

**2. Frontend**
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
*(Runs typically on http://localhost:5173)*

## Academic Mapping
- Pattern Search → KMP / Z / Rabin-Karp
- Fuzzy Matching → Levenshtein / Damerau-Levenshtein
- Similarity → Suffix Array / LCP / Sequence Alignment
- Flow → Dinic
- Approximation → Vertex Cover 2-Approximation
- Randomised → Miller-Rabin / Randomised Hashing / Reservoir Sampling
