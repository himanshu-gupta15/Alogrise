// Builds the seed problem set and verifies it.
//
// For every problem: generate test inputs, run the C++, Java and JavaScript reference
// solutions locally, require all three to agree, and use that output as the expected
// answer. Writes seed/problems.generated.json for seed.js to insert.
//
//   node seed/build.js                 (needs g++ and node; Java via JAVA_HOME or PATH)
//   node seed/build.js --only "Two Sum"
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SHAPES, buildCpp, buildJava, buildJs } from './shapes.js';
import { PROBLEMS } from './problems/index.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const work = fs.mkdtempSync(path.join(os.tmpdir(), 'algorise-seed-'));
const javaBin = process.env.JAVA_HOME ? path.join(process.env.JAVA_HOME, 'bin') : '';
const java = javaBin ? path.join(javaBin, 'java') : 'java';
const javac = javaBin ? path.join(javaBin, 'javac') : 'javac';

// Judge0 CE runs Node 12, so reject syntax it can't parse
const NODE12_UNSAFE = [/\?\./, /\?\?/, /\.at\(/, /replaceAll\(/, /\bstructuredClone\b/, /findLast/, /\b\d+_\d+\b/];

const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : null;

// Deterministic RNG so the generated tests are stable between builds
const rngFor = (seedText) => {
  let a = [...seedText].reduce((h, ch) => (Math.imul(h ^ ch.charCodeAt(0), 2654435761) >>> 0), 1779033703);
  const rand = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const int = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
  return {
    rand,
    int,
    pick: (list) => list[int(0, list.length - 1)],
    array: (len, lo, hi) => Array.from({ length: len }, () => int(lo, hi)),
    shuffle: (list) => {
      const out = [...list];
      for (let i = out.length - 1; i > 0; i--) {
        const j = int(0, i);
        [out[i], out[j]] = [out[j], out[i]];
      }
      return out;
    },
    word: (len, alphabet = 'abcdefghijklmnopqrstuvwxyz') => Array.from({ length: len }, () => alphabet[int(0, alphabet.length - 1)]).join(''),
  };
};

const normalize = (out) =>
  out
    .split('\n')
    .map((l) => l.replace(/\s+$/, ''))
    .join('\n')
    .replace(/\s+$/, '');

const run = (cmd, args, stdin, label) => {
  const res = spawnSync(cmd, args, { input: stdin, encoding: 'utf8', timeout: 20000, maxBuffer: 64 * 1024 * 1024 });
  if (res.error) throw new Error(`${label}: ${res.error.message}`);
  if (res.status !== 0) throw new Error(`${label} exited ${res.status}: ${(res.stderr || '').slice(0, 400)}`);
  return normalize(res.stdout);
};

const slug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const results = [];
const failures = [];
const titles = new Set();

for (const p of PROBLEMS) {
  if (only && p.title !== only) continue;
  const id = slug(p.title);
  try {
    if (titles.has(p.title)) throw new Error('duplicate title');
    titles.add(p.title);
    if (!SHAPES[p.shape]) throw new Error(`unknown shape ${p.shape}`);

    const dir = path.join(work, id);
    fs.mkdirSync(dir, { recursive: true });

    const refs = { cpp: buildCpp(p.shape, p.solution.cpp), java: buildJava(p.shape, p.solution.java), js: buildJs(p.shape, p.solution.js) };
    const starters = { cpp: buildCpp(p.shape), java: buildJava(p.shape), js: buildJs(p.shape) };

    for (const re of NODE12_UNSAFE) if (re.test(refs.js) || re.test(starters.js)) throw new Error(`JS uses syntax Node 12 lacks: ${re}`);

    fs.writeFileSync(path.join(dir, 'main.cpp'), refs.cpp);
    fs.writeFileSync(path.join(dir, 'Main.java'), refs.java);
    fs.writeFileSync(path.join(dir, 'main.js'), refs.js);
    // Starters must compile too
    fs.mkdirSync(path.join(dir, 'starter'));
    fs.writeFileSync(path.join(dir, 'starter', 'main.cpp'), starters.cpp);
    fs.writeFileSync(path.join(dir, 'starter', 'Main.java'), starters.java);

    const cc = spawnSync('g++', ['-std=c++17', '-O2', '-o', path.join(dir, 'a.out'), path.join(dir, 'main.cpp')], { encoding: 'utf8' });
    if (cc.status !== 0) throw new Error(`C++ compile: ${cc.stderr.slice(0, 600)}`);
    const cs = spawnSync('g++', ['-std=c++17', '-fsyntax-only', path.join(dir, 'starter', 'main.cpp')], { encoding: 'utf8' });
    if (cs.status !== 0) throw new Error(`C++ starter compile: ${cs.stderr.slice(0, 400)}`);
    const jc = spawnSync(javac, ['--release', '13', '-nowarn', '-d', dir, path.join(dir, 'Main.java')], { encoding: 'utf8' });
    if (jc.status !== 0) throw new Error(`Java compile: ${(jc.stderr || '').slice(0, 600)}`);
    const js = spawnSync(javac, ['--release', '13', '-nowarn', '-d', path.join(dir, 'starter'), path.join(dir, 'starter', 'Main.java')], { encoding: 'utf8' });
    if (js.status !== 0) throw new Error(`Java starter compile: ${(js.stderr || '').slice(0, 400)}`);

    const rng = rngFor(p.title);
    const visibleCases = p.visible;
    const hiddenCases = [...(p.hidden || []), ...(p.generate ? p.generate(rng) : [])];

    const solve = (testCase) => {
      const stdin = SHAPES[p.shape].format(testCase);
      const outJs = run('node', [path.join(dir, 'main.js')], stdin, 'JS');
      const outCpp = run(path.join(dir, 'a.out'), [], stdin, 'C++');
      const outJava = run(java, ['-cp', dir, 'Main'], stdin, 'Java');
      if (outJs !== outCpp || outJs !== outJava) {
        throw new Error(`languages disagree on input:\n${stdin.slice(0, 300)}\n  js:   ${outJs.slice(0, 200)}\n  cpp:  ${outCpp.slice(0, 200)}\n  java: ${outJava.slice(0, 200)}`);
      }
      if (!outJs) throw new Error(`empty output for input:\n${stdin.slice(0, 200)}`);
      // Independent naive answer, to catch a logic bug shared by all three solutions
      if (p.brute && (!p.bruteLimit || p.bruteLimit(testCase))) {
        const want = normalize(String(p.brute(testCase)));
        if (want !== outJs) throw new Error(`brute force disagrees on input:\n${stdin.slice(0, 300)}\n  brute: ${want.slice(0, 200)}\n  solutions: ${outJs.slice(0, 200)}`);
      }
      if (p.expect && testCase.expect !== undefined && outJs !== String(testCase.expect)) {
        throw new Error(`expected ${testCase.expect} but solutions printed ${outJs} for input:\n${stdin}`);
      }
      return { input: stdin, output: outJs };
    };

    const visibleTestCases = visibleCases.map(({ explanation, ...c }) => ({ ...solve(c), explanation }));
    const hiddenTestCases = hiddenCases.map((c) => solve(c));
    if (visibleTestCases.length < 2 || hiddenTestCases.length < 5) throw new Error('needs at least 2 visible and 5 hidden tests');

    // Every visible example's stated output must match what the solutions produce
    visibleCases.forEach((c, i) => {
      if (c.expect !== undefined && String(c.expect) !== visibleTestCases[i].output) {
        throw new Error(`visible example ${i + 1}: description says ${c.expect}, solutions print ${visibleTestCases[i].output}`);
      }
    });

    results.push({
      title: p.title,
      difficulty: p.difficulty,
      tags: p.tags,
      companies: p.companies || [],
      description: p.description.trim(),
      visibleTestCases,
      hiddenTestCases,
      startCode: [
        { language: 'C++', initialCode: starters.cpp },
        { language: 'Java', initialCode: starters.java },
        { language: 'JavaScript', initialCode: starters.js },
      ],
      referenceSolution: [
        { language: 'C++', completeCode: refs.cpp },
        { language: 'Java', completeCode: refs.java },
        { language: 'JavaScript', completeCode: refs.js },
      ],
    });
    process.stdout.write(`✓ ${p.title} (${visibleTestCases.length} visible, ${hiddenTestCases.length} hidden)\n`);
  } catch (err) {
    failures.push(p.title);
    process.stdout.write(`✗ ${p.title}: ${err.message}\n`);
  }
}

fs.rmSync(work, { recursive: true, force: true });

if (!only) fs.writeFileSync(path.join(here, 'problems.generated.json'), JSON.stringify(results, null, 2));
const counts = results.reduce((acc, r) => ({ ...acc, [r.difficulty]: (acc[r.difficulty] || 0) + 1 }), {});
console.log(`\n${results.length} built, ${failures.length} failed`, counts);
if (failures.length) {
  console.log('Failed:', failures.join(', '));
  process.exit(1);
}
