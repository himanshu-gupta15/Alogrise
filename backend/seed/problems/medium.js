// Medium problems. Each solution body runs after the shape's input code (see shapes.js).
// `brute` is an independent naive JS answer used by build.js to cross-check the solutions.

const yesNo = { cpp: '(ok ? "true" : "false")', java: '(ok ? "true" : "false")', js: "(ok ? 'true' : 'false')" };
const small = (limit) => (c) => (c.arr || c.s || c.grid || c.rows || []).length <= limit;

export const MEDIUM = [
  {
    title: 'Product of Array Except Self',
    difficulty: 'medium',
    tags: ['array', 'prefix sum'],
    companies: ['Amazon', 'Meta', 'Microsoft'],
    shape: 'arr',
    description: `For every position i, print the product of all elements except arr[i]. Solve it without using division.

Input format:
- Line 1: n
- Line 2: n integers

Output format:
- n products, space-separated

Constraints:
- 2 ≤ n ≤ 10⁵
- -30 ≤ values ≤ 30
- Every product fits in a 32-bit signed integer`,
    visible: [
      { arr: [1, 2, 3, 4], expect: '24 12 8 6', explanation: 'For index 0: 2 × 3 × 4 = 24; for index 1: 1 × 3 × 4 = 12, and so on.' },
      { arr: [-1, 1, 0, -3, 3], expect: '0 0 9 0 0', explanation: 'Only the position holding the 0 avoids multiplying by 0: (-1) × 1 × (-3) × 3 = 9.' },
    ],
    hidden: [{ arr: [2, 3] }, { arr: [0, 0, 5] }, { arr: [-2, -2, -2] }],
    generate: (r) => {
      const mk = (n) => {
        const arr = Array.from({ length: n }, () => r.pick([1, 1, 1, -1, 1, -1]));
        for (let i = 0; i < 20; i++) arr[r.int(0, n - 1)] = r.pick([2, -2, 3]);
        return arr;
      };
      return [{ arr: mk(200) }, { arr: mk(10000) }, { arr: [...mk(100), 0] }];
    },
    brute: ({ arr }) => arr.map((_, i) => arr.reduce((p, v, j) => (j === i ? p : p * v), 1)).map((v) => (Object.is(v, -0) ? 0 : v)).join(' '),
    bruteLimit: small(300),
    solution: {
      cpp: {
        body: `vector<long long> out(n, 1);
long long left = 1;
for (int i = 0; i < n; i++) { out[i] = left; left *= arr[i]; }
long long right = 1;
for (int i = n - 1; i >= 0; i--) { out[i] *= right; right *= arr[i]; }
for (int i = 0; i < n; i++) cout << out[i] << (i + 1 < n ? " " : "\\n");`,
      },
      java: {
        body: `long[] out = new long[n];
long left = 1;
for (int i = 0; i < n; i++) { out[i] = left; left *= arr[i]; }
long right = 1;
for (int i = n - 1; i >= 0; i--) { out[i] *= right; right *= arr[i]; }
StringBuilder sb = new StringBuilder();
for (int i = 0; i < n; i++) sb.append(out[i]).append(i + 1 < n ? " " : "");
System.out.println(sb);`,
      },
      js: {
        body: `const out = new Array(n).fill(1);
let left = 1;
for (let i = 0; i < n; i++) { out[i] = left; left *= arr[i]; }
let right = 1;
for (let i = n - 1; i >= 0; i--) { out[i] *= right; right *= arr[i]; }
console.log(out.map((v) => (v === 0 ? 0 : v)).join(' '));`,
      },
    },
  },

  {
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'medium',
    tags: ['string', 'sliding window', 'hash map'],
    companies: ['Amazon', 'Bloomberg', 'Adobe'],
    shape: 'str',
    description: `Print the length of the longest contiguous substring that has no repeated characters.

Input format:
- A single word (letters, digits and symbols, no spaces)

Output format:
- The length

Constraints:
- 1 ≤ length ≤ 5 × 10⁴`,
    visible: [
      { s: 'abcabcbb', expect: '3', explanation: '"abc" is the longest window without repeats.' },
      { s: 'bbbbb', expect: '1', explanation: 'Every window longer than 1 repeats "b".' },
      { s: 'pwwkew', expect: '3', explanation: '"wke". Note "pwke" is not contiguous.' },
    ],
    hidden: [{ s: 'a' }, { s: 'au' }, { s: 'dvdf' }, { s: 'abba' }, { s: 'tmmzuxt' }],
    generate: (r) => [{ s: r.word(200, 'abcdef') }, { s: r.word(300, 'abcdefghijklmnopqrstuvwxyz0123456789') }, { s: r.word(10000, 'abcdefghijklmnopqrstuvwxyz0123456789!@#$%') }],
    brute: ({ s }) => {
      let best = 0;
      for (let i = 0; i < s.length; i++) {
        const seen = new Set();
        for (let j = i; j < s.length && !seen.has(s[j]); j++) seen.add(s[j]);
        best = Math.max(best, seen.size);
      }
      return best;
    },
    bruteLimit: small(400),
    solution: {
      cpp: { body: `vector<int> last(256, -1);\nint best = 0, start = 0;\nfor (int i = 0; i < (int)s.size(); i++) {\n    unsigned char ch = s[i];\n    if (last[ch] >= start) start = last[ch] + 1;\n    last[ch] = i;\n    best = max(best, i - start + 1);\n}\ncout << best << "\\n";` },
      java: { body: `int[] last = new int[256];\nArrays.fill(last, -1);\nint best = 0, start = 0;\nfor (int i = 0; i < s.length(); i++) {\n    int ch = s.charAt(i) & 255;\n    if (last[ch] >= start) start = last[ch] + 1;\n    last[ch] = i;\n    best = Math.max(best, i - start + 1);\n}\nSystem.out.println(best);` },
      js: { body: `const last = new Map();\nlet best = 0;\nlet start = 0;\nfor (let i = 0; i < s.length; i++) {\n  if (last.has(s[i]) && last.get(s[i]) >= start) start = last.get(s[i]) + 1;\n  last.set(s[i], i);\n  best = Math.max(best, i - start + 1);\n}\nconsole.log(best);` },
    },
  },

  {
    title: '3Sum',
    difficulty: 'medium',
    tags: ['array', 'two pointers', 'sorting'],
    companies: ['Meta', 'Amazon', 'Apple'],
    shape: 'arr',
    description: `Count the distinct triplets of values (a, b, c) taken from three different positions such that a + b + c = 0. Triplets that contain the same three values count once, whatever their positions.

Input format:
- Line 1: n
- Line 2: n integers

Output format:
- The number of distinct zero-sum triplets

Constraints:
- 3 ≤ n ≤ 3000
- -10⁵ ≤ values ≤ 10⁵`,
    visible: [
      { arr: [-1, 0, 1, 2, -1, -4], expect: '2', explanation: 'The triplets are (-1, -1, 2) and (-1, 0, 1).' },
      { arr: [0, 1, 1], expect: '0', explanation: 'No three values sum to 0.' },
      { arr: [0, 0, 0, 0], expect: '1', explanation: '(0, 0, 0) counts once.' },
    ],
    hidden: [{ arr: [-2, 0, 1, 1, 2] }, { arr: [1, 2, -3] }, { arr: [-4, -2, -2, -2, 0, 1, 2, 2, 2, 3, 3, 4, 4, 6, 6] }],
    generate: (r) => [{ arr: r.array(40, -10, 10) }, { arr: r.array(60, -30, 30) }, { arr: r.array(2500, -500, 500) }],
    brute: ({ arr }) => {
      const set = new Set();
      for (let i = 0; i < arr.length; i++)
        for (let j = i + 1; j < arr.length; j++)
          for (let k = j + 1; k < arr.length; k++) if (arr[i] + arr[j] + arr[k] === 0) set.add([arr[i], arr[j], arr[k]].sort((x, y) => x - y).join(','));
      return set.size;
    },
    bruteLimit: small(80),
    solution: {
      cpp: {
        body: `sort(arr.begin(), arr.end());
long long count = 0;
for (int i = 0; i < n - 2; i++) {
    if (i > 0 && arr[i] == arr[i - 1]) continue;
    int lo = i + 1, hi = n - 1;
    while (lo < hi) {
        long long sum = arr[i] + arr[lo] + arr[hi];
        if (sum < 0) lo++;
        else if (sum > 0) hi--;
        else {
            count++;
            long long a = arr[lo], b = arr[hi];
            while (lo < hi && arr[lo] == a) lo++;
            while (lo < hi && arr[hi] == b) hi--;
        }
    }
}
cout << count << "\\n";`,
      },
      java: {
        body: `Arrays.sort(arr);
long count = 0;
for (int i = 0; i < n - 2; i++) {
    if (i > 0 && arr[i] == arr[i - 1]) continue;
    int lo = i + 1, hi = n - 1;
    while (lo < hi) {
        long sum = arr[i] + arr[lo] + arr[hi];
        if (sum < 0) lo++;
        else if (sum > 0) hi--;
        else {
            count++;
            long a = arr[lo], b = arr[hi];
            while (lo < hi && arr[lo] == a) lo++;
            while (lo < hi && arr[hi] == b) hi--;
        }
    }
}
System.out.println(count);`,
      },
      js: {
        body: `arr.sort((x, y) => x - y);
let count = 0;
for (let i = 0; i < n - 2; i++) {
  if (i > 0 && arr[i] === arr[i - 1]) continue;
  let lo = i + 1;
  let hi = n - 1;
  while (lo < hi) {
    const sum = arr[i] + arr[lo] + arr[hi];
    if (sum < 0) lo++;
    else if (sum > 0) hi--;
    else {
      count++;
      const a = arr[lo];
      const b = arr[hi];
      while (lo < hi && arr[lo] === a) lo++;
      while (lo < hi && arr[hi] === b) hi--;
    }
  }
}
console.log(count);`,
      },
    },
  },

  {
    title: 'Top K Frequent Elements',
    difficulty: 'medium',
    tags: ['array', 'hash map', 'sorting'],
    companies: ['Amazon', 'Yelp'],
    shape: 'arrK',
    description: `Print the k values that appear most often. Order them by frequency, highest first; break ties by the smaller value first.

Input format:
- Line 1: n
- Line 2: n integers
- Line 3: k

Output format:
- k values, space-separated

Constraints:
- 1 ≤ n ≤ 10⁵
- -10⁴ ≤ values ≤ 10⁴
- 1 ≤ k ≤ number of distinct values`,
    visible: [
      { arr: [1, 1, 1, 2, 2, 3], k: 2, expect: '1 2', explanation: '1 appears 3 times and 2 appears twice.' },
      { arr: [4, 4, 6, 6, 5], k: 2, expect: '4 6', explanation: '4 and 6 tie with 2 each; 4 is smaller so it comes first.' },
    ],
    hidden: [{ arr: [1], k: 1 }, { arr: [3, 1, 2], k: 3 }, { arr: [-1, -1, 2, 2, 2, 7], k: 1 }],
    generate: (r) => [{ arr: r.array(300, -20, 20), k: 5 }, { arr: r.array(10000, -10000, 10000), k: 10 }, { arr: r.array(1000, 0, 9), k: 10 }],
    brute: ({ arr, k }) => {
      const freq = {};
      for (const v of arr) freq[v] = (freq[v] || 0) + 1;
      return Object.keys(freq)
        .map(Number)
        .sort((a, b) => freq[b] - freq[a] || a - b)
        .slice(0, k)
        .join(' ');
    },
    solution: {
      cpp: {
        body: `map<long long, int> freq;
for (auto x : arr) freq[x]++;
vector<pair<int, long long>> items;
for (auto &e : freq) items.push_back({-e.second, e.first});
sort(items.begin(), items.end());
for (int i = 0; i < k; i++) cout << items[i].second << (i + 1 < k ? " " : "\\n");`,
      },
      java: {
        body: `HashMap<Long, Integer> freq = new HashMap<>();
for (long x : arr) freq.merge(x, 1, Integer::sum);
List<Long> keys = new ArrayList<>(freq.keySet());
keys.sort((a, b) -> freq.get(a).equals(freq.get(b)) ? Long.compare(a, b) : freq.get(b) - freq.get(a));
StringBuilder sb = new StringBuilder();
for (int i = 0; i < k; i++) sb.append(keys.get(i)).append(i + 1 < k ? " " : "");
System.out.println(sb);`,
      },
      js: {
        body: `const freq = new Map();
for (const x of arr) freq.set(x, (freq.get(x) || 0) + 1);
const keys = [...freq.keys()].sort((a, b) => freq.get(b) - freq.get(a) || a - b);
console.log(keys.slice(0, k).join(' '));`,
      },
    },
  },

  {
    title: 'Kth Largest Element in an Array',
    difficulty: 'medium',
    tags: ['array', 'heap', 'sorting'],
    companies: ['Meta', 'Amazon', 'Spotify'],
    shape: 'arrK',
    description: `Print the kth largest value in the array (in sorted order, not the kth distinct value).

Input format:
- Line 1: n
- Line 2: n integers
- Line 3: k

Output format:
- The kth largest value

Constraints:
- 1 ≤ k ≤ n ≤ 10⁵
- -10⁴ ≤ values ≤ 10⁴`,
    visible: [
      { arr: [3, 2, 1, 5, 6, 4], k: 2, expect: '5', explanation: 'Sorted descending: 6, 5, 4, … — the 2nd is 5.' },
      { arr: [3, 2, 3, 1, 2, 4, 5, 5, 6], k: 4, expect: '4', explanation: 'Sorted descending: 6, 5, 5, 4, … — duplicates count.' },
    ],
    hidden: [{ arr: [1], k: 1 }, { arr: [2, 1], k: 2 }, { arr: [-1, -1, -1], k: 2 }],
    generate: (r) => [{ arr: r.array(500, -100, 100), k: 17 }, { arr: r.array(10000, -10000, 10000), k: 5000 }, { arr: r.array(1000, -5, 5), k: 1000 }],
    brute: ({ arr, k }) => [...arr].sort((a, b) => b - a)[k - 1],
    solution: {
      cpp: { body: `priority_queue<long long, vector<long long>, greater<long long>> heap;\nfor (auto x : arr) {\n    heap.push(x);\n    if ((long long)heap.size() > k) heap.pop();\n}\ncout << heap.top() << "\\n";` },
      java: { body: `PriorityQueue<Long> heap = new PriorityQueue<>();\nfor (long x : arr) {\n    heap.add(x);\n    if (heap.size() > k) heap.poll();\n}\nSystem.out.println(heap.peek());` },
      js: { body: `const sorted = arr.slice().sort((a, b) => b - a);\nconsole.log(sorted[k - 1]);` },
    },
  },

  {
    title: 'Rotate Array',
    difficulty: 'medium',
    tags: ['array', 'math'],
    companies: ['Microsoft', 'Amazon'],
    shape: 'arrK',
    description: `Rotate the array to the right by k steps and print it.

Input format:
- Line 1: n
- Line 2: n integers
- Line 3: k

Output format:
- The rotated array, space-separated

Constraints:
- 1 ≤ n ≤ 10⁵
- 0 ≤ k ≤ 10⁹`,
    visible: [
      { arr: [1, 2, 3, 4, 5, 6, 7], k: 3, expect: '5 6 7 1 2 3 4', explanation: 'Each step moves the last element to the front; after 3 steps 5, 6, 7 lead.' },
      { arr: [-1, -100, 3, 99], k: 2, expect: '3 99 -1 -100', explanation: 'Two steps to the right.' },
    ],
    hidden: [{ arr: [1], k: 5 }, { arr: [1, 2], k: 0 }, { arr: [1, 2, 3], k: 3 }],
    generate: (r) => [{ arr: r.array(100, -50, 50), k: 1000000007 }, { arr: r.array(10000, -1e5, 1e5), k: r.int(0, 1e9) }],
    brute: ({ arr, k }) => {
      let a = [...arr];
      for (let i = 0; i < k % arr.length; i++) a = [a[a.length - 1], ...a.slice(0, -1)];
      return a.join(' ');
    },
    bruteLimit: small(200),
    solution: {
      cpp: { body: `long long shift = k % n;\nfor (int i = 0; i < n; i++) cout << arr[(i - shift + n) % n] << (i + 1 < n ? " " : "\\n");` },
      java: { body: `int shift = (int) (k % n);\nStringBuilder sb = new StringBuilder();\nfor (int i = 0; i < n; i++) sb.append(arr[(i - shift + n) % n]).append(i + 1 < n ? " " : "");\nSystem.out.println(sb);` },
      js: { body: `const shift = k % n;\nconsole.log(arr.slice(n - shift).concat(arr.slice(0, n - shift)).join(' '));` },
    },
  },

  {
    title: 'Search in Rotated Sorted Array',
    difficulty: 'medium',
    tags: ['array', 'binary search'],
    companies: ['Meta', 'LinkedIn', 'Microsoft'],
    shape: 'arrK',
    description: `A sorted array of distinct integers was rotated at an unknown pivot (for example 0 1 2 4 5 6 7 might become 4 5 6 7 0 1 2). Print the index of the target, or -1 if it is not present. Aim for O(log n).

Input format:
- Line 1: n
- Line 2: n distinct integers
- Line 3: target

Output format:
- The index of target, or -1

Constraints:
- 1 ≤ n ≤ 10⁵
- -10⁹ ≤ values, target ≤ 10⁹`,
    visible: [
      { arr: [4, 5, 6, 7, 0, 1, 2], k: 0, expect: '4', explanation: '0 sits at index 4.' },
      { arr: [4, 5, 6, 7, 0, 1, 2], k: 3, expect: '-1', explanation: '3 is not in the array.' },
    ],
    hidden: [{ arr: [1], k: 0 }, { arr: [1], k: 1 }, { arr: [3, 1], k: 1 }, { arr: [5, 1, 3], k: 5 }],
    generate: (r) => {
      const mk = (n) => {
        const sorted = [...new Set(r.array(n * 2, -1e9, 1e9))].sort((a, b) => a - b).slice(0, n);
        const p = r.int(0, sorted.length - 1);
        return sorted.slice(p).concat(sorted.slice(0, p));
      };
      const a = mk(50);
      const b = mk(10000);
      return [{ arr: a, k: a[r.int(0, a.length - 1)] }, { arr: a, k: 1e9 + 0 }, { arr: b, k: b[r.int(0, b.length - 1)] }, { arr: b, k: b[0] }, { arr: b, k: b[b.length - 1] }];
    },
    brute: ({ arr, k }) => arr.indexOf(k),
    solution: {
      cpp: {
        body: `int lo = 0, hi = n - 1, ans = -1;
while (lo <= hi) {
    int mid = (lo + hi) / 2;
    if (arr[mid] == k) { ans = mid; break; }
    if (arr[lo] <= arr[mid]) {
        if (arr[lo] <= k && k < arr[mid]) hi = mid - 1; else lo = mid + 1;
    } else {
        if (arr[mid] < k && k <= arr[hi]) lo = mid + 1; else hi = mid - 1;
    }
}
cout << ans << "\\n";`,
      },
      java: {
        body: `int lo = 0, hi = n - 1, ans = -1;
while (lo <= hi) {
    int mid = (lo + hi) / 2;
    if (arr[mid] == k) { ans = mid; break; }
    if (arr[lo] <= arr[mid]) {
        if (arr[lo] <= k && k < arr[mid]) hi = mid - 1; else lo = mid + 1;
    } else {
        if (arr[mid] < k && k <= arr[hi]) lo = mid + 1; else hi = mid - 1;
    }
}
System.out.println(ans);`,
      },
      js: {
        body: `let lo = 0;
let hi = n - 1;
let ans = -1;
while (lo <= hi) {
  const mid = (lo + hi) >> 1;
  if (arr[mid] === k) { ans = mid; break; }
  if (arr[lo] <= arr[mid]) {
    if (arr[lo] <= k && k < arr[mid]) hi = mid - 1; else lo = mid + 1;
  } else if (arr[mid] < k && k <= arr[hi]) lo = mid + 1;
  else hi = mid - 1;
}
console.log(ans);`,
      },
    },
  },

  {
    title: 'Find Minimum in Rotated Sorted Array',
    difficulty: 'medium',
    tags: ['array', 'binary search'],
    companies: ['Microsoft', 'Amazon'],
    shape: 'arr',
    description: `A sorted array of distinct integers was rotated between 1 and n times. Print its minimum value in O(log n).

Input format:
- Line 1: n
- Line 2: n distinct integers

Output format:
- The minimum value

Constraints:
- 1 ≤ n ≤ 10⁵
- -10⁹ ≤ values ≤ 10⁹`,
    visible: [
      { arr: [3, 4, 5, 1, 2], expect: '1', explanation: 'The original array 1 2 3 4 5 was rotated 3 times.' },
      { arr: [11, 13, 15, 17], expect: '11', explanation: 'Rotated n times, it is back in order.' },
    ],
    hidden: [{ arr: [1] }, { arr: [2, 1] }, { arr: [4, 5, 6, 7, 0, 1, 2] }],
    generate: (r) =>
      [100, 8000, 10000].map((n) => {
        const sorted = [...new Set(r.array(n * 2, -1e9, 1e9))].sort((a, b) => a - b).slice(0, n);
        const p = r.int(0, sorted.length - 1);
        return { arr: sorted.slice(p).concat(sorted.slice(0, p)) };
      }),
    brute: ({ arr }) => Math.min(...arr),
    solution: {
      cpp: { body: `int lo = 0, hi = n - 1;\nwhile (lo < hi) {\n    int mid = (lo + hi) / 2;\n    if (arr[mid] > arr[hi]) lo = mid + 1; else hi = mid;\n}\ncout << arr[lo] << "\\n";` },
      java: { body: `int lo = 0, hi = n - 1;\nwhile (lo < hi) {\n    int mid = (lo + hi) / 2;\n    if (arr[mid] > arr[hi]) lo = mid + 1; else hi = mid;\n}\nSystem.out.println(arr[lo]);` },
      js: { body: `let lo = 0;\nlet hi = n - 1;\nwhile (lo < hi) {\n  const mid = (lo + hi) >> 1;\n  if (arr[mid] > arr[hi]) lo = mid + 1; else hi = mid;\n}\nconsole.log(arr[lo]);` },
    },
  },

  {
    title: 'Coin Change',
    difficulty: 'medium',
    tags: ['dynamic programming', 'breadth-first search'],
    companies: ['Amazon', 'Google', 'Goldman Sachs'],
    shape: 'arrK',
    description: `Given coin denominations (unlimited supply of each) and a target amount, print the fewest coins that add up to the amount, or -1 if it cannot be made.

Input format:
- Line 1: n, the number of denominations
- Line 2: n coin values
- Line 3: the amount

Output format:
- The minimum number of coins, or -1

Constraints:
- 1 ≤ n ≤ 12
- 1 ≤ coin ≤ 2³¹ − 1
- 0 ≤ amount ≤ 10⁴`,
    visible: [
      { arr: [1, 2, 5], k: 11, expect: '3', explanation: '11 = 5 + 5 + 1.' },
      { arr: [2], k: 3, expect: '-1', explanation: 'Only even amounts can be made with 2s.' },
      { arr: [1], k: 0, expect: '0', explanation: 'Zero coins make an amount of 0.' },
    ],
    hidden: [{ arr: [2, 5, 10, 1], k: 27 }, { arr: [186, 419, 83, 408], k: 6249 }, { arr: [3, 7], k: 1 }, { arr: [2147483647], k: 2 }],
    generate: (r) => [
      { arr: [...new Set(r.array(5, 1, 50))], k: r.int(0, 300) },
      { arr: [...new Set(r.array(10, 1, 1000))], k: 10000 },
      { arr: [7, 13, 29], k: r.int(5000, 10000) },
    ],
    brute: ({ arr, k }) => {
      // BFS over amounts: a different method from the DP the solutions use
      const dist = new Array(k + 1).fill(-1);
      dist[0] = 0;
      const queue = [0];
      for (let h = 0; h < queue.length; h++) {
        const cur = queue[h];
        for (const c of arr) {
          const nxt = cur + c;
          if (nxt <= k && dist[nxt] === -1) {
            dist[nxt] = dist[cur] + 1;
            queue.push(nxt);
          }
        }
      }
      return dist[k];
    },
    solution: {
      cpp: {
        body: `const int INF = INT_MAX;
vector<int> dp(k + 1, INF);
dp[0] = 0;
for (long long a = 1; a <= k; a++)
    for (auto c : arr)
        if (c <= a && dp[a - c] != INF) dp[a] = min(dp[a], dp[a - c] + 1);
cout << (dp[k] == INF ? -1 : dp[k]) << "\\n";`,
      },
      java: {
        body: `int amount = (int) k;
int[] dp = new int[amount + 1];
Arrays.fill(dp, Integer.MAX_VALUE);
dp[0] = 0;
for (int a = 1; a <= amount; a++)
    for (long c : arr)
        if (c <= a && dp[a - (int) c] != Integer.MAX_VALUE) dp[a] = Math.min(dp[a], dp[a - (int) c] + 1);
System.out.println(dp[amount] == Integer.MAX_VALUE ? -1 : dp[amount]);`,
      },
      js: {
        body: `const dp = new Array(k + 1).fill(Infinity);
dp[0] = 0;
for (let a = 1; a <= k; a++) for (const c of arr) if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
console.log(dp[k] === Infinity ? -1 : dp[k]);`,
      },
    },
  },

  {
    title: 'Longest Increasing Subsequence',
    difficulty: 'medium',
    tags: ['dynamic programming', 'binary search'],
    companies: ['Google', 'Microsoft'],
    shape: 'arr',
    description: `Print the length of the longest strictly increasing subsequence (elements in order, not necessarily adjacent).

Input format:
- Line 1: n
- Line 2: n integers

Output format:
- The length

Constraints:
- 1 ≤ n ≤ 10⁵
- -10⁹ ≤ values ≤ 10⁹`,
    visible: [
      { arr: [10, 9, 2, 5, 3, 7, 101, 18], expect: '4', explanation: 'One longest subsequence is 2, 3, 7, 101.' },
      { arr: [7, 7, 7, 7], expect: '1', explanation: 'Equal values are not strictly increasing.' },
    ],
    hidden: [{ arr: [1] }, { arr: [0, 1, 0, 3, 2, 3] }, { arr: [5, 4, 3, 2, 1] }, { arr: [1, 2, 3, 4, 5] }],
    generate: (r) => [{ arr: r.array(300, -50, 50) }, { arr: r.array(2000, -1e9, 1e9) }, { arr: r.array(10000, -1e9, 1e9) }],
    brute: ({ arr }) => {
      const dp = arr.map(() => 1);
      for (let i = 0; i < arr.length; i++) for (let j = 0; j < i; j++) if (arr[j] < arr[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
      return Math.max(...dp);
    },
    bruteLimit: small(3000),
    solution: {
      cpp: { body: `vector<long long> tails;\nfor (auto x : arr) {\n    auto it = lower_bound(tails.begin(), tails.end(), x);\n    if (it == tails.end()) tails.push_back(x); else *it = x;\n}\ncout << tails.size() << "\\n";` },
      java: {
        body: `long[] tails = new long[n];\nint size = 0;\nfor (long x : arr) {\n    int lo = 0, hi = size;\n    while (lo < hi) {\n        int mid = (lo + hi) / 2;\n        if (tails[mid] < x) lo = mid + 1; else hi = mid;\n    }\n    tails[lo] = x;\n    if (lo == size) size++;\n}\nSystem.out.println(size);`,
      },
      js: {
        body: `const tails = [];\nfor (const x of arr) {\n  let lo = 0;\n  let hi = tails.length;\n  while (lo < hi) {\n    const mid = (lo + hi) >> 1;\n    if (tails[mid] < x) lo = mid + 1; else hi = mid;\n  }\n  tails[lo] = x;\n}\nconsole.log(tails.length);`,
      },
    },
  },

  {
    title: 'House Robber',
    difficulty: 'medium',
    tags: ['dynamic programming'],
    companies: ['Amazon', 'Cisco'],
    shape: 'arr',
    description: `Houses along a street hold the given amounts of money. You cannot rob two adjacent houses. Print the most money you can rob.

Input format:
- Line 1: n
- Line 2: n non-negative amounts

Output format:
- The maximum amount

Constraints:
- 1 ≤ n ≤ 10⁵
- 0 ≤ amounts ≤ 10⁴`,
    visible: [
      { arr: [1, 2, 3, 1], expect: '4', explanation: 'Rob houses 0 and 2: 1 + 3 = 4.' },
      { arr: [2, 7, 9, 3, 1], expect: '12', explanation: 'Rob houses 0, 2 and 4: 2 + 9 + 1 = 12.' },
    ],
    hidden: [{ arr: [5] }, { arr: [2, 1] }, { arr: [2, 1, 1, 2] }, { arr: [0, 0, 0] }],
    generate: (r) => [{ arr: r.array(12, 0, 50) }, { arr: r.array(15, 0, 10000) }, { arr: r.array(10000, 0, 10000) }],
    brute: ({ arr }) => {
      const go = (i) => (i >= arr.length ? 0 : Math.max(go(i + 1), arr[i] + go(i + 2)));
      return go(0);
    },
    bruteLimit: small(20),
    solution: {
      cpp: { body: `long long take = 0, skip = 0;\nfor (auto x : arr) {\n    long long nt = skip + x;\n    skip = max(skip, take);\n    take = nt;\n}\ncout << max(take, skip) << "\\n";` },
      java: { body: `long take = 0, skip = 0;\nfor (long x : arr) {\n    long nt = skip + x;\n    skip = Math.max(skip, take);\n    take = nt;\n}\nSystem.out.println(Math.max(take, skip));` },
      js: { body: `let take = 0;\nlet skip = 0;\nfor (const x of arr) [take, skip] = [skip + x, Math.max(skip, take)];\nconsole.log(Math.max(take, skip));` },
    },
  },

  {
    title: 'Jump Game',
    difficulty: 'medium',
    tags: ['array', 'greedy'],
    companies: ['Amazon', 'Microsoft'],
    shape: 'arr',
    description: `You start at index 0. arr[i] is the maximum jump length from index i. Print true if you can reach the last index, otherwise false.

Input format:
- Line 1: n
- Line 2: n non-negative integers

Output format:
- true or false

Constraints:
- 1 ≤ n ≤ 10⁴
- 0 ≤ arr[i] ≤ 10⁵`,
    visible: [
      { arr: [2, 3, 1, 1, 4], expect: 'true', explanation: 'Jump 1 step to index 1, then 3 steps to the end.' },
      { arr: [3, 2, 1, 0, 4], expect: 'false', explanation: 'Every path lands on index 3, whose jump length is 0.' },
    ],
    hidden: [{ arr: [0] }, { arr: [0, 1] }, { arr: [1, 0] }, { arr: [2, 0, 0] }],
    generate: (r) => [{ arr: r.array(60, 0, 3) }, { arr: r.array(200, 0, 2) }, { arr: r.array(9000, 0, 2) }, { arr: [...new Array(9998).fill(1), 0, 5] }],
    brute: ({ arr }) => {
      const reach = arr.map(() => false);
      reach[0] = true;
      for (let i = 0; i < arr.length; i++) if (reach[i]) for (let j = 1; j <= arr[i] && i + j < arr.length; j++) reach[i + j] = true;
      return reach[arr.length - 1] ? 'true' : 'false';
    },
    bruteLimit: small(500),
    solution: {
      cpp: { body: `long long far = 0;\nbool ok = true;\nfor (int i = 0; i < n; i++) {\n    if (i > far) { ok = false; break; }\n    far = max(far, i + arr[i]);\n}\ncout << ${yesNo.cpp} << "\\n";` },
      java: { body: `long far = 0;\nboolean ok = true;\nfor (int i = 0; i < n; i++) {\n    if (i > far) { ok = false; break; }\n    far = Math.max(far, i + arr[i]);\n}\nSystem.out.println(${yesNo.java});` },
      js: { body: `let far = 0;\nlet ok = true;\nfor (let i = 0; i < n; i++) {\n  if (i > far) { ok = false; break; }\n  far = Math.max(far, i + arr[i]);\n}\nconsole.log(${yesNo.js});` },
    },
  },

  {
    title: 'Unique Paths',
    difficulty: 'medium',
    tags: ['dynamic programming', 'math', 'combinatorics'],
    companies: ['Google', 'Amazon'],
    shape: 'twoInt',
    description: `A robot starts at the top-left cell of an m × n grid and can only move right or down. Print the number of distinct paths to the bottom-right cell.

Input format:
- Two integers m and n

Output format:
- The number of paths

Constraints:
- 1 ≤ m, n ≤ 100
- The answer is at most 2 × 10⁹`,
    visible: [
      { m: 3, n: 7, expect: '28', explanation: 'Any path makes 2 down moves and 6 right moves: C(8, 2) = 28.' },
      { m: 3, n: 2, expect: '3', explanation: 'Right→Down→Down, Down→Right→Down, Down→Down→Right.' },
    ],
    hidden: [{ m: 1, n: 1 }, { m: 1, n: 100 }, { m: 100, n: 1 }, { m: 10, n: 10 }, { m: 17, n: 17 }, { m: 2, n: 100 }],
    generate: (r) => [{ m: r.int(1, 15), n: r.int(1, 15) }, { m: 13, n: 23 }],
    brute: ({ m, n }) => {
      // C(m + n - 2, m - 1) with BigInt
      let num = 1n;
      let den = 1n;
      for (let i = 1n; i <= BigInt(m - 1); i++) {
        num *= BigInt(n - 1) + i;
        den *= i;
      }
      return (num / den).toString();
    },
    solution: {
      cpp: { body: `vector<long long> row(n, 1);\nfor (int i = 1; i < m; i++)\n    for (int j = 1; j < n; j++) row[j] += row[j - 1];\ncout << row[n - 1] << "\\n";` },
      java: { body: `long[] row = new long[(int) n];\nArrays.fill(row, 1);\nfor (int i = 1; i < m; i++)\n    for (int j = 1; j < n; j++) row[j] += row[j - 1];\nSystem.out.println(row[(int) n - 1]);` },
      js: { body: `const row = new Array(n).fill(1);\nfor (let i = 1; i < m; i++) for (let j = 1; j < n; j++) row[j] += row[j - 1];\nconsole.log(row[n - 1]);` },
    },
  },

  {
    title: 'Number of Islands',
    difficulty: 'medium',
    tags: ['graph', 'breadth-first search', 'matrix'],
    companies: ['Amazon', 'Google', 'Meta'],
    shape: 'charGrid',
    description: `A grid of '1' (land) and '0' (water). An island is a group of land cells connected horizontally or vertically. Print the number of islands.

Input format:
- Line 1: r c
- Next r lines: strings of length c made of 0 and 1

Output format:
- The number of islands

Constraints:
- 1 ≤ r, c ≤ 300`,
    visible: [
      { rows: ['11110', '11010', '11000', '00000'], expect: '1', explanation: 'All the land cells touch, forming one island.' },
      { rows: ['11000', '11000', '00100', '00011'], expect: '3', explanation: 'Top-left block, the single cell in the middle, and the bottom-right pair.' },
    ],
    hidden: [{ rows: ['0'] }, { rows: ['1'] }, { rows: ['101', '010', '101'] }, { rows: ['1111', '1001', '1111'] }],
    generate: (r) => {
      const mk = (rows, cols, p) => Array.from({ length: rows }, () => Array.from({ length: cols }, () => (r.rand() < p ? '1' : '0')).join(''));
      return [{ rows: mk(10, 12, 0.4) }, { rows: mk(80, 60, 0.45) }, { rows: mk(150, 150, 0.5) }];
    },
    brute: ({ rows }) => {
      // Union-find: a different method from the BFS solutions
      const R = rows.length;
      const C = rows[0].length;
      const parent = Array.from({ length: R * C }, (_, i) => i);
      const find = (x) => (parent[x] === x ? x : (parent[x] = find(parent[x])));
      for (let i = 0; i < R; i++)
        for (let j = 0; j < C; j++) {
          if (rows[i][j] !== '1') continue;
          if (i + 1 < R && rows[i + 1][j] === '1') parent[find(i * C + j)] = find((i + 1) * C + j);
          if (j + 1 < C && rows[i][j + 1] === '1') parent[find(i * C + j)] = find(i * C + j + 1);
        }
      let count = 0;
      for (let i = 0; i < R; i++) for (let j = 0; j < C; j++) if (rows[i][j] === '1' && find(i * C + j) === i * C + j) count++;
      return count;
    },
    solution: {
      cpp: {
        body: `int islands = 0;
int dr[4] = {1, -1, 0, 0}, dc[4] = {0, 0, 1, -1};
for (int i = 0; i < r; i++)
    for (int j = 0; j < c; j++) {
        if (g[i][j] != '1') continue;
        islands++;
        queue<pair<int, int>> q;
        q.push({i, j});
        g[i][j] = '0';
        while (!q.empty()) {
            auto [x, y] = q.front();
            q.pop();
            for (int d = 0; d < 4; d++) {
                int nx = x + dr[d], ny = y + dc[d];
                if (nx >= 0 && ny >= 0 && nx < r && ny < c && g[nx][ny] == '1') {
                    g[nx][ny] = '0';
                    q.push({nx, ny});
                }
            }
        }
    }
cout << islands << "\\n";`,
      },
      java: {
        body: `int islands = 0;
int[] dr = {1, -1, 0, 0}, dc = {0, 0, 1, -1};
ArrayDeque<int[]> q = new ArrayDeque<>();
for (int i = 0; i < r; i++)
    for (int j = 0; j < c; j++) {
        if (g[i][j] != '1') continue;
        islands++;
        g[i][j] = '0';
        q.add(new int[] {i, j});
        while (!q.isEmpty()) {
            int[] cur = q.poll();
            for (int d = 0; d < 4; d++) {
                int nx = cur[0] + dr[d], ny = cur[1] + dc[d];
                if (nx >= 0 && ny >= 0 && nx < r && ny < c && g[nx][ny] == '1') {
                    g[nx][ny] = '0';
                    q.add(new int[] {nx, ny});
                }
            }
        }
    }
System.out.println(islands);`,
      },
      js: {
        body: `let islands = 0;
const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
for (let i = 0; i < r; i++)
  for (let j = 0; j < c; j++) {
    if (g[i][j] !== '1') continue;
    islands++;
    g[i][j] = '0';
    const q = [[i, j]];
    for (let h = 0; h < q.length; h++) {
      const [x, y] = q[h];
      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && ny >= 0 && nx < r && ny < c && g[nx][ny] === '1') {
          g[nx][ny] = '0';
          q.push([nx, ny]);
        }
      }
    }
  }
console.log(islands);`,
      },
    },
  },

  {
    title: 'Rotting Oranges',
    difficulty: 'medium',
    tags: ['graph', 'breadth-first search', 'matrix'],
    companies: ['Amazon', 'Microsoft'],
    shape: 'matrix',
    description: `Each cell is 0 (empty), 1 (fresh orange) or 2 (rotten orange). Every minute, fresh oranges next to a rotten one (up, down, left, right) become rotten. Print the minutes until no fresh orange remains, or -1 if that never happens.

Input format:
- Line 1: r c
- Next r lines: c values each (0, 1 or 2)

Output format:
- The number of minutes, or -1

Constraints:
- 1 ≤ r, c ≤ 100`,
    visible: [
      { grid: [[2, 1, 1], [1, 1, 0], [0, 1, 1]], expect: '4', explanation: 'The rot spreads from the top-left corner and reaches the bottom-right orange at minute 4.' },
      { grid: [[2, 1, 1], [0, 1, 1], [1, 0, 1]], expect: '-1', explanation: 'The bottom-left orange is cut off and never rots.' },
      { grid: [[0, 2]], expect: '0', explanation: 'There are no fresh oranges to begin with.' },
    ],
    hidden: [{ grid: [[1]] }, { grid: [[0]] }, { grid: [[2, 2], [1, 1]] }],
    generate: (r) => {
      const mk = (rows, cols) => Array.from({ length: rows }, () => Array.from({ length: cols }, () => r.pick([0, 1, 1, 1, 1, 1, 2])));
      const full = Array.from({ length: 100 }, () => new Array(100).fill(1));
      full[0][0] = 2;
      return [{ grid: mk(6, 7) }, { grid: mk(40, 50) }, { grid: full }];
    },
    brute: ({ grid }) => {
      // Minute-by-minute simulation
      let g = grid.map((row) => [...row]);
      let minutes = 0;
      for (;;) {
        const next = g.map((row) => [...row]);
        let changed = false;
        for (let i = 0; i < g.length; i++)
          for (let j = 0; j < g[0].length; j++)
            if (g[i][j] === 1 && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => (g[i + dx] || [])[j + dy] === 2)) {
              next[i][j] = 2;
              changed = true;
            }
        if (!changed) break;
        g = next;
        minutes++;
      }
      return g.some((row) => row.includes(1)) ? -1 : minutes;
    },
    bruteLimit: (c) => c.grid.length * c.grid[0].length <= 2500,
    solution: {
      cpp: {
        body: `queue<pair<int, int>> q;
int fresh = 0;
for (int i = 0; i < r; i++)
    for (int j = 0; j < c; j++) {
        if (grid[i][j] == 2) q.push({i, j});
        else if (grid[i][j] == 1) fresh++;
    }
int minutes = 0;
int dr[4] = {1, -1, 0, 0}, dc[4] = {0, 0, 1, -1};
while (!q.empty() && fresh > 0) {
    int size = q.size();
    for (int s = 0; s < size; s++) {
        auto [x, y] = q.front();
        q.pop();
        for (int d = 0; d < 4; d++) {
            int nx = x + dr[d], ny = y + dc[d];
            if (nx >= 0 && ny >= 0 && nx < r && ny < c && grid[nx][ny] == 1) {
                grid[nx][ny] = 2;
                fresh--;
                q.push({nx, ny});
            }
        }
    }
    minutes++;
}
cout << (fresh == 0 ? minutes : -1) << "\\n";`,
      },
      java: {
        body: `ArrayDeque<int[]> q = new ArrayDeque<>();
int fresh = 0;
for (int i = 0; i < r; i++)
    for (int j = 0; j < c; j++) {
        if (grid[i][j] == 2) q.add(new int[] {i, j});
        else if (grid[i][j] == 1) fresh++;
    }
int minutes = 0;
int[] dr = {1, -1, 0, 0}, dc = {0, 0, 1, -1};
while (!q.isEmpty() && fresh > 0) {
    int size = q.size();
    for (int s = 0; s < size; s++) {
        int[] cur = q.poll();
        for (int d = 0; d < 4; d++) {
            int nx = cur[0] + dr[d], ny = cur[1] + dc[d];
            if (nx >= 0 && ny >= 0 && nx < r && ny < c && grid[nx][ny] == 1) {
                grid[nx][ny] = 2;
                fresh--;
                q.add(new int[] {nx, ny});
            }
        }
    }
    minutes++;
}
System.out.println(fresh == 0 ? minutes : -1);`,
      },
      js: {
        body: `let q = [];
let fresh = 0;
for (let i = 0; i < r; i++)
  for (let j = 0; j < c; j++) {
    if (grid[i][j] === 2) q.push([i, j]);
    else if (grid[i][j] === 1) fresh++;
  }
let minutes = 0;
const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
while (q.length && fresh > 0) {
  const nextQ = [];
  for (const [x, y] of q)
    for (const [dx, dy] of dirs) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && ny >= 0 && nx < r && ny < c && grid[nx][ny] === 1) {
        grid[nx][ny] = 2;
        fresh--;
        nextQ.push([nx, ny]);
      }
    }
  q = nextQ;
  minutes++;
}
console.log(fresh === 0 ? minutes : -1);`,
      },
    },
  },

  {
    title: 'Course Schedule',
    difficulty: 'medium',
    tags: ['graph', 'topological sort'],
    companies: ['Amazon', 'Uber', 'Google'],
    shape: 'graph',
    description: `There are n courses labelled 0 to n − 1. Each pair "a b" means course b must be taken before course a. Print true if it is possible to finish every course, otherwise false.

Input format:
- Line 1: n m (number of courses, number of prerequisite pairs)
- Next m lines: a b

Output format:
- true or false

Constraints:
- 1 ≤ n ≤ 2000
- 0 ≤ m ≤ 5000`,
    visible: [
      { n: 2, edges: [[1, 0]], expect: 'true', explanation: 'Take course 0, then course 1.' },
      { n: 2, edges: [[1, 0], [0, 1]], expect: 'false', explanation: 'Each course needs the other first — a cycle.' },
    ],
    hidden: [{ n: 1, edges: [] }, { n: 3, edges: [[0, 1], [1, 2], [2, 0]] }, { n: 4, edges: [[1, 0], [2, 1], [3, 2]] }, { n: 3, edges: [[0, 0]] }],
    generate: (r) => {
      const dag = (n, m) => {
        const order = r.shuffle(Array.from({ length: n }, (_, i) => i));
        return Array.from({ length: m }, () => {
          const i = r.int(0, n - 2);
          const j = r.int(i + 1, n - 1);
          return [order[j], order[i]];
        });
      };
      const big = dag(2000, 5000);
      const cyclic = dag(300, 800);
      cyclic.push([cyclic[0][1], cyclic[0][0]]);
      return [{ n: 30, edges: dag(30, 60) }, { n: 2000, edges: big }, { n: 300, edges: cyclic }];
    },
    brute: ({ n, edges }) => {
      // DFS cycle detection: a different method from Kahn's algorithm in the solutions
      const adj = Array.from({ length: n }, () => []);
      for (const [a, b] of edges) adj[b].push(a);
      const state = new Array(n).fill(0);
      const cyclic = (u) => {
        state[u] = 1;
        for (const v of adj[u]) if (state[v] === 1 || (state[v] === 0 && cyclic(v))) return true;
        state[u] = 2;
        return false;
      };
      for (let u = 0; u < n; u++) if (state[u] === 0 && cyclic(u)) return 'false';
      return 'true';
    },
    bruteLimit: (c) => c.n <= 500,
    solution: {
      cpp: {
        body: `vector<vector<int>> adj(n);
vector<int> indeg(n, 0);
for (auto &e : edges) { adj[e.second].push_back(e.first); indeg[e.first]++; }
queue<int> q;
for (int i = 0; i < n; i++) if (indeg[i] == 0) q.push(i);
int done = 0;
while (!q.empty()) {
    int u = q.front();
    q.pop();
    done++;
    for (int v : adj[u]) if (--indeg[v] == 0) q.push(v);
}
bool ok = done == n;
cout << ${yesNo.cpp} << "\\n";`,
      },
      java: {
        body: `List<List<Integer>> adj = new ArrayList<>();
for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
int[] indeg = new int[n];
for (int[] e : edges) { adj.get(e[1]).add(e[0]); indeg[e[0]]++; }
ArrayDeque<Integer> q = new ArrayDeque<>();
for (int i = 0; i < n; i++) if (indeg[i] == 0) q.add(i);
int done = 0;
while (!q.isEmpty()) {
    int u = q.poll();
    done++;
    for (int v : adj.get(u)) if (--indeg[v] == 0) q.add(v);
}
boolean ok = done == n;
System.out.println(${yesNo.java});`,
      },
      js: {
        body: `const adj = Array.from({ length: n }, () => []);
const indeg = new Array(n).fill(0);
for (const [a, b] of edges) { adj[b].push(a); indeg[a]++; }
const q = [];
for (let i = 0; i < n; i++) if (indeg[i] === 0) q.push(i);
for (let h = 0; h < q.length; h++) for (const v of adj[q[h]]) if (--indeg[v] === 0) q.push(v);
const ok = q.length === n;
console.log(${yesNo.js});`,
      },
    },
  },

  {
    title: 'Longest Palindromic Substring',
    difficulty: 'medium',
    tags: ['string', 'dynamic programming', 'two pointers'],
    companies: ['Amazon', 'Microsoft', 'Adobe'],
    shape: 'str',
    description: `Print the longest contiguous substring that is a palindrome. If several have the same maximum length, print the one that starts first.

Input format:
- A single word (letters and digits)

Output format:
- The longest palindromic substring

Constraints:
- 1 ≤ length ≤ 1000`,
    visible: [
      { s: 'babad', expect: 'bab', explanation: '"bab" and "aba" both have length 3; "bab" starts first.' },
      { s: 'cbbd', expect: 'bb', explanation: 'The longest palindrome has length 2.' },
    ],
    hidden: [{ s: 'a' }, { s: 'ac' }, { s: 'racecar' }, { s: 'aaaa' }, { s: 'abacdfgdcaba' }],
    generate: (r) => [{ s: r.word(30, 'ab') }, { s: r.word(60, 'abc') }, { s: r.word(1000, 'ab') }, { s: r.word(1000, 'abcdefghij') }],
    brute: ({ s }) => {
      let best = s[0];
      for (let i = 0; i < s.length; i++)
        for (let j = i + best.length; j < s.length; j++) {
          const sub = s.slice(i, j + 1);
          if (sub === sub.split('').reverse().join('') && sub.length > best.length) best = sub;
        }
      return best;
    },
    bruteLimit: small(80),
    solution: {
      cpp: {
        body: `int bestStart = 0, bestLen = 1, len = s.size();
for (int center = 0; center < 2 * len - 1; center++) {
    int lo = center / 2, hi = lo + center % 2;
    while (lo >= 0 && hi < len && s[lo] == s[hi]) { lo--; hi++; }
    int found = hi - lo - 1;
    if (found > bestLen || (found == bestLen && lo + 1 < bestStart)) { bestLen = found; bestStart = lo + 1; }
}
cout << s.substr(bestStart, bestLen) << "\\n";`,
      },
      java: {
        body: `int bestStart = 0, bestLen = 1, len = s.length();
for (int center = 0; center < 2 * len - 1; center++) {
    int lo = center / 2, hi = lo + center % 2;
    while (lo >= 0 && hi < len && s.charAt(lo) == s.charAt(hi)) { lo--; hi++; }
    int found = hi - lo - 1;
    if (found > bestLen || (found == bestLen && lo + 1 < bestStart)) { bestLen = found; bestStart = lo + 1; }
}
System.out.println(s.substring(bestStart, bestStart + bestLen));`,
      },
      js: {
        body: `let bestStart = 0;
let bestLen = 1;
const len = s.length;
for (let center = 0; center < 2 * len - 1; center++) {
  let lo = center >> 1;
  let hi = lo + (center % 2);
  while (lo >= 0 && hi < len && s[lo] === s[hi]) { lo--; hi++; }
  const found = hi - lo - 1;
  if (found > bestLen || (found === bestLen && lo + 1 < bestStart)) { bestLen = found; bestStart = lo + 1; }
}
console.log(s.slice(bestStart, bestStart + bestLen));`,
      },
    },
  },

  {
    title: 'Daily Temperatures',
    difficulty: 'medium',
    tags: ['array', 'monotonic stack'],
    companies: ['Meta', 'Amazon'],
    shape: 'arr',
    description: `For each day, print how many days you have to wait for a warmer temperature. Print 0 if no warmer day comes.

Input format:
- Line 1: n
- Line 2: n temperatures

Output format:
- n waits, space-separated

Constraints:
- 1 ≤ n ≤ 10⁵
- 30 ≤ temperature ≤ 100`,
    visible: [
      { arr: [73, 74, 75, 71, 69, 72, 76, 73], expect: '1 1 4 2 1 1 0 0', explanation: 'After 75 (day 2) the next warmer day is 76 on day 6, a wait of 4.' },
      { arr: [30, 40, 50, 60], expect: '1 1 1 0', explanation: 'Each day is warmer than the one before.' },
    ],
    hidden: [{ arr: [50] }, { arr: [60, 50, 40] }, { arr: [30, 60, 90] }],
    generate: (r) => [{ arr: r.array(200, 30, 100) }, { arr: r.array(10000, 30, 100) }],
    brute: ({ arr }) => arr.map((t, i) => { for (let j = i + 1; j < arr.length; j++) if (arr[j] > t) return j - i; return 0; }).join(' '),
    bruteLimit: small(500),
    solution: {
      cpp: {
        body: `vector<int> ans(n, 0), st;
for (int i = 0; i < n; i++) {
    while (!st.empty() && arr[st.back()] < arr[i]) { ans[st.back()] = i - st.back(); st.pop_back(); }
    st.push_back(i);
}
for (int i = 0; i < n; i++) cout << ans[i] << (i + 1 < n ? " " : "\\n");`,
      },
      java: {
        body: `int[] ans = new int[n];
int[] st = new int[n];
int top = 0;
for (int i = 0; i < n; i++) {
    while (top > 0 && arr[st[top - 1]] < arr[i]) { int j = st[--top]; ans[j] = i - j; }
    st[top++] = i;
}
StringBuilder sb = new StringBuilder();
for (int i = 0; i < n; i++) sb.append(ans[i]).append(i + 1 < n ? " " : "");
System.out.println(sb);`,
      },
      js: {
        body: `const ans = new Array(n).fill(0);
const st = [];
for (let i = 0; i < n; i++) {
  while (st.length && arr[st[st.length - 1]] < arr[i]) {
    const j = st.pop();
    ans[j] = i - j;
  }
  st.push(i);
}
console.log(ans.join(' '));`,
      },
    },
  },

  {
    title: 'Spiral Matrix',
    difficulty: 'medium',
    tags: ['array', 'matrix', 'simulation'],
    companies: ['Microsoft', 'Apple'],
    shape: 'matrix',
    description: `Print all elements of the matrix in clockwise spiral order, starting from the top-left corner.

Input format:
- Line 1: r c
- Next r lines: c integers each

Output format:
- r × c values, space-separated

Constraints:
- 1 ≤ r, c ≤ 100`,
    visible: [
      { grid: [[1, 2, 3], [4, 5, 6], [7, 8, 9]], expect: '1 2 3 6 9 8 7 4 5', explanation: 'Right along the top, down the right side, left along the bottom, then up and into the middle.' },
      { grid: [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]], expect: '1 2 3 4 8 12 11 10 9 5 6 7', explanation: 'The inner row 6 7 is visited last.' },
    ],
    hidden: [{ grid: [[7]] }, { grid: [[1, 2, 3]] }, { grid: [[1], [2], [3]] }, { grid: [[1, 2], [3, 4]] }],
    generate: (r) => [{ grid: Array.from({ length: 5 }, () => r.array(8, -9, 9)) }, { grid: Array.from({ length: 9 }, () => r.array(4, 0, 99)) }, { grid: Array.from({ length: 100 }, () => r.array(100, -1000, 1000)) }],
    brute: ({ grid }) => {
      // Walk with a direction vector, turning right at walls or visited cells
      const R = grid.length;
      const C = grid[0].length;
      const seen = grid.map((row) => row.map(() => false));
      const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
      const out = [];
      let x = 0;
      let y = 0;
      let d = 0;
      for (let step = 0; step < R * C; step++) {
        out.push(grid[x][y]);
        seen[x][y] = true;
        const nx = x + dirs[d][0];
        const ny = y + dirs[d][1];
        if (nx < 0 || ny < 0 || nx >= R || ny >= C || seen[nx][ny]) d = (d + 1) % 4;
        x += dirs[d][0];
        y += dirs[d][1];
      }
      return out.join(' ');
    },
    solution: {
      cpp: {
        body: `vector<long long> out;
int top = 0, bottom = r - 1, left = 0, right = c - 1;
while (top <= bottom && left <= right) {
    for (int j = left; j <= right; j++) out.push_back(grid[top][j]);
    for (int i = top + 1; i <= bottom; i++) out.push_back(grid[i][right]);
    if (top < bottom) for (int j = right - 1; j >= left; j--) out.push_back(grid[bottom][j]);
    if (left < right) for (int i = bottom - 1; i > top; i--) out.push_back(grid[i][left]);
    top++; bottom--; left++; right--;
}
for (size_t i = 0; i < out.size(); i++) cout << out[i] << (i + 1 < out.size() ? " " : "\\n");`,
      },
      java: {
        body: `StringBuilder sb = new StringBuilder();
int top = 0, bottom = r - 1, left = 0, right = c - 1;
while (top <= bottom && left <= right) {
    for (int j = left; j <= right; j++) sb.append(grid[top][j]).append(' ');
    for (int i = top + 1; i <= bottom; i++) sb.append(grid[i][right]).append(' ');
    if (top < bottom) for (int j = right - 1; j >= left; j--) sb.append(grid[bottom][j]).append(' ');
    if (left < right) for (int i = bottom - 1; i > top; i--) sb.append(grid[i][left]).append(' ');
    top++; bottom--; left++; right--;
}
System.out.println(sb.toString().trim());`,
      },
      js: {
        body: `const out = [];
let top = 0;
let bottom = r - 1;
let left = 0;
let right = c - 1;
while (top <= bottom && left <= right) {
  for (let j = left; j <= right; j++) out.push(grid[top][j]);
  for (let i = top + 1; i <= bottom; i++) out.push(grid[i][right]);
  if (top < bottom) for (let j = right - 1; j >= left; j--) out.push(grid[bottom][j]);
  if (left < right) for (let i = bottom - 1; i > top; i--) out.push(grid[i][left]);
  top++; bottom--; left++; right--;
}
console.log(out.join(' '));`,
      },
    },
  },

  {
    title: 'Decode Ways',
    difficulty: 'medium',
    tags: ['string', 'dynamic programming'],
    companies: ['Meta', 'Google'],
    shape: 'str',
    description: `Letters are encoded as numbers: A → 1, B → 2, …, Z → 26. Given a string of digits, print how many ways it can be decoded back into letters. A part with a leading zero (like "06") is not valid.

Input format:
- A single string of digits

Output format:
- The number of decodings (0 if none)

Constraints:
- 1 ≤ length ≤ 40`,
    visible: [
      { s: '12', expect: '2', explanation: '"AB" (1 2) or "L" (12).' },
      { s: '226', expect: '3', explanation: '"BZ" (2 26), "VF" (22 6) or "BBF" (2 2 6).' },
      { s: '06', expect: '0', explanation: '"06" cannot be read as 6, and 0 alone maps to nothing.' },
    ],
    hidden: [{ s: '0' }, { s: '10' }, { s: '100' }, { s: '27' }, { s: '11106' }, { s: '2101' }],
    generate: (r) => [{ s: r.word(15, '0123456789') }, { s: r.word(18, '1212126') }, { s: r.word(40, '12') }, { s: r.word(40, '1203') }],
    brute: ({ s }) => {
      const go = (i) => {
        if (i === s.length) return 1;
        if (s[i] === '0') return 0;
        let ways = go(i + 1);
        if (i + 1 < s.length && Number(s.slice(i, i + 2)) <= 26) ways += go(i + 2);
        return ways;
      };
      return go(0);
    },
    bruteLimit: small(22),
    solution: {
      cpp: {
        body: `int len = s.size();
vector<long long> dp(len + 1, 0);
dp[len] = 1;
for (int i = len - 1; i >= 0; i--) {
    if (s[i] == '0') continue;
    dp[i] = dp[i + 1];
    if (i + 1 < len && (s[i] - '0') * 10 + (s[i + 1] - '0') <= 26) dp[i] += dp[i + 2];
}
cout << dp[0] << "\\n";`,
      },
      java: {
        body: `int len = s.length();
long[] dp = new long[len + 1];
dp[len] = 1;
for (int i = len - 1; i >= 0; i--) {
    if (s.charAt(i) == '0') continue;
    dp[i] = dp[i + 1];
    if (i + 1 < len && (s.charAt(i) - '0') * 10 + (s.charAt(i + 1) - '0') <= 26) dp[i] += dp[i + 2];
}
System.out.println(dp[0]);`,
      },
      js: {
        body: `const len = s.length;
const dp = new Array(len + 1).fill(0);
dp[len] = 1;
for (let i = len - 1; i >= 0; i--) {
  if (s[i] === '0') continue;
  dp[i] = dp[i + 1];
  if (i + 1 < len && Number(s.slice(i, i + 2)) <= 26) dp[i] += dp[i + 2];
}
console.log(dp[0]);`,
      },
    },
  },

  {
    title: 'Longest Common Subsequence',
    difficulty: 'medium',
    tags: ['string', 'dynamic programming'],
    companies: ['Amazon', 'Google'],
    shape: 'twoStr',
    description: `Print the length of the longest subsequence common to both words (characters in order, not necessarily adjacent).

Input format:
- Line 1: s
- Line 2: t

Output format:
- The length

Constraints:
- 1 ≤ length of s, t ≤ 1000
- Only lowercase English letters`,
    visible: [
      { s: 'abcde', t: 'ace', expect: '3', explanation: '"ace" is a subsequence of both.' },
      { s: 'abc', t: 'def', expect: '0', explanation: 'The words share no letters.' },
    ],
    hidden: [{ s: 'a', t: 'a' }, { s: 'abc', t: 'abc' }, { s: 'bsbininm', t: 'jmjkbkjkv' }, { s: 'oxcpqrsvwf', t: 'shmtulqrypy' }],
    generate: (r) => [{ s: r.word(12, 'abc'), t: r.word(10, 'abc') }, { s: r.word(300, 'abcd'), t: r.word(400, 'abcd') }, { s: r.word(1000), t: r.word(1000) }],
    brute: ({ s, t }) => {
      // Memoized recursion from the front (solutions fill a table from the back)
      const memo = new Map();
      const go = (i, j) => {
        if (i === s.length || j === t.length) return 0;
        const key = i * 2048 + j;
        if (memo.has(key)) return memo.get(key);
        const v = s[i] === t[j] ? 1 + go(i + 1, j + 1) : Math.max(go(i + 1, j), go(i, j + 1));
        memo.set(key, v);
        return v;
      };
      return go(0, 0);
    },
    bruteLimit: (c) => c.s.length * c.t.length <= 20000,
    solution: {
      cpp: {
        body: `int a = s.size(), b = t.size();
vector<vector<int>> dp(a + 1, vector<int>(b + 1, 0));
for (int i = a - 1; i >= 0; i--)
    for (int j = b - 1; j >= 0; j--)
        dp[i][j] = s[i] == t[j] ? 1 + dp[i + 1][j + 1] : max(dp[i + 1][j], dp[i][j + 1]);
cout << dp[0][0] << "\\n";`,
      },
      java: {
        body: `int a = s.length(), b = t.length();
int[][] dp = new int[a + 1][b + 1];
for (int i = a - 1; i >= 0; i--)
    for (int j = b - 1; j >= 0; j--)
        dp[i][j] = s.charAt(i) == t.charAt(j) ? 1 + dp[i + 1][j + 1] : Math.max(dp[i + 1][j], dp[i][j + 1]);
System.out.println(dp[0][0]);`,
      },
      js: {
        body: `const a = s.length;
const b = t.length;
const dp = Array.from({ length: a + 1 }, () => new Array(b + 1).fill(0));
for (let i = a - 1; i >= 0; i--)
  for (let j = b - 1; j >= 0; j--) dp[i][j] = s[i] === t[j] ? 1 + dp[i + 1][j + 1] : Math.max(dp[i + 1][j], dp[i][j + 1]);
console.log(dp[0][0]);`,
      },
    },
  },

  {
    title: 'Edit Distance',
    difficulty: 'medium',
    tags: ['string', 'dynamic programming'],
    companies: ['Google', 'Amazon', 'Microsoft'],
    shape: 'twoStr',
    description: `Print the minimum number of single-character operations (insert, delete or replace) that turn word s into word t.

Input format:
- Line 1: s
- Line 2: t

Output format:
- The minimum number of operations

Constraints:
- 1 ≤ length of s, t ≤ 500
- Only lowercase English letters`,
    visible: [
      { s: 'horse', t: 'ros', expect: '3', explanation: 'horse → rorse (replace h) → rose (delete r) → ros (delete e).' },
      { s: 'intention', t: 'execution', expect: '5', explanation: 'Five edits are needed; no shorter sequence exists.' },
    ],
    hidden: [{ s: 'a', t: 'a' }, { s: 'a', t: 'b' }, { s: 'abc', t: 'yabd' }, { s: 'kitten', t: 'sitting' }],
    generate: (r) => [{ s: r.word(8, 'abc'), t: r.word(7, 'abc') }, { s: r.word(200, 'abcd'), t: r.word(180, 'abcd') }, { s: r.word(500), t: r.word(500) }],
    brute: ({ s, t }) => {
      const memo = new Map();
      const go = (i, j) => {
        if (i === s.length) return t.length - j;
        if (j === t.length) return s.length - i;
        const key = i * 1024 + j;
        if (memo.has(key)) return memo.get(key);
        const v = s[i] === t[j] ? go(i + 1, j + 1) : 1 + Math.min(go(i + 1, j), go(i, j + 1), go(i + 1, j + 1));
        memo.set(key, v);
        return v;
      };
      return go(0, 0);
    },
    bruteLimit: (c) => c.s.length * c.t.length <= 40000,
    solution: {
      cpp: {
        body: `int a = s.size(), b = t.size();
vector<int> prev(b + 1), cur(b + 1);
for (int j = 0; j <= b; j++) prev[j] = j;
for (int i = 1; i <= a; i++) {
    cur[0] = i;
    for (int j = 1; j <= b; j++)
        cur[j] = s[i - 1] == t[j - 1] ? prev[j - 1] : 1 + min({prev[j], cur[j - 1], prev[j - 1]});
    swap(prev, cur);
}
cout << prev[b] << "\\n";`,
      },
      java: {
        body: `int a = s.length(), b = t.length();
int[] prev = new int[b + 1], cur = new int[b + 1];
for (int j = 0; j <= b; j++) prev[j] = j;
for (int i = 1; i <= a; i++) {
    cur[0] = i;
    for (int j = 1; j <= b; j++)
        cur[j] = s.charAt(i - 1) == t.charAt(j - 1) ? prev[j - 1] : 1 + Math.min(prev[j], Math.min(cur[j - 1], prev[j - 1]));
    int[] tmp = prev; prev = cur; cur = tmp;
}
System.out.println(prev[b]);`,
      },
      js: {
        body: `const a = s.length;
const b = t.length;
let prev = Array.from({ length: b + 1 }, (_, j) => j);
for (let i = 1; i <= a; i++) {
  const cur = [i];
  for (let j = 1; j <= b; j++) cur[j] = s[i - 1] === t[j - 1] ? prev[j - 1] : 1 + Math.min(prev[j], cur[j - 1], prev[j - 1]);
  prev = cur;
}
console.log(prev[b]);`,
      },
    },
  },

  {
    title: 'Partition Equal Subset Sum',
    difficulty: 'medium',
    tags: ['dynamic programming', 'array'],
    companies: ['Meta', 'Amazon'],
    shape: 'arr',
    description: `Print true if the array can be split into two groups with equal sums, otherwise false.

Input format:
- Line 1: n
- Line 2: n positive integers

Output format:
- true or false

Constraints:
- 1 ≤ n ≤ 200
- 1 ≤ values ≤ 100`,
    visible: [
      { arr: [1, 5, 11, 5], expect: 'true', explanation: '1 + 5 + 5 = 11, matching the other group (11).' },
      { arr: [1, 2, 3, 5], expect: 'false', explanation: 'The total is 11, which is odd, so equal halves are impossible.' },
    ],
    hidden: [{ arr: [1] }, { arr: [2, 2] }, { arr: [1, 2, 5] }, { arr: [3, 3, 3, 4, 5] }],
    generate: (r) => [{ arr: r.array(10, 1, 20) }, { arr: r.array(16, 1, 50) }, { arr: r.array(200, 1, 100) }, { arr: [...r.array(199, 1, 100).map((v) => v * 2), 1] }],
    brute: ({ arr }) => {
      const total = arr.reduce((a, b) => a + b, 0);
      if (total % 2) return 'false';
      for (let mask = 0; mask < 1 << arr.length; mask++) {
        let sum = 0;
        for (let i = 0; i < arr.length; i++) if (mask & (1 << i)) sum += arr[i];
        if (sum * 2 === total) return 'true';
      }
      return 'false';
    },
    bruteLimit: small(18),
    solution: {
      cpp: {
        body: `long long total = 0;
for (auto x : arr) total += x;
bool ok = false;
if (total % 2 == 0) {
    int half = total / 2;
    vector<bool> can(half + 1, false);
    can[0] = true;
    for (auto x : arr)
        for (int s = half; s >= x; s--) if (can[s - x]) can[s] = true;
    ok = can[half];
}
cout << ${yesNo.cpp} << "\\n";`,
      },
      java: {
        body: `long total = 0;
for (long x : arr) total += x;
boolean ok = false;
if (total % 2 == 0) {
    int half = (int) (total / 2);
    boolean[] can = new boolean[half + 1];
    can[0] = true;
    for (long x : arr)
        for (int s = half; s >= x; s--) if (can[s - (int) x]) can[s] = true;
    ok = can[half];
}
System.out.println(${yesNo.java});`,
      },
      js: {
        body: `const total = arr.reduce((a, b) => a + b, 0);
let ok = false;
if (total % 2 === 0) {
  const half = total / 2;
  const can = new Array(half + 1).fill(false);
  can[0] = true;
  for (const x of arr) for (let s = half; s >= x; s--) if (can[s - x]) can[s] = true;
  ok = can[half];
}
console.log(${yesNo.js});`,
      },
    },
  },

  {
    title: 'Sort Colors',
    difficulty: 'medium',
    tags: ['array', 'two pointers', 'sorting'],
    companies: ['Microsoft', 'Amazon'],
    shape: 'arr',
    description: `The array holds only 0s, 1s and 2s (red, white and blue). Sort it in one pass without a library sort, and print it.

Input format:
- Line 1: n
- Line 2: n values, each 0, 1 or 2

Output format:
- The sorted array, space-separated

Constraints:
- 1 ≤ n ≤ 10⁵`,
    visible: [
      { arr: [2, 0, 2, 1, 1, 0], expect: '0 0 1 1 2 2', explanation: 'All 0s, then 1s, then 2s.' },
      { arr: [2, 0, 1], expect: '0 1 2', explanation: 'One of each.' },
    ],
    hidden: [{ arr: [0] }, { arr: [2, 2] }, { arr: [1, 0] }],
    generate: (r) => [{ arr: r.array(100, 0, 2) }, { arr: r.array(10000, 0, 2) }],
    brute: ({ arr }) => [...arr].sort((a, b) => a - b).join(' '),
    solution: {
      cpp: {
        body: `int lo = 0, mid = 0, hi = n - 1;
while (mid <= hi) {
    if (arr[mid] == 0) swap(arr[lo++], arr[mid++]);
    else if (arr[mid] == 1) mid++;
    else swap(arr[mid], arr[hi--]);
}
for (int i = 0; i < n; i++) cout << arr[i] << (i + 1 < n ? " " : "\\n");`,
      },
      java: {
        body: `int lo = 0, mid = 0, hi = n - 1;
while (mid <= hi) {
    if (arr[mid] == 0) { long t = arr[lo]; arr[lo++] = arr[mid]; arr[mid++] = t; }
    else if (arr[mid] == 1) mid++;
    else { long t = arr[mid]; arr[mid] = arr[hi]; arr[hi--] = t; }
}
StringBuilder sb = new StringBuilder();
for (int i = 0; i < n; i++) sb.append(arr[i]).append(i + 1 < n ? " " : "");
System.out.println(sb);`,
      },
      js: {
        body: `let lo = 0;
let mid = 0;
let hi = n - 1;
while (mid <= hi) {
  if (arr[mid] === 0) { [arr[lo], arr[mid]] = [arr[mid], arr[lo]]; lo++; mid++; }
  else if (arr[mid] === 1) mid++;
  else { [arr[mid], arr[hi]] = [arr[hi], arr[mid]]; hi--; }
}
console.log(arr.join(' '));`,
      },
    },
  },

  {
    title: 'Minimum Path Sum',
    difficulty: 'medium',
    tags: ['dynamic programming', 'matrix'],
    companies: ['Goldman Sachs', 'Amazon'],
    shape: 'matrix',
    description: `Moving only right or down, find a path from the top-left to the bottom-right cell that minimises the sum of the numbers along it. Print that sum.

Input format:
- Line 1: r c
- Next r lines: c non-negative integers

Output format:
- The minimum path sum

Constraints:
- 1 ≤ r, c ≤ 200
- 0 ≤ values ≤ 200`,
    visible: [
      { grid: [[1, 3, 1], [1, 5, 1], [4, 2, 1]], expect: '7', explanation: 'The path 1 → 3 → 1 → 1 → 1 sums to 7.' },
      { grid: [[1, 2, 3], [4, 5, 6]], expect: '12', explanation: '1 → 2 → 3 → 6.' },
    ],
    hidden: [{ grid: [[5]] }, { grid: [[1, 2]] }, { grid: [[1], [9]] }, { grid: [[0, 0], [0, 0]] }],
    generate: (r) => [{ grid: Array.from({ length: 5 }, () => r.array(6, 0, 9)) }, { grid: Array.from({ length: 7 }, () => r.array(5, 0, 200)) }, { grid: Array.from({ length: 120 }, () => r.array(120, 0, 200)) }],
    brute: ({ grid }) => {
      const R = grid.length;
      const C = grid[0].length;
      const go = (i, j) => {
        if (i === R - 1 && j === C - 1) return grid[i][j];
        if (i === R - 1) return grid[i][j] + go(i, j + 1);
        if (j === C - 1) return grid[i][j] + go(i + 1, j);
        return grid[i][j] + Math.min(go(i + 1, j), go(i, j + 1));
      };
      return go(0, 0);
    },
    bruteLimit: (c) => c.grid.length + c.grid[0].length <= 14,
    solution: {
      cpp: {
        body: `vector<long long> dp(c, 0);
for (int i = 0; i < r; i++)
    for (int j = 0; j < c; j++) {
        if (i == 0 && j == 0) dp[j] = grid[0][0];
        else if (i == 0) dp[j] = dp[j - 1] + grid[i][j];
        else if (j == 0) dp[j] = dp[j] + grid[i][j];
        else dp[j] = min(dp[j], dp[j - 1]) + grid[i][j];
    }
cout << dp[c - 1] << "\\n";`,
      },
      java: {
        body: `long[] dp = new long[c];
for (int i = 0; i < r; i++)
    for (int j = 0; j < c; j++) {
        if (i == 0 && j == 0) dp[j] = grid[0][0];
        else if (i == 0) dp[j] = dp[j - 1] + grid[i][j];
        else if (j == 0) dp[j] = dp[j] + grid[i][j];
        else dp[j] = Math.min(dp[j], dp[j - 1]) + grid[i][j];
    }
System.out.println(dp[c - 1]);`,
      },
      js: {
        body: `const dp = new Array(c).fill(0);
for (let i = 0; i < r; i++)
  for (let j = 0; j < c; j++) {
    if (i === 0 && j === 0) dp[j] = grid[0][0];
    else if (i === 0) dp[j] = dp[j - 1] + grid[i][j];
    else if (j === 0) dp[j] += grid[i][j];
    else dp[j] = Math.min(dp[j], dp[j - 1]) + grid[i][j];
  }
console.log(dp[c - 1]);`,
      },
    },
  },
];
