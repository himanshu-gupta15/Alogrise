import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Editor from '@monaco-editor/react';
import confetti from 'canvas-confetti';
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, CircleCheck, CircleX, CloudUpload, LoaderCircle, Play, RotateCcw, Sparkles, Timer } from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import { updateUserStats } from '../authSlice';
import SubmissionHistory from '../component/SubmissionHistory';
import ChatAi from '../component/ChatAi';
import Editorial from '../component/Editorial';
import { Dropdown, PageLoader, Spinner } from '../component/ui';
import { capitalize, difficultyColor, pad2 } from '../utils/format';

/* ================= HELPERS ================= */

const LANGUAGES = [
  { value: 'cpp', label: 'C++', monaco: 'cpp' },
  { value: 'java', label: 'Java', monaco: 'java' },
  { value: 'javascript', label: 'JavaScript', monaco: 'javascript' },
];
// startCode entries store the language under these names
const langMap = { cpp: 'C++', java: 'Java', javascript: 'JavaScript' };

const TABS = ['Description', 'Editorial', 'Submissions'];
const MOBILE_TABS = ['Problem', 'Code', 'Coach'];

const normalizeCodeText = (value) => (typeof value === 'string' ? value.replace(/\\n/g, '\n') : '');

const getStarterCode = (problem, language) => {
  const langData = problem?.startCode?.find((sc) => sc.language === langMap[language]);
  return normalizeCodeText(langData?.initialCode);
};

const getRequestError = (error) =>
  (typeof error?.response?.data === 'string' && error.response.data) || error?.response?.data?.message || error?.message || 'Request failed';

const toDisplayList = (value) => {
  if (Array.isArray(value)) return value.map((item) => String(item || '').trim()).filter(Boolean);
  if (typeof value === 'string') return value.split(/[,\n]/).map((item) => item.trim()).filter(Boolean);
  return [];
};

const showText = (value) => normalizeCodeText(value ?? '').trimEnd();

const draftKey = (problemId, language) => `algorise:code:${problemId}:${language}`;

const readDraft = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeDraft = (key, value) => {
  try {
    if (value == null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // storage unavailable (private mode) — editing still works, it just won't persist
  }
};

// Judge0 status ids: 3 accepted, 4 wrong answer, 5 TLE, 6 compile error, 7–12 runtime errors
const caseLabel = (tc) => tc?.status?.description || (tc?.status_id === 4 ? 'Wrong Answer' : 'Error');
const msOf = (seconds) => `${Math.round((Number(seconds) || 0) * 1000)} ms`;

// Editor theme built from the Nocturne tokens
const defineNocturneTheme = (monaco) => {
  monaco.editor.defineTheme('nocturne', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '9397ab' },
      { token: 'keyword', foreground: 'd2cefd' },
      { token: 'number', foreground: 'e7e5fe' },
      { token: 'string', foreground: 'b5abfc' },
      { token: 'type', foreground: 'cfd3e5' },
    ],
    colors: {
      'editor.background': '#161826',
      'editor.foreground': '#e4e7f5',
      'editor.lineHighlightBackground': '#1c1e2c',
      'editor.lineHighlightBorder': '#00000000',
      'editorLineNumber.foreground': '#595d6c',
      'editorLineNumber.activeForeground': '#b2b6ca',
      'editor.selectionBackground': '#423a6a',
      'editorCursor.foreground': '#9184d9',
      'editorIndentGuide.background1': '#292b31',
      'editorWidget.background': '#232532',
      'scrollbarSlider.background': '#3f424d88',
      // keep brackets in the text color instead of Monaco's rainbow defaults
      'editorBracketHighlight.foreground1': '#cfd3e5',
      'editorBracketHighlight.foreground2': '#cfd3e5',
      'editorBracketHighlight.foreground3': '#cfd3e5',
      'editorBracketHighlight.foreground4': '#cfd3e5',
      'editorBracketHighlight.foreground5': '#cfd3e5',
      'editorBracketHighlight.foreground6': '#cfd3e5',
      'editorBracketMatch.border': '#595d6c',
    },
  });
};

const Heading = ({ ok, icon, children, detail }) => {
  const Icon = icon;
  return (
  <div className="flex items-center gap-2 text-[15px] font-medium" style={{ color: ok ? 'var(--color-ok)' : 'var(--color-err)' }}>
    <Icon size={17} />
    {children}
    {detail && <span className="ml-1.5 text-xs font-normal text-neutral-500">{detail}</span>}
  </div>
  );
};

/* ================= CONSOLE ================= */

const Console = ({ problem, pending, result, tab, setTab, onNext }) => {
  const samples = problem?.visibleTestCases || [];
  const [caseIdx, setCaseIdx] = useState(0);
  const current = samples[Math.min(caseIdx, samples.length - 1)];

  const renderResult = () => {
    if (pending) {
      return (
        <div className="pt-2">
          <div className="flex items-center gap-2.5 text-sm text-neutral-300">
            <LoaderCircle size={16} className="animate-spin text-accent" />
            {pending === 'submit' ? 'Judging against all tests…' : `Running ${samples.length} sample test${samples.length === 1 ? '' : 's'}…`}
          </div>
          <div className="mt-3.5 h-1 overflow-hidden rounded-sm bg-neutral-900">
            <div className="h-1 w-3/5 bg-accent-600" style={{ animation: 'al-pulse 1s ease-in-out infinite' }} />
          </div>
        </div>
      );
    }
    if (!result) return <p className="pt-2 text-sm text-neutral-500">Run your code to see results here.</p>;

    const { kind, data } = result;
    const cases = Array.isArray(data?.testCase) ? data.testCase : [];

    if (kind === 'run') {
      const passed = cases.filter((tc) => tc.status_id === 3).length;
      const all = cases.length > 0 && passed === cases.length;
      return (
        <div>
          {cases.length ? (
            <Heading ok={all} icon={all ? CircleCheck : CircleX} detail={`${passed} / ${cases.length}${all ? ` · ${msOf(data.runtime)}` : ' passed'}`}>
              {all ? 'All sample tests passed' : caseLabel(cases.find((tc) => tc.status_id !== 3))}
            </Heading>
          ) : (
            <Heading ok={false} icon={CircleX}>Run failed</Heading>
          )}
          <div className="mt-3 flex flex-col gap-2">
            {cases.map((tc, i) => {
              const ok = tc.status_id === 3;
              return (
                <div key={i} className="font-mono text-xs text-neutral-300">
                  <div className="grid grid-cols-[72px_minmax(0,1fr)] gap-x-3 gap-y-1">
                    <span style={{ color: ok ? 'var(--color-ok)' : 'var(--color-err)' }}>
                      {ok ? '✓' : '✗'} Case {i + 1}
                    </span>
                    <span className="truncate">→ {showText(tc.stdout) || '(no output)'}</span>
                    {!ok && tc.status_id === 4 && (
                      <>
                        <span className="text-neutral-500">expected</span>
                        <span className="truncate">{showText(tc.expected_output)}</span>
                      </>
                    )}
                  </div>
                  {!ok && (tc.compile_output || tc.stderr) && (
                    <pre className="mt-1.5 whitespace-pre-wrap" style={{ color: 'var(--color-err)' }}>
                      {showText(tc.compile_output || tc.stderr)}
                    </pre>
                  )}
                </div>
              );
            })}
            {!cases.length && data?.errorMessage && (
              <pre className="whitespace-pre-wrap font-mono text-xs" style={{ color: 'var(--color-err)' }}>
                {data.errorMessage}
              </pre>
            )}
          </div>
        </div>
      );
    }

    if (data?.accepted) {
      return (
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <Heading ok icon={CircleCheck} detail={`${data.passedTestCases} / ${data.totalTestCases} tests`}>
              Accepted
            </Heading>
            <span className="flex-1" />
            <button type="button" className="btn btn-ghost" onClick={onNext}>
              Next problem <ArrowRight size={15} />
            </button>
          </div>
          <div className="mt-4 grid max-w-sm grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-neutral-500">Runtime</div>
              <div className="tnum mt-1 text-[18px]">{msOf(data.runtime)}</div>
            </div>
            <div>
              <div className="text-xs text-neutral-500">Memory</div>
              <div className="tnum mt-1 text-[18px]">{((data.memory || 0) / 1024).toFixed(1)} MB</div>
            </div>
          </div>
        </div>
      );
    }

    const firstFailure = cases.find((tc) => tc.status_id !== 3);
    return (
      <div>
        <Heading ok={false} icon={CircleX} detail={data?.totalTestCases ? `${data.passedTestCases} / ${data.totalTestCases} passed` : null}>
          {firstFailure ? caseLabel(firstFailure) : 'Submission failed'}
        </Heading>
        {data?.errorMessage && (
          <pre className="mt-3 whitespace-pre-wrap font-mono text-xs" style={{ color: 'var(--color-err)' }}>
            {showText(data.errorMessage)}
          </pre>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full min-h-0 flex-col" style={{ boxShadow: 'inset 0 1px 0 var(--color-neutral-900)' }}>
      <div className="flex gap-4.5 px-4" style={{ boxShadow: 'inset 0 -1px 0 var(--color-neutral-900)' }}>
        {['Testcase', 'Result'].map((t) => (
          <button key={t} type="button" role="tab" aria-selected={tab === t} className="tab py-2.5 text-[13px]" onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-auto px-4 py-3">
        {tab === 'Testcase' ? (
          samples.length ? (
            <>
              <div className="flex flex-wrap gap-1.5">
                {samples.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCaseIdx(i)}
                    className={`rounded-md px-2.5 py-1 text-[13px] ${i === caseIdx ? 'bg-neutral-800 text-text' : 'text-neutral-400 hover:text-text'}`}
                  >
                    Case {i + 1}
                  </button>
                ))}
              </div>
              <div className="mt-3 text-xs text-neutral-500">Input</div>
              <pre className="mt-1.5 whitespace-pre-wrap rounded-md bg-surface px-3 py-2 font-mono text-[13px] text-neutral-200">{showText(current?.input)}</pre>
              <div className="mt-3 text-xs text-neutral-500">Expected output</div>
              <pre className="mt-1.5 whitespace-pre-wrap rounded-md bg-surface px-3 py-2 font-mono text-[13px] text-neutral-200">{showText(current?.output)}</pre>
            </>
          ) : (
            <p className="text-sm text-neutral-500">This problem has no sample tests.</p>
          )
        ) : (
          renderResult()
        )}
      </div>
    </div>
  );
};

/* ================= PAGE ================= */

const ProblemPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { problemId } = useParams();
  const { user } = useSelector((state) => state.auth);

  const [problem, setProblem] = useState(null);
  const [loadingProblem, setLoadingProblem] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [allProblems, setAllProblems] = useState([]);

  const [language, setLanguage] = useState('cpp');
  // Code is kept together with the problem/language it belongs to, so autosave never crosses them
  const [editor, setEditor] = useState({ key: '', code: '', saved: true });

  const [tab, setTab] = useState('Description');
  const [mobileTab, setMobileTab] = useState('Problem');
  const [consoleTab, setConsoleTab] = useState('Testcase');
  const [coachOpen, setCoachOpen] = useState(() => window.innerWidth >= 1280);
  const [pending, setPending] = useState(null); // 'run' | 'submit' | null
  const [result, setResult] = useState(null); // { kind, data }
  const [historyKey, setHistoryKey] = useState(0);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);

  /* ---------- data ---------- */

  useEffect(() => {
    let active = true;
    const fetchProblem = async () => {
      setLoadingProblem(true);
      setLoadError(null);
      setResult(null);
      setTab('Description');
      setConsoleTab('Testcase');
      try {
        const { data } = await axiosClient.get(`/problem/problemById/${problemId}`);
        if (active) setProblem(data);
      } catch (error) {
        console.error('Error fetching problem:', error);
        if (active) {
          setProblem(null);
          setLoadError(getRequestError(error));
        }
      } finally {
        if (active) setLoadingProblem(false);
      }
    };
    fetchProblem();
    setStartedAt(Date.now());
    return () => {
      active = false;
    };
  }, [problemId]);

  // The full list gives this problem its number and powers previous/next
  useEffect(() => {
    axiosClient
      .get('/problem/getAllProblem')
      .then(({ data }) => setAllProblems(Array.isArray(data) ? data : []))
      .catch(() => setAllProblems([]));
  }, []);

  // Load the saved draft (or the starter code) whenever the problem or language changes
  useEffect(() => {
    if (!problem || problem._id !== problemId) return;
    const key = draftKey(problemId, language);
    setEditor({ key, code: readDraft(key) ?? (getStarterCode(problem, language) || '// No starter code for this language'), saved: true });
  }, [problem, problemId, language]);

  // Autosave, debounced
  useEffect(() => {
    if (!editor.key || editor.saved) return undefined;
    const t = setTimeout(() => {
      writeDraft(editor.key, editor.code);
      setEditor((prev) => (prev.key === editor.key ? { ...prev, saved: true } : prev));
    }, 500);
    return () => clearTimeout(t);
  }, [editor]);

  useEffect(() => {
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    return () => clearInterval(t);
  }, [startedAt]);

  /* ---------- derived ---------- */

  const index = useMemo(() => allProblems.findIndex((p) => p._id === problemId), [allProblems, problemId]);
  const prevId = index > 0 ? allProblems[index - 1]._id : null;
  const nextId = index >= 0 && index < allProblems.length - 1 ? allProblems[index + 1]._id : null;

  /* ---------- actions ---------- */

  const celebrate = () => {
    const end = Date.now() + 1500;
    (function frame() {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, colors: ['#9184d9', '#d2cefd'] });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors: ['#9184d9', '#e9e9ed'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  const execute = useCallback(
    async (kind) => {
      if (pending || !editor.code) return;
      setPending(kind);
      setResult(null);
      setConsoleTab('Result');
      setMobileTab('Code');
      try {
        const endpoint = kind === 'run' ? 'run' : 'submit';
        const { data } = await axiosClient.post(`/submission/${endpoint}/${problemId}`, { code: editor.code, language });
        setResult({ kind, data });
        if (kind === 'submit') {
          setHistoryKey((k) => k + 1);
          if (data.accepted) {
            celebrate();
            if (data.streak !== undefined) {
              dispatch(updateUserStats({ streak: data.streak, globalRank: data.globalRank, xp: data.xp }));
            }
          }
        }
      } catch (error) {
        console.error(`${kind} error:`, error);
        setResult({ kind, data: { testCase: [], errorMessage: getRequestError(error) } });
      } finally {
        setPending(null);
      }
    },
    [pending, editor.code, problemId, language, dispatch]
  );

  // Ctrl/Cmd + Enter runs, Ctrl/Cmd + Shift + Enter submits
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        execute(e.shiftKey ? 'submit' : 'run');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [execute]);

  const resetCode = () => {
    writeDraft(editor.key, null);
    setEditor((prev) => ({ ...prev, code: getStarterCode(problem, language), saved: true }));
  };

  const goNext = () => navigate(nextId ? `/problem/${nextId}` : '/practice');

  /* ---------- render ---------- */

  if (loadingProblem && !problem) return <PageLoader label="Loading problem…" />;

  if (loadError && !problem) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-[15px]" style={{ color: 'var(--color-err)' }}>{loadError}</p>
        <Link to="/practice" className="btn btn-secondary">Back to problems</Link>
      </div>
    );
  }

  const tags = toDisplayList(problem?.tags);
  const companies = toDisplayList(problem?.companies);
  const constraints = toDisplayList(problem?.constraints);
  const diffColor = difficultyColor(problem?.difficulty);

  const runButtons = (
    <>
      <button type="button" className="btn btn-secondary" onClick={() => execute('run')} disabled={!!pending} title="Ctrl/⌘ + Enter">
        {pending === 'run' ? <Spinner size={15} /> : <Play size={15} />} Run
      </button>
      <button type="button" className="btn btn-primary" onClick={() => execute('submit')} disabled={!!pending} title="Ctrl/⌘ + Shift + Enter">
        {pending === 'submit' ? <Spinner size={15} /> : <CloudUpload size={15} />} Submit
      </button>
    </>
  );

  const description = problem && (
    <>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="pill-status" style={{ '--pill': diffColor }}>{capitalize(problem.difficulty)}</span>
        {tags.map((t) => (
          <span key={t} className="tag tag-neutral capitalize">
            {t}
          </span>
        ))}
      </div>
      <h1 className="mt-3.5 text-[20px] font-medium">
        {index >= 0 ? `${index + 1}. ` : ''}
        {problem.title}
      </h1>
      <div className="mt-3 whitespace-pre-wrap text-[14.5px] leading-[1.7] text-neutral-200">{problem.description}</div>

      {(problem.visibleTestCases || []).map((ex, i) => (
        <div key={i} className="mt-5">
          <div className="text-sm font-medium">Example {i + 1}</div>
          <div className="mt-2 rounded-lg bg-surface px-3.5 py-3 font-mono text-[13px] leading-[1.7] text-neutral-200">
            <div className="whitespace-pre-wrap"><span className="text-neutral-500">Input </span>{showText(ex.input)}</div>
            <div className="whitespace-pre-wrap"><span className="text-neutral-500">Output </span>{showText(ex.output)}</div>
          </div>
          {ex.explanation && <p className="mt-2 text-[13px] text-neutral-400">{ex.explanation}</p>}
        </div>
      ))}

      {constraints.length > 0 && (
        <>
          <div className="mt-6 text-sm font-medium">Constraints</div>
          <ul className="mt-2 list-disc pl-4.5 font-mono text-[13px] leading-[1.9] text-neutral-300">
            {constraints.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </>
      )}

      {companies.length > 0 && (
        <>
          <div className="mt-6 text-sm font-medium">Asked at</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {companies.map((c) => (
              <span key={c} className="tag tag-outline">{c}</span>
            ))}
          </div>
        </>
      )}
    </>
  );

  const statementPane = (
    <div className="flex min-h-0 flex-col" style={{ boxShadow: 'inset -1px 0 0 var(--color-neutral-900)' }}>
      <div className="flex gap-5 overflow-x-auto px-5" style={{ boxShadow: 'inset 0 -1px 0 var(--color-neutral-900)' }}>
        {TABS.map((t) => (
          <button key={t} type="button" role="tab" aria-selected={tab === t} className="tab flex-none py-2.75 text-[13px]" onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-5">
        {tab === 'Description' && description}
        {tab === 'Editorial' && <Editorial secureUrl={problem?.secureUrl} thumbnailUrl={problem?.thumbnailUrl} duration={problem?.duration} />}
        {tab === 'Submissions' && <SubmissionHistory problemId={problemId} refreshKey={historyKey} />}
      </div>
    </div>
  );

  const editorPane = (
    <div className="grid min-h-0 min-w-0 grid-rows-[minmax(0,1fr)_minmax(180px,34%)]">
      <div className="flex min-h-0 flex-col">
        <div className="flex items-center gap-2 px-3 py-1.5" style={{ boxShadow: 'inset 0 -1px 0 var(--color-neutral-900)' }}>
          <Dropdown bare label="" value={language} options={LANGUAGES} onChange={(v) => { setLanguage(v); setResult(null); }} />
          <div className="flex-1" />
          <span className="flex items-center gap-1 text-xs text-neutral-500">
            {editor.saved ? <><Check size={13} /> Saved</> : 'Saving…'}
          </span>
          <button type="button" className="btn btn-icon h-7 w-7 text-neutral-400" onClick={resetCode} title="Reset to starter code" aria-label="Reset to starter code">
            <RotateCcw size={14} />
          </button>
        </div>
        <div className="min-h-0 flex-1">
          <Editor
            height="100%"
            language={LANGUAGES.find((l) => l.value === language)?.monaco}
            value={editor.code}
            theme="nocturne"
            beforeMount={defineNocturneTheme}
            onChange={(val) => setEditor((prev) => ({ ...prev, code: val ?? '', saved: false }))}
            loading={<Spinner />}
            options={{
              fontSize: 13.5,
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              lineHeight: 22,
              minimap: { enabled: false },
              automaticLayout: true,
              padding: { top: 12 },
              lineNumbersMinChars: 3,
              scrollBeyondLastLine: false,
              renderLineHighlight: 'line',
              overviewRulerLanes: 0,
              tabSize: 4,
              bracketPairColorization: { enabled: false },
              guides: { bracketPairs: false },
            }}
          />
        </div>
      </div>
      <Console problem={problem} pending={pending} result={result} tab={consoleTab} setTab={setConsoleTab} onNext={goNext} />
    </div>
  );

  const coachPane = <ChatAi key={problemId} problem={problem} code={editor.code} language={langMap[language]} userName={user?.firstName} />;

  return (
    <div className="flex h-dvh flex-col bg-bg">
      {/* Desktop top bar */}
      <div className="relative hidden items-center gap-3 px-4 py-2.25 text-sm lg:flex" style={{ boxShadow: 'inset 0 -1px 0 var(--color-neutral-900)' }}>
        <Link to="/practice" className="btn btn-icon h-7 w-7 text-neutral-400" aria-label="Back to problems">
          <ArrowLeft size={16} />
        </Link>
        <span className="truncate font-medium">{problem?.title}</span>
        <span className="flex text-neutral-500">
          <button type="button" className="btn btn-icon h-7 w-7" disabled={!prevId} onClick={() => navigate(`/problem/${prevId}`)} aria-label="Previous problem">
            <ChevronLeft size={16} />
          </button>
          <button type="button" className="btn btn-icon h-7 w-7" disabled={!nextId} onClick={() => navigate(`/problem/${nextId}`)} aria-label="Next problem">
            <ChevronRight size={16} />
          </button>
        </span>
        <div className="absolute left-1/2 flex -translate-x-1/2 gap-2">{runButtons}</div>
        <div className="flex-1" />
        <span className="tnum flex items-center gap-1.5 text-neutral-400" title="Time on this problem">
          <Timer size={15} />
          {pad2(Math.floor(elapsed / 60))}:{pad2(elapsed % 60)}
        </span>
        <button type="button" className="btn btn-ghost" onClick={() => setCoachOpen((v) => !v)} aria-pressed={coachOpen}>
          <Sparkles size={15} /> Coach
        </button>
      </div>

      {/* Mobile top bar + segmented switch */}
      <div className="lg:hidden" style={{ background: 'var(--color-chrome)' }}>
        <div className="flex items-center gap-3 px-3 py-2.5">
          <Link to="/practice" className="btn btn-icon h-8 w-8 text-neutral-300" aria-label="Back to problems">
            <ArrowLeft size={18} />
          </Link>
          <span className="min-w-0 flex-1 truncate text-[15px] font-medium">{problem?.title}</span>
          <span className="text-[13px]" style={{ color: diffColor }}>{capitalize(problem?.difficulty)}</span>
        </div>
        <div className="mx-3 mb-2.5 grid grid-cols-3 rounded-[10px] bg-surface p-1">
          {MOBILE_TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setMobileTab(t)}
              className={`rounded-lg py-1.75 text-[13.5px] ${mobileTab === t ? 'bg-neutral-800 text-text' : 'text-neutral-400'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop workspace */}
      <div
        className="hidden min-h-0 flex-1 lg:grid lg:grid-cols-[minmax(340px,420px)_minmax(0,1fr)_var(--coach-col)]"
        style={{ '--coach-col': coachOpen ? '320px' : '0px' }}
      >
        {statementPane}
        {editorPane}
        {coachOpen && <div className="min-h-0" style={{ boxShadow: 'inset 1px 0 0 var(--color-neutral-900)' }}>{coachPane}</div>}
      </div>

      {/* Mobile workspace: one pane at a time */}
      <div className="flex min-h-0 flex-1 flex-col lg:hidden">
        {mobileTab === 'Problem' && statementPane}
        {mobileTab === 'Code' && (
          <>
            <div className="flex gap-2 px-3 py-2" style={{ boxShadow: 'inset 0 -1px 0 var(--color-neutral-900)' }}>
              {runButtons}
            </div>
            <div className="min-h-0 flex-1">{editorPane}</div>
          </>
        )}
        {mobileTab === 'Coach' && <div className="min-h-0 flex-1">{coachPane}</div>}
      </div>
    </div>
  );
};

export default ProblemPage;
