// Input "shapes" shared by the seeded problems.
// Each shape knows how to turn a structured test case into stdin text, and how to read
// that stdin in C++, Java and JavaScript. The reading code doubles as the starter code
// users see, so variable names here are the ones solutions use.

const join = (a) => a.join(' ');

export const SHAPES = {
  // n, then n integers
  arr: {
    format: ({ arr }) => `${arr.length}\n${join(arr)}`,
    cpp: `int n;\n    cin >> n;\n    vector<long long> arr(n);\n    for (auto &x : arr) cin >> x;`,
    java: `int n = Integer.parseInt(next());\n        long[] arr = new long[n];\n        for (int i = 0; i < n; i++) arr[i] = Long.parseLong(next());`,
    js: `const n = Number(next());\nconst arr = [];\nfor (let i = 0; i < n; i++) arr.push(Number(next()));`,
  },
  // n, n integers, then k
  arrK: {
    format: ({ arr, k }) => `${arr.length}\n${join(arr)}\n${k}`,
    cpp: `int n;\n    cin >> n;\n    vector<long long> arr(n);\n    for (auto &x : arr) cin >> x;\n    long long k;\n    cin >> k;`,
    java: `int n = Integer.parseInt(next());\n        long[] arr = new long[n];\n        for (int i = 0; i < n; i++) arr[i] = Long.parseLong(next());\n        long k = Long.parseLong(next());`,
    js: `const n = Number(next());\nconst arr = [];\nfor (let i = 0; i < n; i++) arr.push(Number(next()));\nconst k = Number(next());`,
  },
  // two arrays: n, a..., m, b...
  twoArr: {
    format: ({ a, b }) => `${a.length}\n${join(a)}\n${b.length}\n${join(b)}`,
    cpp: `int n;\n    cin >> n;\n    vector<long long> a(n);\n    for (auto &x : a) cin >> x;\n    int m;\n    cin >> m;\n    vector<long long> b(m);\n    for (auto &x : b) cin >> x;`,
    java: `int n = Integer.parseInt(next());\n        long[] a = new long[n];\n        for (int i = 0; i < n; i++) a[i] = Long.parseLong(next());\n        int m = Integer.parseInt(next());\n        long[] b = new long[m];\n        for (int i = 0; i < m; i++) b[i] = Long.parseLong(next());`,
    js: `const n = Number(next());\nconst a = [];\nfor (let i = 0; i < n; i++) a.push(Number(next()));\nconst m = Number(next());\nconst b = [];\nfor (let i = 0; i < m; i++) b.push(Number(next()));`,
  },
  // a single integer
  int: {
    format: ({ n }) => `${n}`,
    cpp: `long long n;\n    cin >> n;`,
    java: `long n = Long.parseLong(next());`,
    js: `const n = Number(next());`,
  },
  // two integers
  twoInt: {
    format: ({ m, n }) => `${m} ${n}`,
    cpp: `long long m, n;\n    cin >> m >> n;`,
    java: `long m = Long.parseLong(next());\n        long n = Long.parseLong(next());`,
    js: `const m = Number(next());\nconst n = Number(next());`,
  },
  // one word (no spaces)
  str: {
    format: ({ s }) => s,
    cpp: `string s;\n    cin >> s;`,
    java: `String s = next();`,
    js: `const s = next();`,
  },
  // two words (no spaces), one per line
  twoStr: {
    format: ({ s, t }) => `${s}\n${t}`,
    cpp: `string s, t;\n    cin >> s >> t;`,
    java: `String s = next();\n        String t = next();`,
    js: `const s = next();\nconst t = next();`,
  },
  // one full line of text (may contain spaces)
  line: {
    format: ({ s }) => s,
    cpp: `string s;\n    getline(cin, s);\n    if (!s.empty() && s.back() == '\\r') s.pop_back();`,
    java: `String s = new String(input).split("\\\\r?\\\\n", -1)[0];`,
    js: `const s = data.split(/\\r?\\n/)[0];`,
  },
  // r c, then r rows of c integers
  matrix: {
    format: ({ grid }) => `${grid.length} ${grid[0].length}\n${grid.map(join).join('\n')}`,
    cpp: `int r, c;\n    cin >> r >> c;\n    vector<vector<long long>> grid(r, vector<long long>(c));\n    for (auto &row : grid) for (auto &x : row) cin >> x;`,
    java: `int r = Integer.parseInt(next());\n        int c = Integer.parseInt(next());\n        long[][] grid = new long[r][c];\n        for (int i = 0; i < r; i++) for (int j = 0; j < c; j++) grid[i][j] = Long.parseLong(next());`,
    js: `const r = Number(next());\nconst c = Number(next());\nconst grid = [];\nfor (let i = 0; i < r; i++) {\n  const row = [];\n  for (let j = 0; j < c; j++) row.push(Number(next()));\n  grid.push(row);\n}`,
  },
  // r c, then r strings of length c
  charGrid: {
    format: ({ rows }) => `${rows.length} ${rows[0].length}\n${rows.join('\n')}`,
    cpp: `int r, c;\n    cin >> r >> c;\n    vector<string> g(r);\n    for (auto &row : g) cin >> row;`,
    java: `int r = Integer.parseInt(next());\n        int c = Integer.parseInt(next());\n        char[][] g = new char[r][];\n        for (int i = 0; i < r; i++) g[i] = next().toCharArray();`,
    js: `const r = Number(next());\nconst c = Number(next());\nconst g = [];\nfor (let i = 0; i < r; i++) g.push(next().split(''));`,
  },
  // n m, then m pairs "u v"
  graph: {
    format: ({ n, edges }) => `${n} ${edges.length}${edges.length ? '\n' : ''}${edges.map(join).join('\n')}`,
    cpp: `int n, m;\n    cin >> n >> m;\n    vector<pair<int, int>> edges(m);\n    for (auto &e : edges) cin >> e.first >> e.second;`,
    java: `int n = Integer.parseInt(next());\n        int m = Integer.parseInt(next());\n        int[][] edges = new int[m][2];\n        for (int i = 0; i < m; i++) { edges[i][0] = Integer.parseInt(next()); edges[i][1] = Integer.parseInt(next()); }`,
    js: `const n = Number(next());\nconst m = Number(next());\nconst edges = [];\nfor (let i = 0; i < m; i++) edges.push([Number(next()), Number(next())]);`,
  },
  // n, then n pairs "start end"
  pairs: {
    format: ({ pairs }) => `${pairs.length}\n${pairs.map(join).join('\n')}`,
    cpp: `int n;\n    cin >> n;\n    vector<pair<long long, long long>> pairs(n);\n    for (auto &p : pairs) cin >> p.first >> p.second;`,
    java: `int n = Integer.parseInt(next());\n        long[][] pairs = new long[n][2];\n        for (int i = 0; i < n; i++) { pairs[i][0] = Long.parseLong(next()); pairs[i][1] = Long.parseLong(next()); }`,
    js: `const n = Number(next());\nconst pairs = [];\nfor (let i = 0; i < n; i++) pairs.push([Number(next()), Number(next())]);`,
  },
};

/* ================= PROGRAM ASSEMBLY ================= */

const CPP_HEAD = `#include <iostream>
#include <iomanip>
#include <vector>
#include <string>
#include <algorithm>
#include <numeric>
#include <map>
#include <set>
#include <unordered_map>
#include <unordered_set>
#include <queue>
#include <stack>
#include <deque>
#include <climits>
#include <functional>
using namespace std;
`;

const indent = (code, spaces) =>
  code
    .split('\n')
    .map((l) => (l.trim() ? ' '.repeat(spaces) + l : l))
    .join('\n');

const JAVA_READER = `    // Reads whitespace-separated tokens from stdin
    static byte[] input;
    static int ptr = 0;
    static String next() {
        while (ptr < input.length && input[ptr] <= ' ') ptr++;
        int start = ptr;
        while (ptr < input.length && input[ptr] > ' ') ptr++;
        return new String(input, start, ptr - start);
    }
`;

export const buildCpp = (shape, { helpers = '', body } = {}) =>
  `${CPP_HEAD}${helpers ? `\n${helpers.trim()}\n` : ''}
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    ${SHAPES[shape].cpp}

${body ? indent(body.trim(), 4) : '    // Write your code here and print the answer'}

    return 0;
}
`;

export const buildJava = (shape, { helpers = '', body } = {}) =>
  `import java.util.*;
import java.io.*;

public class Main {
${JAVA_READER}${helpers ? `\n${indent(helpers.trim(), 4)}\n` : ''}
    public static void main(String[] args) throws IOException {
        input = System.in.readAllBytes();
        ${SHAPES[shape].java}

${body ? indent(body.trim(), 8) : '        // Write your code here and print the answer'}
    }
}
`;

export const buildJs = (shape, { helpers = '', body } = {}) =>
  `const data = require('fs').readFileSync(0, 'utf8');
const tokens = data.split(/\\s+/).filter(Boolean);
let pos = 0;
const next = () => tokens[pos++];
${helpers ? `\n${helpers.trim()}\n` : ''}
${SHAPES[shape].js}

${body ? body.trim() : '// Write your code here and print the answer with console.log'}
`;
