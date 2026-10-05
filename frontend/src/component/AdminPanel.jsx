import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, Plus, Trash2, X } from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import { Notice, PageLoader } from './ui';
import { capitalize, timeAgo } from '../utils/format';

const LANGS = ['C++', 'Java', 'JavaScript'];

const buildSchema = (editing) => z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim().min(1, 'Statement is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tagsCsv: z.string().trim().min(1, 'At least one topic is required'),
  companiesCsv: z.string().optional(),
  visibleTestCases: z
    .array(
      z.object({
        input: z.string().min(1, 'Input is required'),
        output: z.string().min(1, 'Output is required'),
        explanation: editing ? z.string().optional().default('') : z.string().min(1, 'Explanation is required'),
      })
    )
    .min(1, 'Add at least one visible example'),
  hiddenTestCases: z
    .array(z.object({ input: z.string().min(1, 'Input is required'), output: z.string().min(1, 'Output is required') }))
    .min(1, 'Add at least one hidden test'),
  startCode: z.array(z.object({ language: z.enum(LANGS), initialCode: z.string().min(1, 'Starter code is required') })).length(3),
  referenceSolution: z.array(z.object({ language: z.enum(LANGS), completeCode: z.string().min(1, 'Reference solution is required') })).length(3),
});

const DEFAULTS = {
  title: '',
  description: '',
  difficulty: 'medium',
  tagsCsv: '',
  companiesCsv: '',
  visibleTestCases: [{ input: '', output: '', explanation: '' }],
  hiddenTestCases: [{ input: '', output: '' }],
  startCode: LANGS.map((language) => ({ language, initialCode: '' })),
  referenceSolution: LANGS.map((language) => ({ language, completeCode: '' })),
};

const STEPS = [
  { label: 'Details', title: 'Problem details', fields: ['title', 'difficulty', 'tagsCsv', 'companiesCsv', 'description'] },
  { label: 'Test cases', title: 'Test cases', fields: ['visibleTestCases', 'hiddenTestCases'] },
  { label: 'Code templates', title: 'Starter code', fields: ['startCode'] },
  { label: 'Reference solution', title: 'Reference solution', fields: ['referenceSolution'] },
  { label: 'Review', title: 'Review & publish', fields: [] },
];

const DRAFT_KEY = 'algorise:problem-draft';

const splitList = (value, lower = false) =>
  (value || '')
    .split(/[,\n]/)
    .map((v) => (lower ? v.trim().toLowerCase() : v.trim()))
    .filter(Boolean);

const unescapeNewlines = (value) => (typeof value === 'string' ? value.replace(/\\n/g, '\n') : value);

const toPayload = (data) => {
  const { tagsCsv, companiesCsv, ...rest } = data;
  return {
    ...rest,
    tags: splitList(tagsCsv, true),
    companies: splitList(companiesCsv),
    visibleTestCases: data.visibleTestCases.map((t) => ({ input: unescapeNewlines(t.input), output: unescapeNewlines(t.output), explanation: unescapeNewlines(t.explanation) })),
    hiddenTestCases: data.hiddenTestCases.map((t) => ({ input: unescapeNewlines(t.input), output: unescapeNewlines(t.output) })),
    startCode: data.startCode.map((c) => ({ ...c, initialCode: unescapeNewlines(c.initialCode) })),
    referenceSolution: data.referenceSolution.map((c) => ({ ...c, completeCode: unescapeNewlines(c.completeCode) })),
  };
};

// Turn a problem from the API into form values
const toFormValues = (p) => {
  const byLang = (list, field) =>
    LANGS.map((language) => ({ language, [field]: (list || []).find((c) => c.language === language)?.[field] || '' }));
  return {
    title: p.title || '',
    description: p.description || '',
    difficulty: ['easy', 'medium', 'hard'].includes(p.difficulty) ? p.difficulty : 'medium',
    tagsCsv: (p.tags || []).join(', '),
    companiesCsv: (p.companies || []).join(', '),
    visibleTestCases: p.visibleTestCases?.length ? p.visibleTestCases.map((t) => ({ input: t.input || '', output: t.output || '', explanation: t.explanation || '' })) : DEFAULTS.visibleTestCases,
    hiddenTestCases: p.hiddenTestCases?.length ? p.hiddenTestCases.map((t) => ({ input: t.input || '', output: t.output || '' })) : DEFAULTS.hiddenTestCases,
    startCode: byLang(p.startCode, 'initialCode'),
    referenceSolution: byLang(p.referenceSolution, 'completeCode'),
  };
};

const readDraft = () => {
  try {
    return JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
  } catch {
    return null;
  }
};

const FieldError = ({ error }) => (error?.message ? <p className="field-error">{error.message}</p> : null);

/* Topics as removable chips; Enter or comma adds one, Backspace on empty removes the last */
const TopicInput = ({ value, onChange }) => {
  const [draft, setDraft] = useState('');
  const topics = splitList(value, true);
  const commit = (list) => onChange([...new Set(list)].join(', '));
  const add = () => {
    const t = draft.trim().replace(/,$/, '').toLowerCase();
    if (t) commit([...topics, t]);
    setDraft('');
  };
  return (
    <div className="input flex min-h-9 flex-wrap items-center gap-1.5 py-1.5 focus-within:border-accent">
      {topics.map((t) => (
        <span key={t} className="tag tag-accent gap-1 capitalize">
          {t}
          <button type="button" onClick={() => commit(topics.filter((x) => x !== t))} aria-label={`Remove ${t}`} className="text-accent-200 hover:text-text">
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        id="tagsCsv"
        value={draft}
        onChange={(e) => (e.target.value.endsWith(',') ? (setDraft(e.target.value.slice(0, -1)), setTimeout(add)) : setDraft(e.target.value))}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            add();
          } else if (e.key === 'Backspace' && !draft && topics.length) {
            commit(topics.slice(0, -1));
          }
        }}
        onBlur={add}
        placeholder={topics.length ? 'Add another' : 'Type a topic, press Enter'}
        className="min-w-30 flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-600"
        style={{ outline: 'none' }}
      />
    </div>
  );
};

const LangSeg = ({ value, onChange, filled }) => (
  <div className="seg mb-4" role="radiogroup">
    {LANGS.map((l, i) => (
      <button key={l} type="button" role="radio" aria-checked={value === i} className="seg-opt" onClick={() => onChange(i)}>
        {l}
        {filled(i) && <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-label="filled" />}
      </button>
    ))}
  </div>
);

function AdminPanel() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';
  // /admin/update/:id reuses this form to edit an existing problem
  const { id: editId } = useParams();
  const editing = !!editId;
  const [loadingProblem, setLoadingProblem] = useState(editing);
  const [problemStatus, setProblemStatus] = useState(null);

  const [step, setStep] = useState(0);
  const [lang, setLang] = useState(0);
  const [validateOnPublish, setValidateOnPublish] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState(null);
  const [published, setPublished] = useState(null);
  const [savedAt, setSavedAt] = useState(null);
  const [restored, setRestored] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    trigger,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(buildSchema(editing)), defaultValues: DEFAULTS, mode: 'onTouched' });

  const visible = useFieldArray({ control, name: 'visibleTestCases' });
  const hidden = useFieldArray({ control, name: 'hiddenTestCases' });

  const values = watch();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [step]);

  useEffect(() => {
    if (!editId) return;
    axiosClient
      .get(`/problem/problemById/${editId}`)
      .then(({ data }) => {
        reset(toFormValues(data));
        setProblemStatus(data.status || 'approved');
      })
      .catch(() => setNotice({ type: 'error', message: 'Could not load this problem.' }))
      .finally(() => setLoadingProblem(false));
  }, [editId, reset]);

  const goTo = async (target) => {
    // Moving forward checks the current step first
    if (target > step) {
      const ok = await trigger(STEPS[step].fields);
      if (!ok) return;
    }
    setStep(target);
  };

  // Create mode: restore the last draft once, then autosave every change
  useEffect(() => {
    if (editing) return undefined;
    const draft = readDraft();
    if (draft) {
      reset({ ...DEFAULTS, ...draft });
      setRestored(true);
    }
    let timer;
    const sub = watch((formValues) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        try {
          localStorage.setItem(DRAFT_KEY, JSON.stringify(formValues));
          setSavedAt(Date.now());
        } catch {
          // storage unavailable — the form still works, it just won't persist
        }
      }, 600);
    });
    return () => {
      clearTimeout(timer);
      sub.unsubscribe();
    };
  }, [editing, reset, watch]);

  const discardDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setRestored(false);
    setSavedAt(null);
  };

  const startOver = () => {
    discardDraft();
    reset(DEFAULTS);
    setStep(0);
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      setNotice(null);
      if (editing) {
        await axiosClient.put(`/problem/update/${editId}`, toPayload(data));
        setNotice({ type: 'success', message: `Saved changes to “${data.title}”.` });
        return;
      }
      await axiosClient.post('/problem/create', { ...toPayload(data), skipJudge: !validateOnPublish });
      setPublished({ title: data.title });
      reset(DEFAULTS);
      discardDraft();
      setStep(0);
    } catch (error) {
      const msg = error?.response?.data;
      setNotice({ type: 'error', message: typeof msg === 'string' ? msg.replace(/^Error:\s*/, '') : error.message || 'Could not create the problem.' });
    } finally {
      setSubmitting(false);
    }
  };

  const onInvalid = (errs) => {
    // Jump back to the first step with a problem
    const firstBad = STEPS.findIndex((s) => s.fields.some((f) => errs[f]));
    if (firstBad >= 0) setStep(firstBad);
    setNotice({ type: 'error', message: 'Some fields still need attention.' });
  };

  const isLast = step === STEPS.length - 1;

  if (loadingProblem) return <PageLoader label="Loading problem…" />;

  const review = [
    ['Title', values.title || '—', 0],
    ['Difficulty', capitalize(values.difficulty), 0],
    ['Topics', splitList(values.tagsCsv, true).join(' · ') || '—', 0],
    ['Companies', splitList(values.companiesCsv).join(', ') || '—', 0],
    ['Test cases', `${values.visibleTestCases?.length || 0} visible · ${values.hiddenTestCases?.length || 0} hidden`, 1],
    ['Starter code', LANGS.filter((_, i) => values.startCode?.[i]?.initialCode).join(', ') || 'Missing', 2],
    ['Reference solution', LANGS.filter((_, i) => values.referenceSolution?.[i]?.completeCode).join(', ') || 'Missing', 3],
  ];

  if (published) {
    return (
      <div className="page fade-in">
        <div className="mx-auto mt-16 max-w-130 text-center" style={{ animation: 'al-pop 200ms ease-out' }}>
          <span className="inline-grid h-13 w-13 place-items-center rounded-full" style={{ color: 'var(--color-ok)', background: 'color-mix(in srgb, var(--color-ok) 14%, transparent)' }}>
            <Check size={26} />
          </span>
          <h1 className="mt-4.5 text-[24px] font-medium">{isAdmin ? 'Problem published' : 'Submitted for review'}</h1>
          <p className="mt-2 text-sm text-neutral-400">
            {isAdmin ? `“${published.title}” is live on Problems.` : `“${published.title}” will go live once an admin approves it.`}
          </p>
          <div className="mt-6 flex justify-center gap-2.5">
            <button type="button" className="btn btn-secondary" onClick={() => setPublished(null)}>
              Create another
            </button>
            <button type="button" className="btn btn-primary" onClick={() => navigate(isAdmin ? '/practice' : '/my-problems')}>
              {isAdmin ? 'View problems' : 'View my problems'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page fade-in">
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-55 flex-1">
          <h1 className="page-title">{editing ? 'Edit problem' : isAdmin ? 'Create problem' : 'Contribute a problem'}</h1>
          <p className="page-sub">
            {editing
              ? `Status: ${capitalize(problemStatus || 'approved')}. Changes apply as soon as you save.`
              : isAdmin
                ? 'Admin problems publish as soon as you finish.'
                : 'Community problems go live after an admin reviews them.'}
          </p>
        </div>
        {!editing && (
          <span className="text-xs text-neutral-500">
            {savedAt ? `Draft saved ${timeAgo(savedAt)}` : restored ? 'Draft restored' : 'Drafts save automatically'}
            {(savedAt || restored) && (
              <>
                {' · '}
                <button type="button" className="hover:text-text" onClick={startOver}>
                  Start over
                </button>
              </>
            )}
          </span>
        )}
      </div>

      {/* Stepper */}
      <div className="mt-6 flex gap-1 overflow-x-auto">
        {STEPS.map((st, i) => {
          const reached = i <= step;
          return (
            <button
              key={st.label}
              type="button"
              onClick={() => goTo(i)}
              className="min-w-30 flex-1 pt-2.5 text-left text-[13px]"
              style={{ boxShadow: `inset 0 2px 0 ${reached ? 'var(--color-accent)' : 'var(--color-neutral-800)'}`, color: i === step ? 'var(--color-text)' : 'var(--color-neutral-400)' }}
            >
              {i < step ? '✓' : i + 1} {st.label}
            </button>
          );
        })}
      </div>

      <form className="mt-7 max-w-190" onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate>
        {notice && (
          <div className="mb-6">
            <Notice type={notice.type} onClose={() => setNotice(null)}>
              {notice.message}
            </Notice>
          </div>
        )}

        {/* Step 1: details */}
        <div className={step === 0 ? 'flex flex-col gap-5' : 'hidden'}>
          <div className="field">
            <label htmlFor="title">Title</label>
            <input id="title" className="input" placeholder="Sliding Window Maximum" {...register('title')} />
            <FieldError error={errors.title} />
          </div>
          <div className="field">
            <label>Difficulty</label>
            <div className="seg" role="radiogroup">
              {['easy', 'medium', 'hard'].map((d) => (
                <label key={d} className="seg-opt" aria-checked={values.difficulty === d}>
                  <input type="radio" value={d} className="sr-only" {...register('difficulty')} />
                  {capitalize(d)}
                </label>
              ))}
            </div>
          </div>
          <div className="field">
            <label htmlFor="tagsCsv">Topics</label>
            <TopicInput value={values.tagsCsv} onChange={(v) => setValue('tagsCsv', v, { shouldValidate: true, shouldDirty: true })} />
            <FieldError error={errors.tagsCsv} />
          </div>
          <div className="field">
            <label htmlFor="companiesCsv">Companies (optional)</label>
            <input id="companiesCsv" className="input" placeholder="Google, Amazon" {...register('companiesCsv')} />
          </div>
          <div className="field">
            <label htmlFor="description">Statement</label>
            <textarea
              id="description"
              className="input"
              rows={9}
              placeholder={'You are given an array of integers nums and a window of size k moving from left to right. Return the maximum of each window.\n\nConstraints:\n1 ≤ k ≤ nums.length ≤ 10⁵'}
              {...register('description')}
            />
            <FieldError error={errors.description} />
          </div>
        </div>

        {/* Step 2: tests */}
        <div className={step === 1 ? 'flex flex-col gap-10' : 'hidden'}>
          <div>
            <div className="flex items-center">
              <span className="eyebrow">Visible examples</span>
              <span className="flex-1" />
              <span className="text-[13px] text-neutral-400">Shown to users in the statement</span>
            </div>
            <div className="mt-3 flex flex-col gap-4">
              {visible.fields.map((f, i) => (
                <div key={f.id} className="grid grid-cols-[28px_minmax(0,1fr)_minmax(0,1fr)_36px] items-start gap-3">
                  <span className="tnum pt-2 text-neutral-500">{i + 1}</span>
                  <div>
                    <textarea className="input input-mono min-h-9" rows={2} placeholder="Input" {...register(`visibleTestCases.${i}.input`)} />
                    <FieldError error={errors.visibleTestCases?.[i]?.input} />
                  </div>
                  <div>
                    <textarea className="input input-mono min-h-9" rows={2} placeholder="Expected output" {...register(`visibleTestCases.${i}.output`)} />
                    <FieldError error={errors.visibleTestCases?.[i]?.output} />
                  </div>
                  <button type="button" className="btn btn-icon text-neutral-400" onClick={() => visible.remove(i)} disabled={visible.fields.length === 1} aria-label="Remove example">
                    <Trash2 size={16} />
                  </button>
                  <span />
                  <div className="col-span-2">
                    <input className="input" placeholder="Why this output?" {...register(`visibleTestCases.${i}.explanation`)} />
                    <FieldError error={errors.visibleTestCases?.[i]?.explanation} />
                  </div>
                </div>
              ))}
            </div>
            <button type="button" className="btn btn-ghost mt-3" onClick={() => visible.append({ input: '', output: '', explanation: '' })}>
              <Plus size={15} /> Add example
            </button>
          </div>

          <div>
            <div className="flex items-center">
              <span className="eyebrow">Hidden tests</span>
              <span className="flex-1" />
              <span className="text-[13px] text-neutral-400">Judge submissions; never shown</span>
            </div>
            <div className="mt-3 flex flex-col gap-3">
              {hidden.fields.map((f, i) => (
                <div key={f.id} className="grid grid-cols-[28px_minmax(0,1fr)_minmax(0,1fr)_36px] items-start gap-3">
                  <span className="tnum pt-2 text-neutral-500">{i + 1}</span>
                  <div>
                    <textarea className="input input-mono min-h-9" rows={2} placeholder="Input" {...register(`hiddenTestCases.${i}.input`)} />
                    <FieldError error={errors.hiddenTestCases?.[i]?.input} />
                  </div>
                  <div>
                    <textarea className="input input-mono min-h-9" rows={2} placeholder="Expected output" {...register(`hiddenTestCases.${i}.output`)} />
                    <FieldError error={errors.hiddenTestCases?.[i]?.output} />
                  </div>
                  <button type="button" className="btn btn-icon text-neutral-400" onClick={() => hidden.remove(i)} disabled={hidden.fields.length === 1} aria-label="Remove test">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" className="btn btn-ghost mt-3" onClick={() => hidden.append({ input: '', output: '' })}>
              <Plus size={15} /> Add hidden test
            </button>
          </div>
        </div>

        {/* Step 3: starter code */}
        <div className={step === 2 ? '' : 'hidden'}>
          <LangSeg value={lang} onChange={setLang} filled={(i) => !!values.startCode?.[i]?.initialCode} />
          {LANGS.map((l, i) => (
            <div key={l} className={lang === i ? '' : 'hidden'}>
              <textarea
                className="input input-mono code-surface min-h-80 leading-[23px]"
                spellCheck={false}
                placeholder={`${l} starter code users will see`}
                {...register(`startCode.${i}.initialCode`)}
              />
              <FieldError error={errors.startCode?.[i]?.initialCode} />
            </div>
          ))}
          <p className="mt-3 text-[13px] text-neutral-400">This is the starter code users see. Keep the signature identical across languages.</p>
        </div>

        {/* Step 4: reference solution */}
        <div className={step === 3 ? '' : 'hidden'}>
          <LangSeg value={lang} onChange={setLang} filled={(i) => !!values.referenceSolution?.[i]?.completeCode} />
          {LANGS.map((l, i) => (
            <div key={l} className={lang === i ? '' : 'hidden'}>
              <textarea
                className="input input-mono code-surface min-h-80 leading-[23px]"
                spellCheck={false}
                placeholder={`Complete ${l} solution`}
                {...register(`referenceSolution.${i}.completeCode`)}
              />
              <FieldError error={errors.referenceSolution?.[i]?.completeCode} />
            </div>
          ))}
          <p className="mt-3 text-[13px] text-neutral-400">A full program that reads the test input and prints the expected output.</p>
        </div>

        {/* Step 5: review */}
        <div className={step === 4 ? '' : 'hidden'}>
          {review.map(([k, v, target]) => (
            <div key={k} className="row-rule grid gap-2 py-4 text-[15px] sm:grid-cols-[200px_minmax(0,1fr)_auto] sm:gap-6">
              <span className="text-neutral-400">{k}</span>
              <span className="min-w-0 truncate">{v}</span>
              <button type="button" className="btn btn-ghost text-[13px]" onClick={() => setStep(target)}>
                Edit
              </button>
            </div>
          ))}
          {!editing && (
          <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm text-neutral-300">
            <input type="checkbox" className="mt-0.5 accent-accent" checked={validateOnPublish} onChange={(e) => setValidateOnPublish(e.target.checked)} />
            <span>
              Validate against tests on publish
              <span className="block text-[13px] text-neutral-500">Runs each reference solution on the visible examples with the judge. Publishing fails if any of them don't pass.</span>
            </span>
          </label>
          )}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <button type="button" className="btn btn-secondary" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
            Back
          </button>
          <span className="flex-1" />
          {editing && (
            <Link to="/admin/update" className="btn btn-ghost text-neutral-300">
              Back to list
            </Link>
          )}
          {editing ? (
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save changes'}
            </button>
          ) : isLast ? (
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? (validateOnPublish ? 'Validating…' : 'Publishing…') : isAdmin ? 'Publish problem' : 'Submit for review'}
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={() => goTo(step + 1)}>
              Continue
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default AdminPanel;
