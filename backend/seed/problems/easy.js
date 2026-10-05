// Easy problems. Each solution body runs after the shape's input code (see shapes.js).

const yesNo = { cpp: '(ok ? "true" : "false")', java: '(ok ? "true" : "false")', js: "(ok ? 'true' : 'false')" };

export const EASY = [
  {
    title: 'Two Sum',
    difficulty: 'easy',
    tags: ['array', 'hash map'],
    companies: ['Google', 'Amazon', 'Meta'],
    shape: 'arrK',
    description: `Given an array of integers and a target, find the two different positions whose values add up to the target. Exactly one such pair exists.

Input format:
- Line 1: n, the length of the array
- Line 2: n integers
- Line 3: the target

Output format:
- The two 0-based indices i and j (i < j), separated by a space

Constraints:
- 2 ≤ n ≤ 10⁴
- -10⁹ ≤ values, target ≤ 10⁹
- Exactly one valid pair exists`,
    visible: [
      { arr: [2, 7, 11, 15], k: 9, expect: '0 1', explanation: 'arr[0] + arr[1] = 2 + 7 = 9.' },
      { arr: [3, 2, 4], k: 6, expect: '1 2', explanation: 'arr[1] + arr[2] = 2 + 4 = 6. Using 3 twice is not allowed.' },
    ],
    hidden: [{ arr: [3, 3], k: 6 }, { arr: [-1, -2, -3, -4, -5], k: -8 }, { arr: [0, 4, 3, 0], k: 0 }],
    generate: (r) => {
      const cases = [];
      for (const n of [10, 50, 400, 5000]) {
        for (;;) {
          const arr = r.array(n, -1e6, 1e6);
          const i = r.int(0, n - 2);
          const j = r.int(i + 1, n - 1);
          const k = arr[i] + arr[j];
          // keep only inputs with exactly one valid pair
          const counts = new Map();
          let pairs = 0;
          for (const v of arr) {
            pairs += counts.get(k - v) || 0;
            counts.set(v, (counts.get(v) || 0) + 1);
          }
          if (pairs === 1) {
            cases.push({ arr, k });
            break;
          }
        }
      }
      return cases;
    },
    solution: {
      cpp: {
        body: `unordered_map<long long, int> seen;
for (int i = 0; i < n; i++) {
    auto it = seen.find(k - arr[i]);
    if (it != seen.end()) {
        cout << it->second << " " << i << "\\n";
        break;
    }
    if (!seen.count(arr[i])) seen[arr[i]] = i;
}`,
      },
      java: {
        body: `HashMap<Long, Integer> seen = new HashMap<>();
for (int i = 0; i < n; i++) {
    Integer j = seen.get(k - arr[i]);
    if (j != null) {
        System.out.println(j + " " + i);
        break;
    }
    seen.putIfAbsent(arr[i], i);
}`,
      },
      js: {
        body: `const seen = new Map();
for (let i = 0; i < n; i++) {
  if (seen.has(k - arr[i])) {
    console.log(seen.get(k - arr[i]) + ' ' + i);
    break;
  }
  if (!seen.has(arr[i])) seen.set(arr[i], i);
}`,
      },
    },
  },

  {
    title: 'Contains Duplicate',
    difficulty: 'easy',
    tags: ['array', 'hash set'],
    companies: ['Amazon', 'Apple'],
    shape: 'arr',
    description: `Given an array of integers, print true if any value appears at least twice, and false if every value is distinct.

Input format:
- Line 1: n
- Line 2: n integers

Output format:
- true or false

Constraints:
- 1 ≤ n ≤ 10⁵
- -10⁹ ≤ values ≤ 10⁹`,
    visible: [
      { arr: [1, 2, 3, 1], expect: 'true', explanation: '1 appears at positions 0 and 3.' },
      { arr: [1, 2, 3, 4], expect: 'false', explanation: 'All four values are different.' },
    ],
    hidden: [{ arr: [7] }, { arr: [1, 1, 1, 3, 3, 4, 3, 2, 4, 2] }, { arr: [-5, 5] }],
    generate: (r) => [
      { arr: r.shuffle(Array.from({ length: 2000 }, (_, i) => i * 3 - 1000)) },
      { arr: r.array(3000, -1e9, 1e9).concat([42, 42]) },
      { arr: r.shuffle(Array.from({ length: 10000 }, (_, i) => i)) },
    ],
    solution: {
      cpp: { body: `unordered_set<long long> seen;\nbool ok = false;\nfor (auto x : arr) {\n    if (!seen.insert(x).second) { ok = true; break; }\n}\ncout << ${yesNo.cpp} << "\\n";` },
      java: { body: `HashSet<Long> seen = new HashSet<>();\nboolean ok = false;\nfor (long x : arr) {\n    if (!seen.add(x)) { ok = true; break; }\n}\nSystem.out.println(${yesNo.java});` },
      js: { body: `const ok = new Set(arr).size !== arr.length;\nconsole.log(${yesNo.js});` },
    },
  },

  {
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'easy',
    tags: ['array', 'greedy'],
    companies: ['Amazon', 'Goldman Sachs'],
    shape: 'arr',
    description: `prices[i] is a stock's price on day i. Choose one day to buy and a later day to sell. Print the maximum profit you can make, or 0 if no profit is possible.

Input format:
- Line 1: n, the number of days
- Line 2: n prices

Output format:
- The maximum profit

Constraints:
- 1 ≤ n ≤ 10⁵
- 0 ≤ prices[i] ≤ 10⁴`,
    visible: [
      { arr: [7, 1, 5, 3, 6, 4], expect: '5', explanation: 'Buy on day 1 (price 1) and sell on day 4 (price 6): 6 − 1 = 5.' },
      { arr: [7, 6, 4, 3, 1], expect: '0', explanation: 'Prices only fall, so the best is not to trade.' },
    ],
    hidden: [{ arr: [5] }, { arr: [1, 2] }, { arr: [2, 4, 1] }],
    generate: (r) => [{ arr: r.array(100, 0, 100) }, { arr: r.array(5000, 0, 10000) }, { arr: r.array(10000, 0, 10000) }],
    solution: {
      cpp: { body: `long long best = 0, low = arr[0];\nfor (auto p : arr) {\n    low = min(low, p);\n    best = max(best, p - low);\n}\ncout << best << "\\n";` },
      java: { body: `long best = 0, low = arr[0];\nfor (long p : arr) {\n    low = Math.min(low, p);\n    best = Math.max(best, p - low);\n}\nSystem.out.println(best);` },
      js: { body: `let best = 0;\nlet low = arr[0];\nfor (const p of arr) {\n  low = Math.min(low, p);\n  best = Math.max(best, p - low);\n}\nconsole.log(best);` },
    },
  },

  {
    title: 'Valid Parentheses',
    difficulty: 'easy',
    tags: ['string', 'stack'],
    companies: ['Amazon', 'Microsoft', 'Bloomberg'],
    shape: 'str',
    description: `A string contains only the characters ( ) [ ] { }. It is valid when every opening bracket is closed by the same type of bracket, in the correct order. Print true if the string is valid, otherwise false.

Input format:
- A single line with the string

Output format:
- true or false

Constraints:
- 1 ≤ length ≤ 10⁴`,
    visible: [
      { s: '()[]{}', expect: 'true', explanation: 'Each pair opens and closes in order.' },
      { s: '([)]', expect: 'false', explanation: '[ is closed by ) before it is closed by ].' },
    ],
    hidden: [{ s: '(' }, { s: ']' }, { s: '{[]}' }, { s: '(((((())))))' }, { s: '(()' }],
    generate: (r) => {
      const balanced = (len) => {
        let out = '';
        const stack = [];
        while (out.length + stack.length < len) {
          if (stack.length && r.rand() < 0.45) out += stack.pop();
          else {
            const k = r.int(0, 2);
            out += '([{'[k];
            stack.push(')]}'[k]);
          }
        }
        return out + stack.reverse().join('');
      };
      const b = balanced(5000);
      return [{ s: balanced(40) }, { s: b }, { s: b.slice(0, -1) + (b.endsWith(')') ? ']' : ')') }];
    },
    solution: {
      cpp: {
        body: `string st;
bool ok = true;
for (char ch : s) {
    if (ch == '(' || ch == '[' || ch == '{') st.push_back(ch);
    else {
        char want = ch == ')' ? '(' : ch == ']' ? '[' : '{';
        if (st.empty() || st.back() != want) { ok = false; break; }
        st.pop_back();
    }
}
if (!st.empty()) ok = false;
cout << ${yesNo.cpp} << "\\n";`,
      },
      java: {
        body: `StringBuilder st = new StringBuilder();
boolean ok = true;
for (char ch : s.toCharArray()) {
    if (ch == '(' || ch == '[' || ch == '{') st.append(ch);
    else {
        char want = ch == ')' ? '(' : ch == ']' ? '[' : '{';
        if (st.length() == 0 || st.charAt(st.length() - 1) != want) { ok = false; break; }
        st.setLength(st.length() - 1);
    }
}
if (st.length() != 0) ok = false;
System.out.println(${yesNo.java});`,
      },
      js: {
        body: `const pairs = { ')': '(', ']': '[', '}': '{' };
const st = [];
let ok = true;
for (const ch of s) {
  if ('([{'.includes(ch)) st.push(ch);
  else if (!st.length || st.pop() !== pairs[ch]) {
    ok = false;
    break;
  }
}
if (st.length) ok = false;
console.log(${yesNo.js});`,
      },
    },
  },

  {
    title: 'Valid Anagram',
    difficulty: 'easy',
    tags: ['string', 'hash map', 'sorting'],
    companies: ['Amazon', 'Uber'],
    shape: 'twoStr',
    description: `Given two lowercase words s and t, print true if t is an anagram of s (uses exactly the same letters the same number of times), otherwise false.

Input format:
- Line 1: s
- Line 2: t

Output format:
- true or false

Constraints:
- 1 ≤ length of s, t ≤ 5 × 10⁴
- Only lowercase English letters`,
    visible: [
      { s: 'anagram', t: 'nagaram', expect: 'true', explanation: 'Both words use a×3, n, g, r, m.' },
      { s: 'rat', t: 'car', expect: 'false', explanation: 't has a c where s has a t.' },
    ],
    hidden: [{ s: 'a', t: 'a' }, { s: 'ab', t: 'a' }, { s: 'aacc', t: 'ccac' }],
    generate: (r) => {
      const w = r.word(10000);
      return [
        { s: w, t: r.shuffle([...w]).join('') },
        { s: w, t: r.shuffle([...w]).join('').slice(1) + 'z' },
        { s: r.word(100, 'ab'), t: r.word(100, 'ab') },
      ];
    },
    solution: {
      cpp: { body: `vector<int> cnt(26, 0);\nfor (char ch : s) cnt[ch - 'a']++;\nfor (char ch : t) cnt[ch - 'a']--;\nbool ok = s.size() == t.size();\nfor (int x : cnt) if (x != 0) ok = false;\ncout << ${yesNo.cpp} << "\\n";` },
      java: { body: `int[] cnt = new int[26];\nfor (char ch : s.toCharArray()) cnt[ch - 'a']++;\nfor (char ch : t.toCharArray()) cnt[ch - 'a']--;\nboolean ok = s.length() == t.length();\nfor (int x : cnt) if (x != 0) ok = false;\nSystem.out.println(${yesNo.java});` },
      js: { body: `const cnt = new Array(26).fill(0);\nfor (const ch of s) cnt[ch.charCodeAt(0) - 97]++;\nfor (const ch of t) cnt[ch.charCodeAt(0) - 97]--;\nconst ok = s.length === t.length && cnt.every((x) => x === 0);\nconsole.log(${yesNo.js});` },
    },
  },

  {
    title: 'Palindrome Number',
    difficulty: 'easy',
    tags: ['math'],
    companies: ['Adobe'],
    shape: 'int',
    description: `Given an integer x, print true if it reads the same forwards and backwards, otherwise false. Negative numbers are never palindromes because of the minus sign.

Input format:
- A single integer x

Output format:
- true or false

Constraints:
- -2³¹ ≤ x ≤ 2³¹ − 1`,
    visible: [
      { n: 121, expect: 'true', explanation: '121 reversed is 121.' },
      { n: -121, expect: 'false', explanation: 'Reversed it reads 121-, which is different.' },
      { n: 10, expect: 'false', explanation: 'Reversed it reads 01.' },
    ],
    hidden: [{ n: 0 }, { n: 7 }, { n: 1221 }, { n: 2147447412 }, { n: 2147483647 }, { n: -2147483648 }],
    generate: (r) => [{ n: 12344321 }, { n: r.int(1, 1e9) }, { n: 1000000001 }],
    solution: {
      cpp: { body: `string a = to_string(n);\nstring b(a.rbegin(), a.rend());\nbool ok = n >= 0 && a == b;\ncout << ${yesNo.cpp} << "\\n";` },
      java: { body: `String a = Long.toString(n);\nboolean ok = n >= 0 && a.equals(new StringBuilder(a).reverse().toString());\nSystem.out.println(${yesNo.java});` },
      js: { body: `const a = String(n);\nconst ok = n >= 0 && a === a.split('').reverse().join('');\nconsole.log(${yesNo.js});` },
    },
  },

  {
    title: 'Reverse String',
    difficulty: 'easy',
    tags: ['string', 'two pointers'],
    companies: ['Microsoft'],
    shape: 'str',
    description: `Print the given word with its characters in reverse order.

Input format:
- A single word (no spaces)

Output format:
- The reversed word

Constraints:
- 1 ≤ length ≤ 10⁵
- Printable ASCII characters, no spaces`,
    visible: [
      { s: 'hello', expect: 'olleh', explanation: 'Read the letters from the end: o, l, l, e, h.' },
      { s: 'Algorise', expect: 'esiroglA', explanation: 'Case is kept as is.' },
    ],
    hidden: [{ s: 'a' }, { s: 'ab' }, { s: 'racecar' }, { s: 'A1b2C3!' }],
    generate: (r) => [{ s: r.word(1000) }, { s: r.word(10000, 'abcXYZ0123') }],
    solution: {
      cpp: { body: `reverse(s.begin(), s.end());\ncout << s << "\\n";` },
      java: { body: `System.out.println(new StringBuilder(s).reverse().toString());` },
      js: { body: `console.log(s.split('').reverse().join(''));` },
    },
  },

  {
    title: 'Missing Number',
    difficulty: 'easy',
    tags: ['array', 'math'],
    companies: ['Amazon', 'Microsoft'],
    shape: 'arr',
    description: `An array holds n distinct numbers taken from the range 0..n, so exactly one number in that range is missing. Print it.

Input format:
- Line 1: n
- Line 2: n distinct integers between 0 and n

Output format:
- The missing number

Constraints:
- 1 ≤ n ≤ 10⁵`,
    visible: [
      { arr: [3, 0, 1], expect: '2', explanation: 'n = 3, so the range is 0..3 and 2 is missing.' },
      { arr: [9, 6, 4, 2, 3, 5, 7, 0, 1], expect: '8', explanation: 'The range is 0..9 and 8 is missing.' },
    ],
    hidden: [{ arr: [0] }, { arr: [1] }, { arr: [0, 1] }],
    generate: (r) =>
      [50, 1000, 10000].map((n) => {
        const missing = r.int(0, n);
        return { arr: r.shuffle(Array.from({ length: n + 1 }, (_, i) => i).filter((v) => v !== missing)) };
      }),
    solution: {
      cpp: { body: `long long total = (long long)n * (n + 1) / 2;\nfor (auto x : arr) total -= x;\ncout << total << "\\n";` },
      java: { body: `long total = (long) n * (n + 1) / 2;\nfor (long x : arr) total -= x;\nSystem.out.println(total);` },
      js: { body: `let total = (n * (n + 1)) / 2;\nfor (const x of arr) total -= x;\nconsole.log(total);` },
    },
  },

  {
    title: 'Single Number',
    difficulty: 'easy',
    tags: ['array', 'bit manipulation'],
    companies: ['Amazon', 'Palantir'],
    shape: 'arr',
    description: `Every value in the array appears exactly twice, except for one value that appears once. Print that value.

Input format:
- Line 1: n (always odd)
- Line 2: n integers

Output format:
- The value that appears once

Constraints:
- 1 ≤ n ≤ 3 × 10⁴ + 1
- -3 × 10⁴ ≤ values ≤ 3 × 10⁴`,
    visible: [
      { arr: [2, 2, 1], expect: '1', explanation: '2 appears twice, 1 appears once.' },
      { arr: [4, 1, 2, 1, 2], expect: '4', explanation: 'Only 4 has no partner.' },
    ],
    hidden: [{ arr: [1] }, { arr: [-7, 3, 3] }, { arr: [0, 5, 5, -1, -1] }],
    generate: (r) =>
      [11, 501, 9001].map((n) => {
        const pool = r.shuffle(Array.from({ length: 60001 }, (_, i) => i - 30000)).slice(0, (n + 1) / 2);
        const [single, ...rest] = pool;
        return { arr: r.shuffle([single, ...rest, ...rest]) };
      }),
    solution: {
      cpp: { body: `long long x = 0;\nfor (auto v : arr) x ^= v;\ncout << x << "\\n";` },
      java: { body: `long x = 0;\nfor (long v : arr) x ^= v;\nSystem.out.println(x);` },
      js: { body: `let x = 0;\nfor (const v of arr) x ^= v;\nconsole.log(x);` },
    },
  },

  {
    title: 'Move Zeroes',
    difficulty: 'easy',
    tags: ['array', 'two pointers'],
    companies: ['Meta', 'Bloomberg'],
    shape: 'arr',
    description: `Move every 0 in the array to the end while keeping the relative order of the non-zero values. Print the resulting array.

Input format:
- Line 1: n
- Line 2: n integers

Output format:
- The rearranged array, space-separated

Constraints:
- 1 ≤ n ≤ 10⁴
- -2³¹ ≤ values ≤ 2³¹ − 1`,
    visible: [
      { arr: [0, 1, 0, 3, 12], expect: '1 3 12 0 0', explanation: 'Non-zero values keep their order: 1, 3, 12. The two zeros go last.' },
      { arr: [0], expect: '0', explanation: 'A single zero stays where it is.' },
    ],
    hidden: [{ arr: [1, 2, 3] }, { arr: [0, 0, 1] }, { arr: [-1, 0, 0, -2, 0, 5] }],
    generate: (r) => [{ arr: r.array(200, -3, 3) }, { arr: r.array(9000, -1000, 1000).map((v) => (v % 4 === 0 ? 0 : v)) }],
    solution: {
      cpp: { body: `vector<long long> out;\nfor (auto x : arr) if (x != 0) out.push_back(x);\nwhile ((int)out.size() < n) out.push_back(0);\nfor (int i = 0; i < n; i++) cout << out[i] << (i + 1 < n ? " " : "\\n");` },
      java: {
        body: `StringBuilder sb = new StringBuilder();\nint zeros = 0;\nfor (long x : arr) {\n    if (x == 0) zeros++;\n    else sb.append(x).append(' ');\n}\nfor (int i = 0; i < zeros; i++) sb.append("0 ");\nSystem.out.println(sb.toString().trim());`,
      },
      js: { body: `const nonZero = arr.filter((x) => x !== 0);\nconsole.log(nonZero.concat(new Array(n - nonZero.length).fill(0)).join(' '));` },
    },
  },

  {
    title: 'Majority Element',
    difficulty: 'easy',
    tags: ['array', 'counting'],
    companies: ['Google', 'Adobe'],
    shape: 'arr',
    description: `Print the value that appears more than ⌊n / 2⌋ times. Such a value is guaranteed to exist.

Input format:
- Line 1: n
- Line 2: n integers

Output format:
- The majority value

Constraints:
- 1 ≤ n ≤ 5 × 10⁴
- -10⁹ ≤ values ≤ 10⁹`,
    visible: [
      { arr: [3, 2, 3], expect: '3', explanation: '3 appears 2 times, more than ⌊3 / 2⌋ = 1.' },
      { arr: [2, 2, 1, 1, 1, 2, 2], expect: '2', explanation: '2 appears 4 times out of 7.' },
    ],
    hidden: [{ arr: [1] }, { arr: [-5, -5] }, { arr: [6, 5, 5] }],
    generate: (r) =>
      [21, 999, 9001].map((n) => {
        const major = r.int(-1e9, 1e9);
        const count = Math.floor(n / 2) + 1 + r.int(0, Math.floor(n / 10));
        return { arr: r.shuffle([...new Array(count).fill(major), ...r.array(n - count, -1e9, 1e9)]) };
      }),
    solution: {
      cpp: { body: `long long cand = 0;\nint votes = 0;\nfor (auto x : arr) {\n    if (votes == 0) cand = x;\n    votes += (x == cand) ? 1 : -1;\n}\ncout << cand << "\\n";` },
      java: { body: `long cand = 0;\nint votes = 0;\nfor (long x : arr) {\n    if (votes == 0) cand = x;\n    votes += (x == cand) ? 1 : -1;\n}\nSystem.out.println(cand);` },
      js: { body: `let cand = 0;\nlet votes = 0;\nfor (const x of arr) {\n  if (votes === 0) cand = x;\n  votes += x === cand ? 1 : -1;\n}\nconsole.log(cand);` },
    },
  },

  {
    title: 'Climbing Stairs',
    difficulty: 'easy',
    tags: ['dynamic programming', 'math'],
    companies: ['Amazon', 'Adobe'],
    shape: 'int',
    description: `You are climbing a staircase with n steps. Each move climbs either 1 or 2 steps. Print the number of distinct ways to reach the top.

Input format:
- A single integer n

Output format:
- The number of ways

Constraints:
- 1 ≤ n ≤ 45`,
    visible: [
      { n: 2, expect: '2', explanation: '1 + 1, or 2.' },
      { n: 3, expect: '3', explanation: '1 + 1 + 1, 1 + 2, or 2 + 1.' },
    ],
    hidden: [{ n: 1 }, { n: 5 }, { n: 10 }, { n: 30 }, { n: 45 }],
    generate: (r) => [{ n: r.int(11, 29) }, { n: r.int(31, 44) }],
    solution: {
      cpp: { body: `long long a = 1, b = 1;\nfor (int i = 2; i <= n; i++) { long long c = a + b; a = b; b = c; }\ncout << b << "\\n";` },
      java: { body: `long a = 1, b = 1;\nfor (int i = 2; i <= n; i++) { long c = a + b; a = b; b = c; }\nSystem.out.println(b);` },
      js: { body: `let a = 1;\nlet b = 1;\nfor (let i = 2; i <= n; i++) [a, b] = [b, a + b];\nconsole.log(b);` },
    },
  },

  {
    title: 'Running Sum of 1d Array',
    difficulty: 'easy',
    tags: ['array', 'prefix sum'],
    companies: ['Adobe'],
    shape: 'arr',
    description: `The running sum at position i is arr[0] + arr[1] + … + arr[i]. Print the running sum for every position.

Input format:
- Line 1: n
- Line 2: n integers

Output format:
- n running sums, space-separated

Constraints:
- 1 ≤ n ≤ 10⁵
- -10⁶ ≤ values ≤ 10⁶`,
    visible: [
      { arr: [1, 2, 3, 4], expect: '1 3 6 10', explanation: '1, 1+2, 1+2+3, 1+2+3+4.' },
      { arr: [3, 1, 2, 10, 1], expect: '3 4 6 16 17', explanation: 'Each value adds the next element to the previous sum.' },
    ],
    hidden: [{ arr: [5] }, { arr: [-1, 1, -1, 1] }, { arr: [0, 0, 0] }],
    generate: (r) => [{ arr: r.array(300, -50, 50) }, { arr: r.array(10000, -1e6, 1e6) }],
    solution: {
      cpp: { body: `long long sum = 0;\nfor (int i = 0; i < n; i++) {\n    sum += arr[i];\n    cout << sum << (i + 1 < n ? " " : "\\n");\n}` },
      java: { body: `StringBuilder sb = new StringBuilder();\nlong sum = 0;\nfor (int i = 0; i < n; i++) {\n    sum += arr[i];\n    sb.append(sum).append(i + 1 < n ? " " : "");\n}\nSystem.out.println(sb);` },
      js: { body: `let sum = 0;\nconsole.log(arr.map((x) => (sum += x)).join(' '));` },
    },
  },

  {
    title: 'Plus One',
    difficulty: 'easy',
    tags: ['array', 'math'],
    companies: ['Google'],
    shape: 'arr',
    description: `A non-negative integer is given as an array of its digits, most significant first, with no leading zeros (except the number 0 itself). Add one to the number and print the resulting digits.

Input format:
- Line 1: n, the number of digits
- Line 2: n digits

Output format:
- The digits of the result, space-separated

Constraints:
- 1 ≤ n ≤ 100
- 0 ≤ each digit ≤ 9`,
    visible: [
      { arr: [1, 2, 3], expect: '1 2 4', explanation: '123 + 1 = 124.' },
      { arr: [9, 9], expect: '1 0 0', explanation: '99 + 1 = 100, which needs an extra digit.' },
    ],
    hidden: [{ arr: [0] }, { arr: [9] }, { arr: [4, 3, 2, 1] }, { arr: [1, 9, 9] }],
    generate: (r) => [{ arr: [r.int(1, 9), ...r.array(60, 0, 9)] }, { arr: new Array(100).fill(9) }, { arr: [r.int(1, 9), ...r.array(40, 0, 9), 9, 9, 9] }],
    solution: {
      cpp: { body: `vector<long long> d = arr;\nint i = n - 1;\nwhile (i >= 0 && d[i] == 9) d[i--] = 0;\nif (i < 0) d.insert(d.begin(), 1);\nelse d[i]++;\nfor (size_t j = 0; j < d.size(); j++) cout << d[j] << (j + 1 < d.size() ? " " : "\\n");` },
      java: {
        body: `long[] d = arr.clone();\nint i = n - 1;\nwhile (i >= 0 && d[i] == 9) d[i--] = 0;\nStringBuilder sb = new StringBuilder();\nif (i < 0) sb.append("1 ");\nelse d[i]++;\nfor (long x : d) sb.append(x).append(' ');\nSystem.out.println(sb.toString().trim());`,
      },
      js: { body: `const d = arr.slice();\nlet i = n - 1;\nwhile (i >= 0 && d[i] === 9) d[i--] = 0;\nif (i < 0) d.unshift(1);\nelse d[i]++;\nconsole.log(d.join(' '));` },
    },
  },

  {
    title: 'Length of Last Word',
    difficulty: 'easy',
    tags: ['string'],
    companies: ['Apple'],
    shape: 'line',
    description: `A line contains words separated by spaces, possibly with extra spaces at either end. Print the length of the last word.

Input format:
- A single line of text

Output format:
- The length of the last word

Constraints:
- 1 ≤ line length ≤ 10⁴
- Letters and spaces only, with at least one word`,
    visible: [
      { s: 'Hello World', expect: '5', explanation: 'The last word is "World".' },
      { s: '   fly me   to   the moon  ', expect: '4', explanation: 'Trailing spaces are ignored; the last word is "moon".' },
    ],
    hidden: [{ s: 'a' }, { s: 'a ' }, { s: '   day' }, { s: 'luffy is still joyboy' }],
    generate: (r) => {
      const words = Array.from({ length: 800 }, () => r.word(r.int(1, 12), 'abcdefghijklmnopqrstuvwxyzABC'));
      return [{ s: words.join(' ') }, { s: '  ' + words.slice(0, 300).join('   ') + '     ' }];
    },
    solution: {
      cpp: { body: `int end = (int)s.size() - 1;\nwhile (end >= 0 && s[end] == ' ') end--;\nint start = end;\nwhile (start >= 0 && s[start] != ' ') start--;\ncout << end - start << "\\n";` },
      java: { body: `String[] words = s.trim().split("\\\\s+");\nSystem.out.println(words[words.length - 1].length());` },
      js: { body: `const words = s.trim().split(/\\s+/);\nconsole.log(words[words.length - 1].length);` },
    },
  },

  {
    title: 'Valid Palindrome',
    difficulty: 'easy',
    tags: ['string', 'two pointers'],
    companies: ['Meta', 'Microsoft'],
    shape: 'line',
    description: `A phrase is a palindrome if, after lower-casing it and removing everything except letters and digits, it reads the same forwards and backwards. Print true or false.

Input format:
- A single line of text

Output format:
- true or false

Constraints:
- 1 ≤ line length ≤ 2 × 10⁵
- Printable ASCII characters`,
    visible: [
      { s: 'A man, a plan, a canal: Panama', expect: 'true', explanation: 'It becomes "amanaplanacanalpanama", which is a palindrome.' },
      { s: 'race a car', expect: 'false', explanation: 'It becomes "raceacar", which is not.' },
    ],
    hidden: [{ s: ' ' }, { s: '0P' }, { s: 'ab_a' }, { s: 'Was it a car or a cat I saw?' }, { s: '.,' }],
    generate: (r) => {
      const half = r.word(5000, 'abcXYZ019');
      const mirrored = half + half.split('').reverse().join('');
      return [{ s: mirrored.split('').map((ch, i) => (i % 7 === 0 ? ch + ', ' : ch)).join('') }, { s: mirrored.slice(0, -1) + 'q' }];
    },
    solution: {
      cpp: {
        body: `string t;\nfor (char ch : s) if (isalnum((unsigned char)ch)) t += (char)tolower((unsigned char)ch);\nstring rev(t.rbegin(), t.rend());\nbool ok = t == rev;\ncout << ${yesNo.cpp} << "\\n";`,
      },
      java: {
        body: `StringBuilder t = new StringBuilder();\nfor (char ch : s.toCharArray()) if (Character.isLetterOrDigit(ch)) t.append(Character.toLowerCase(ch));\nboolean ok = t.toString().equals(new StringBuilder(t).reverse().toString());\nSystem.out.println(${yesNo.java});`,
      },
      js: { body: `const t = s.toLowerCase().replace(/[^a-z0-9]/g, '');\nconst ok = t === t.split('').reverse().join('');\nconsole.log(${yesNo.js});` },
    },
  },

  {
    title: 'First Unique Character in a String',
    difficulty: 'easy',
    tags: ['string', 'hash map'],
    companies: ['Amazon', 'Bloomberg'],
    shape: 'str',
    description: `Print the index of the first character in the word that appears exactly once, or -1 if there is none.

Input format:
- A single lowercase word

Output format:
- The 0-based index, or -1

Constraints:
- 1 ≤ length ≤ 10⁵
- Only lowercase English letters`,
    visible: [
      { s: 'leetcode', expect: '0', explanation: '"l" appears once and comes first.' },
      { s: 'loveleetcode', expect: '2', explanation: '"l" and "o" repeat; "v" at index 2 is the first unique one.' },
      { s: 'aabb', expect: '-1', explanation: 'Every character repeats.' },
    ],
    hidden: [{ s: 'z' }, { s: 'zz' }, { s: 'abcabd' }],
    generate: (r) => {
      const w = r.word(5000, 'abcdefghijklmnopqrstuvwxy');
      const doubled = w + w;
      return [{ s: doubled }, { s: doubled.slice(0, 4000) + 'z' + doubled.slice(4000) }, { s: r.word(26) }];
    },
    solution: {
      cpp: { body: `vector<int> cnt(26, 0);\nfor (char ch : s) cnt[ch - 'a']++;\nint ans = -1;\nfor (int i = 0; i < (int)s.size(); i++) if (cnt[s[i] - 'a'] == 1) { ans = i; break; }\ncout << ans << "\\n";` },
      java: { body: `int[] cnt = new int[26];\nfor (char ch : s.toCharArray()) cnt[ch - 'a']++;\nint ans = -1;\nfor (int i = 0; i < s.length(); i++) if (cnt[s.charAt(i) - 'a'] == 1) { ans = i; break; }\nSystem.out.println(ans);` },
      js: { body: `const cnt = {};\nfor (const ch of s) cnt[ch] = (cnt[ch] || 0) + 1;\nlet ans = -1;\nfor (let i = 0; i < s.length; i++) if (cnt[s[i]] === 1) { ans = i; break; }\nconsole.log(ans);` },
    },
  },
];
