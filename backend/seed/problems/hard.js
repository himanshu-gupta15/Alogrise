// Hard problems. Each solution body runs after the shape's input code (see shapes.js).
// `brute` is an independent naive JS answer used by build.js to cross-check the solutions.

const small = (limit) => (c) => (c.arr || c.s || []).length <= limit;

export const HARD = [
  {
    title: 'Trapping Rain Water',
    difficulty: 'hard',
    tags: ['array', 'two pointers', 'monotonic stack'],
    companies: ['Google', 'Amazon', 'Goldman Sachs'],
    shape: 'arr',
    description: `The array gives the heights of bars of width 1. Print how many units of rain water are trapped between the bars after it rains.

Input format:
- Line 1: n
- Line 2: n non-negative heights

Output format:
- Units of trapped water

Constraints:
- 1 ≤ n ≤ 2 × 10⁴
- 0 ≤ height ≤ 10⁵`,
    visible: [
      { arr: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1], expect: '6', explanation: 'Water collects in the dips between the taller bars: 1 + 1 + 2 + 1 + 1 = 6.' },
      { arr: [4, 2, 0, 3, 2, 5], expect: '9', explanation: 'Everything between the 4 and the 5 fills up to height 4.' },
    ],
    hidden: [{ arr: [5] }, { arr: [1, 2, 3] }, { arr: [3, 0, 3] }, { arr: [5, 4, 1, 2] }],
    generate: (r) => [{ arr: r.array(200, 0, 20) }, { arr: r.array(10000, 0, 100000) }, { arr: [...r.array(5000, 0, 10), 50000, ...r.array(5000, 0, 10), 40000] }],
    brute: ({ arr }) => {
      let total = 0;
      for (let i = 0; i < arr.length; i++) {
        const left = Math.max(...arr.slice(0, i + 1));
        const right = Math.max(...arr.slice(i));
        total += Math.min(left, right) - arr[i];
      }
      return total;
    },
    bruteLimit: small(600),
    solution: {
      cpp: {
        body: `int lo = 0, hi = n - 1;
long long leftMax = 0, rightMax = 0, water = 0;
while (lo < hi) {
    if (arr[lo] < arr[hi]) {
        leftMax = max(leftMax, arr[lo]);
        water += leftMax - arr[lo++];
    } else {
        rightMax = max(rightMax, arr[hi]);
        water += rightMax - arr[hi--];
    }
}
cout << water << "\\n";`,
      },
      java: {
        body: `int lo = 0, hi = n - 1;
long leftMax = 0, rightMax = 0, water = 0;
while (lo < hi) {
    if (arr[lo] < arr[hi]) {
        leftMax = Math.max(leftMax, arr[lo]);
        water += leftMax - arr[lo++];
    } else {
        rightMax = Math.max(rightMax, arr[hi]);
        water += rightMax - arr[hi--];
    }
}
System.out.println(water);`,
      },
      js: {
        body: `let lo = 0;
let hi = n - 1;
let leftMax = 0;
let rightMax = 0;
let water = 0;
while (lo < hi) {
  if (arr[lo] < arr[hi]) {
    leftMax = Math.max(leftMax, arr[lo]);
    water += leftMax - arr[lo++];
  } else {
    rightMax = Math.max(rightMax, arr[hi]);
    water += rightMax - arr[hi--];
  }
}
console.log(water);`,
      },
    },
  },

  {
    title: 'Median of Two Sorted Arrays',
    difficulty: 'hard',
    tags: ['array', 'binary search', 'divide and conquer'],
    companies: ['Google', 'Amazon', 'Apple'],
    shape: 'twoArr',
    description: `Two arrays are each sorted in non-decreasing order. Print the median of all their values combined, with exactly 5 digits after the decimal point. Aim for O(log(m + n)).

Input format:
- Line 1: n, then line 2: the n values of the first array (empty if n = 0)
- Line 3: m, then line 4: the m values of the second array (empty if m = 0)

Output format:
- The median, with 5 decimal places

Constraints:
- 0 ≤ n, m ≤ 10⁵ and n + m ≥ 1
- -10⁶ ≤ values ≤ 10⁶`,
    visible: [
      { a: [1, 3], b: [2], expect: '2.00000', explanation: 'Combined: 1 2 3, so the median is 2.' },
      { a: [1, 2], b: [3, 4], expect: '2.50000', explanation: 'Combined: 1 2 3 4, so the median is (2 + 3) / 2 = 2.5.' },
    ],
    hidden: [{ a: [], b: [1] }, { a: [2], b: [] }, { a: [0, 0], b: [0, 0] }, { a: [1, 2, 3], b: [100, 200] }, { a: [-5, -3], b: [-4] }],
    generate: (r) => {
      const sorted = (len) => r.array(len, -1e6, 1e6).sort((x, y) => x - y);
      return [
        { a: sorted(7), b: sorted(10) },
        { a: sorted(1), b: sorted(8000) },
        { a: sorted(5000), b: sorted(4999) },
        { a: [], b: sorted(4) },
      ];
    },
    brute: ({ a, b }) => {
      const all = [...a, ...b].sort((x, y) => x - y);
      const mid = all.length >> 1;
      return (all.length % 2 ? all[mid] : (all[mid - 1] + all[mid]) / 2).toFixed(5);
    },
    solution: {
      cpp: {
        body: `if (n > m) { swap(a, b); swap(n, m); }
int lo = 0, hi = n, half = (n + m + 1) / 2;
double median = 0;
while (lo <= hi) {
    int i = (lo + hi) / 2, j = half - i;
    long long aLeft = i == 0 ? LLONG_MIN : a[i - 1];
    long long aRight = i == n ? LLONG_MAX : a[i];
    long long bLeft = j == 0 ? LLONG_MIN : b[j - 1];
    long long bRight = j == m ? LLONG_MAX : b[j];
    if (aLeft <= bRight && bLeft <= aRight) {
        long long leftMax = max(aLeft, bLeft);
        if ((n + m) % 2) median = leftMax;
        else median = (leftMax + min(aRight, bRight)) / 2.0;
        break;
    }
    if (aLeft > bRight) hi = i - 1; else lo = i + 1;
}
cout << fixed << setprecision(5) << median << "\\n";`,
      },
      java: {
        body: `if (n > m) { long[] t = a; a = b; b = t; int tn = n; n = m; m = tn; }
int lo = 0, hi = n, half = (n + m + 1) / 2;
double median = 0;
while (lo <= hi) {
    int i = (lo + hi) / 2, j = half - i;
    long aLeft = i == 0 ? Long.MIN_VALUE : a[i - 1];
    long aRight = i == n ? Long.MAX_VALUE : a[i];
    long bLeft = j == 0 ? Long.MIN_VALUE : b[j - 1];
    long bRight = j == m ? Long.MAX_VALUE : b[j];
    if (aLeft <= bRight && bLeft <= aRight) {
        long leftMax = Math.max(aLeft, bLeft);
        if ((n + m) % 2 == 1) median = leftMax;
        else median = (leftMax + Math.min(aRight, bRight)) / 2.0;
        break;
    }
    if (aLeft > bRight) hi = i - 1; else lo = i + 1;
}
System.out.println(String.format(Locale.US, "%.5f", median));`,
      },
      js: {
        body: `let A = a;
let B = b;
if (A.length > B.length) [A, B] = [B, A];
const N = A.length;
const M = B.length;
const half = (N + M + 1) >> 1;
let lo = 0;
let hi = N;
let median = 0;
while (lo <= hi) {
  const i = (lo + hi) >> 1;
  const j = half - i;
  const aLeft = i === 0 ? -Infinity : A[i - 1];
  const aRight = i === N ? Infinity : A[i];
  const bLeft = j === 0 ? -Infinity : B[j - 1];
  const bRight = j === M ? Infinity : B[j];
  if (aLeft <= bRight && bLeft <= aRight) {
    const leftMax = Math.max(aLeft, bLeft);
    median = (N + M) % 2 ? leftMax : (leftMax + Math.min(aRight, bRight)) / 2;
    break;
  }
  if (aLeft > bRight) hi = i - 1; else lo = i + 1;
}
console.log(median.toFixed(5));`,
      },
    },
  },

  {
    title: 'Largest Rectangle in Histogram',
    difficulty: 'hard',
    tags: ['array', 'monotonic stack'],
    companies: ['Amazon', 'Microsoft', 'Google'],
    shape: 'arr',
    description: `The array gives the heights of histogram bars, each of width 1. Print the area of the largest rectangle that fits entirely inside the histogram.

Input format:
- Line 1: n
- Line 2: n non-negative heights

Output format:
- The largest area

Constraints:
- 1 ≤ n ≤ 10⁵
- 0 ≤ height ≤ 10⁴`,
    visible: [
      { arr: [2, 1, 5, 6, 2, 3], expect: '10', explanation: 'Bars 5 and 6 form a rectangle of height 5 and width 2.' },
      { arr: [2, 4], expect: '4', explanation: 'Either the single bar of height 4, or height 2 across both bars.' },
    ],
    hidden: [{ arr: [0] }, { arr: [7] }, { arr: [1, 1, 1, 1] }, { arr: [6, 2, 5, 4, 5, 1, 6] }],
    generate: (r) => [{ arr: r.array(300, 0, 50) }, { arr: r.array(10000, 0, 10000) }, { arr: Array.from({ length: 10000 }, (_, i) => i) }],
    brute: ({ arr }) => {
      let best = 0;
      for (let i = 0; i < arr.length; i++) {
        let low = Infinity;
        for (let j = i; j < arr.length; j++) {
          low = Math.min(low, arr[j]);
          best = Math.max(best, low * (j - i + 1));
        }
      }
      return best;
    },
    bruteLimit: small(600),
    solution: {
      cpp: {
        body: `vector<int> st;
long long best = 0;
for (int i = 0; i <= n; i++) {
    long long h = i == n ? 0 : arr[i];
    while (!st.empty() && arr[st.back()] >= h) {
        long long height = arr[st.back()];
        st.pop_back();
        int left = st.empty() ? -1 : st.back();
        best = max(best, height * (i - left - 1));
    }
    st.push_back(i);
}
cout << best << "\\n";`,
      },
      java: {
        body: `int[] st = new int[n + 1];
int top = 0;
long best = 0;
for (int i = 0; i <= n; i++) {
    long h = i == n ? 0 : arr[i];
    while (top > 0 && arr[st[top - 1]] >= h) {
        long height = arr[st[--top]];
        int left = top == 0 ? -1 : st[top - 1];
        best = Math.max(best, height * (i - left - 1));
    }
    st[top++] = i;
}
System.out.println(best);`,
      },
      js: {
        body: `const st = [];
let best = 0;
for (let i = 0; i <= n; i++) {
  const h = i === n ? 0 : arr[i];
  while (st.length && arr[st[st.length - 1]] >= h) {
    const height = arr[st.pop()];
    const left = st.length ? st[st.length - 1] : -1;
    best = Math.max(best, height * (i - left - 1));
  }
  st.push(i);
}
console.log(best);`,
      },
    },
  },

  {
    title: 'Sliding Window Maximum',
    difficulty: 'hard',
    tags: ['array', 'sliding window', 'deque'],
    companies: ['Amazon', 'Google', 'Citadel'],
    shape: 'arrK',
    description: `A window of size k slides from the left end of the array to the right end, one position at a time. Print the maximum value inside the window at every position.

Input format:
- Line 1: n
- Line 2: n integers
- Line 3: k

Output format:
- n − k + 1 maxima, space-separated

Constraints:
- 1 ≤ k ≤ n ≤ 10⁵
- -10⁴ ≤ values ≤ 10⁴`,
    visible: [
      { arr: [1, 3, -1, -3, 5, 3, 6, 7], k: 3, expect: '3 3 5 5 6 7', explanation: 'Windows: [1 3 -1] → 3, [3 -1 -3] → 3, [-1 -3 5] → 5, [-3 5 3] → 5, [5 3 6] → 6, [3 6 7] → 7.' },
      { arr: [1], k: 1, expect: '1', explanation: 'A single window holding a single value.' },
    ],
    hidden: [{ arr: [9, 8, 7, 6], k: 2 }, { arr: [1, 2, 3, 4], k: 4 }, { arr: [-7, -8, 7, 5, 7, 1, 6, 0], k: 4 }],
    generate: (r) => [{ arr: r.array(200, -50, 50), k: 7 }, { arr: r.array(10000, -10000, 10000), k: 1000 }, { arr: r.array(10000, -10000, 10000), k: 1 }],
    brute: ({ arr, k }) => {
      const out = [];
      for (let i = 0; i + k <= arr.length; i++) out.push(Math.max(...arr.slice(i, i + k)));
      return out.join(' ');
    },
    bruteLimit: (c) => c.arr.length * c.k <= 2e6,
    solution: {
      cpp: {
        body: `deque<int> dq;
vector<long long> out;
for (int i = 0; i < n; i++) {
    while (!dq.empty() && dq.front() <= i - k) dq.pop_front();
    while (!dq.empty() && arr[dq.back()] <= arr[i]) dq.pop_back();
    dq.push_back(i);
    if (i >= k - 1) out.push_back(arr[dq.front()]);
}
for (size_t i = 0; i < out.size(); i++) cout << out[i] << (i + 1 < out.size() ? " " : "\\n");`,
      },
      java: {
        body: `int[] dq = new int[n];
int head = 0, tail = 0;
StringBuilder sb = new StringBuilder();
for (int i = 0; i < n; i++) {
    while (head < tail && dq[head] <= i - k) head++;
    while (head < tail && arr[dq[tail - 1]] <= arr[i]) tail--;
    dq[tail++] = i;
    if (i >= k - 1) sb.append(arr[dq[head]]).append(' ');
}
System.out.println(sb.toString().trim());`,
      },
      js: {
        body: `const dq = new Array(n);
let head = 0;
let tail = 0;
const out = [];
for (let i = 0; i < n; i++) {
  while (head < tail && dq[head] <= i - k) head++;
  while (head < tail && arr[dq[tail - 1]] <= arr[i]) tail--;
  dq[tail++] = i;
  if (i >= k - 1) out.push(arr[dq[head]]);
}
console.log(out.join(' '));`,
      },
    },
  },

  {
    title: 'Longest Valid Parentheses',
    difficulty: 'hard',
    tags: ['string', 'stack', 'dynamic programming'],
    companies: ['Amazon', 'Microsoft'],
    shape: 'str',
    description: `The string contains only "(" and ")". Print the length of the longest contiguous substring that is a well-formed (balanced) parentheses sequence.

Input format:
- A single string of ( and )

Output format:
- The length

Constraints:
- 1 ≤ length ≤ 3 × 10⁴`,
    visible: [
      { s: '(()', expect: '2', explanation: 'The longest valid part is "()".' },
      { s: ')()())', expect: '4', explanation: 'The longest valid part is "()()".' },
    ],
    hidden: [{ s: '(' }, { s: ')' }, { s: '()' }, { s: '()(())' }, { s: '())((())' }],
    generate: (r) => [{ s: r.word(40, '()') }, { s: r.word(120, '(()') }, { s: r.word(10000, '()') }, { s: '('.repeat(5000) + ')'.repeat(5000) }],
    brute: ({ s }) => {
      let best = 0;
      for (let i = 0; i < s.length; i++) {
        let bal = 0;
        for (let j = i; j < s.length; j++) {
          bal += s[j] === '(' ? 1 : -1;
          if (bal < 0) break;
          if (bal === 0) best = Math.max(best, j - i + 1);
        }
      }
      return best;
    },
    bruteLimit: small(3000),
    solution: {
      cpp: {
        body: `vector<int> st = {-1};
int best = 0;
for (int i = 0; i < (int)s.size(); i++) {
    if (s[i] == '(') st.push_back(i);
    else {
        st.pop_back();
        if (st.empty()) st.push_back(i);
        else best = max(best, i - st.back());
    }
}
cout << best << "\\n";`,
      },
      java: {
        body: `ArrayDeque<Integer> st = new ArrayDeque<>();
st.push(-1);
int best = 0;
for (int i = 0; i < s.length(); i++) {
    if (s.charAt(i) == '(') st.push(i);
    else {
        st.pop();
        if (st.isEmpty()) st.push(i);
        else best = Math.max(best, i - st.peek());
    }
}
System.out.println(best);`,
      },
      js: {
        body: `const st = [-1];
let best = 0;
for (let i = 0; i < s.length; i++) {
  if (s[i] === '(') st.push(i);
  else {
    st.pop();
    if (!st.length) st.push(i);
    else best = Math.max(best, i - st[st.length - 1]);
  }
}
console.log(best);`,
      },
    },
  },

  {
    title: 'N-Queens II',
    difficulty: 'hard',
    tags: ['backtracking'],
    companies: ['Amazon', 'Microsoft'],
    shape: 'int',
    description: `Place n queens on an n × n chessboard so that no two queens attack each other (same row, column or diagonal). Print the number of distinct arrangements.

Input format:
- A single integer n

Output format:
- The number of arrangements

Constraints:
- 1 ≤ n ≤ 10`,
    visible: [
      { n: 4, expect: '2', explanation: 'There are exactly two ways to place 4 non-attacking queens on a 4 × 4 board.' },
      { n: 1, expect: '1', explanation: 'One queen on a 1 × 1 board.' },
    ],
    hidden: [{ n: 2 }, { n: 3 }, { n: 5 }, { n: 6 }, { n: 8 }, { n: 10 }],
    generate: (r) => [{ n: r.pick([7, 9]) }],
    brute: ({ n }) => [1, 0, 0, 2, 10, 4, 40, 92, 352, 724][n - 1],
    solution: {
      cpp: {
        helpers: `long long solveQueens(int row, int n, int cols, int d1, int d2) {
    if (row == n) return 1;
    long long total = 0;
    for (int c = 0; c < n; c++) {
        int a = 1 << c, b = 1 << (row + c), d = 1 << (row - c + n - 1);
        if ((cols & a) || (d1 & b) || (d2 & d)) continue;
        total += solveQueens(row + 1, n, cols | a, d1 | b, d2 | d);
    }
    return total;
}`,
        body: `cout << solveQueens(0, (int)n, 0, 0, 0) << "\\n";`,
      },
      java: {
        helpers: `static long solveQueens(int row, int n, int cols, int d1, int d2) {
    if (row == n) return 1;
    long total = 0;
    for (int c = 0; c < n; c++) {
        int a = 1 << c, b = 1 << (row + c), d = 1 << (row - c + n - 1);
        if ((cols & a) != 0 || (d1 & b) != 0 || (d2 & d) != 0) continue;
        total += solveQueens(row + 1, n, cols | a, d1 | b, d2 | d);
    }
    return total;
}`,
        body: `System.out.println(solveQueens(0, (int) n, 0, 0, 0));`,
      },
      js: {
        helpers: `function solveQueens(row, n, cols, d1, d2) {
  if (row === n) return 1;
  let total = 0;
  for (let c = 0; c < n; c++) {
    const a = 1 << c;
    const b = 1 << (row + c);
    const d = 1 << (row - c + n - 1);
    if (cols & a || d1 & b || d2 & d) continue;
    total += solveQueens(row + 1, n, cols | a, d1 | b, d2 | d);
  }
  return total;
}`,
        body: `console.log(solveQueens(0, n, 0, 0, 0));`,
      },
    },
  },

  {
    title: 'First Missing Positive',
    difficulty: 'hard',
    tags: ['array', 'hash set'],
    companies: ['Amazon', 'Microsoft', 'Uber'],
    shape: 'arr',
    description: `Print the smallest positive integer that does not appear in the array. Aim for O(n) time and O(1) extra space.

Input format:
- Line 1: n
- Line 2: n integers

Output format:
- The smallest missing positive integer

Constraints:
- 1 ≤ n ≤ 10⁵
- -2³¹ ≤ values ≤ 2³¹ − 1`,
    visible: [
      { arr: [1, 2, 0], expect: '3', explanation: '1 and 2 are present, so 3 is the first gap.' },
      { arr: [3, 4, -1, 1], expect: '2', explanation: '1 is present but 2 is not.' },
      { arr: [7, 8, 9, 11, 12], expect: '1', explanation: '1 itself is missing.' },
    ],
    hidden: [{ arr: [1] }, { arr: [2] }, { arr: [-1, -2] }, { arr: [1, 1, 2, 2] }, { arr: [2147483647, 1] }],
    generate: (r) => [
      { arr: r.array(200, -20, 60) },
      { arr: r.shuffle([...Array.from({ length: 8000 }, (_, i) => i + 1), ...r.array(1000, -1000, 0)]) },
      { arr: r.shuffle(Array.from({ length: 10000 }, (_, i) => (i === 4567 ? -5 : i + 1))) },
    ],
    brute: ({ arr }) => {
      const set = new Set(arr);
      let k = 1;
      while (set.has(k)) k++;
      return k;
    },
    solution: {
      cpp: {
        body: `for (int i = 0; i < n; i++)
    while (arr[i] >= 1 && arr[i] <= n && arr[arr[i] - 1] != arr[i]) swap(arr[i], arr[arr[i] - 1]);
long long ans = n + 1;
for (int i = 0; i < n; i++) if (arr[i] != i + 1) { ans = i + 1; break; }
cout << ans << "\\n";`,
      },
      java: {
        body: `for (int i = 0; i < n; i++)
    while (arr[i] >= 1 && arr[i] <= n && arr[(int) arr[i] - 1] != arr[i]) {
        int j = (int) arr[i] - 1;
        long t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
long ans = n + 1;
for (int i = 0; i < n; i++) if (arr[i] != i + 1) { ans = i + 1; break; }
System.out.println(ans);`,
      },
      js: {
        body: `for (let i = 0; i < n; i++)
  while (arr[i] >= 1 && arr[i] <= n && arr[arr[i] - 1] !== arr[i]) {
    const j = arr[i] - 1;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
let ans = n + 1;
for (let i = 0; i < n; i++) if (arr[i] !== i + 1) { ans = i + 1; break; }
console.log(ans);`,
      },
    },
  },

  {
    title: 'Burst Balloons',
    difficulty: 'hard',
    tags: ['dynamic programming', 'interval dp'],
    companies: ['Google', 'Snapchat'],
    shape: 'arr',
    description: `Balloons in a row carry numbers. Bursting balloon i earns left × nums[i] × right, where left and right are its current neighbours (a missing neighbour counts as 1). After a burst, its neighbours become adjacent. Print the most coins you can collect by bursting all balloons.

Input format:
- Line 1: n
- Line 2: n integers

Output format:
- The maximum number of coins

Constraints:
- 1 ≤ n ≤ 300
- 0 ≤ nums[i] ≤ 100`,
    visible: [
      { arr: [3, 1, 5, 8], expect: '167', explanation: 'Burst 1, 5, 3, 8 in that order: 3·1·5 + 3·5·8 + 1·3·8 + 1·8·1 = 167.' },
      { arr: [1, 5], expect: '10', explanation: 'Burst 1 (1·1·5 = 5), then 5 (1·5·1 = 5).' },
    ],
    hidden: [{ arr: [7] }, { arr: [0, 0] }, { arr: [9, 76, 64, 21] }],
    generate: (r) => [{ arr: r.array(6, 0, 10) }, { arr: r.array(8, 0, 100) }, { arr: r.array(120, 0, 100) }, { arr: r.array(300, 0, 100) }],
    brute: ({ arr }) => {
      // Try every burst order over the remaining balloons (memoised on the remaining set)
      const memo = new Map();
      const go = (list) => {
        if (!list.length) return 0;
        const key = list.join(',');
        if (memo.has(key)) return memo.get(key);
        let best = 0;
        for (let i = 0; i < list.length; i++) {
          const gain = (i > 0 ? list[i - 1] : 1) * list[i] * (i + 1 < list.length ? list[i + 1] : 1);
          best = Math.max(best, gain + go([...list.slice(0, i), ...list.slice(i + 1)]));
        }
        memo.set(key, best);
        return best;
      };
      return go(arr);
    },
    bruteLimit: small(9),
    solution: {
      cpp: {
        body: `vector<long long> v(n + 2, 1);
for (int i = 0; i < n; i++) v[i + 1] = arr[i];
int len = n + 2;
vector<vector<long long>> dp(len, vector<long long>(len, 0));
for (int gap = 2; gap < len; gap++)
    for (int left = 0; left + gap < len; left++) {
        int right = left + gap;
        for (int i = left + 1; i < right; i++)
            dp[left][right] = max(dp[left][right], dp[left][i] + dp[i][right] + v[left] * v[i] * v[right]);
    }
cout << dp[0][len - 1] << "\\n";`,
      },
      java: {
        body: `long[] v = new long[n + 2];
v[0] = 1;
v[n + 1] = 1;
for (int i = 0; i < n; i++) v[i + 1] = arr[i];
int len = n + 2;
long[][] dp = new long[len][len];
for (int gap = 2; gap < len; gap++)
    for (int left = 0; left + gap < len; left++) {
        int right = left + gap;
        for (int i = left + 1; i < right; i++)
            dp[left][right] = Math.max(dp[left][right], dp[left][i] + dp[i][right] + v[left] * v[i] * v[right]);
    }
System.out.println(dp[0][len - 1]);`,
      },
      js: {
        body: `const v = [1, ...arr, 1];
const len = n + 2;
const dp = Array.from({ length: len }, () => new Array(len).fill(0));
for (let gap = 2; gap < len; gap++)
  for (let left = 0; left + gap < len; left++) {
    const right = left + gap;
    for (let i = left + 1; i < right; i++) dp[left][right] = Math.max(dp[left][right], dp[left][i] + dp[i][right] + v[left] * v[i] * v[right]);
  }
console.log(dp[0][len - 1]);`,
      },
    },
  },
];
