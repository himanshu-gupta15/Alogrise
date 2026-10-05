import { useEffect, useRef, useState } from 'react';
import { SendHorizontal, Sparkles } from 'lucide-react';
import axiosClient from '../utils/axiosClient';

const greetingFor = (name, title) => ({
  role: 'model',
  parts: [
    {
      text: `Hi${name ? ` ${name}` : ''} — I'm your coach${title ? ` for ${title}` : ''}. I'll nudge, not spoil. Want a hint to start?`,
    },
  ],
});

const QUICK_PROMPTS = ['Give me a hint', 'What edge cases?', 'Review my code'];

// "Coach" panel from the design: hints, not answers
function ChatAi({ problem, code, language, userName }) {
  const [messages, setMessages] = useState(() => [greetingFor(userName, problem?.title)]);
  const [draft, setDraft] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const send = async (raw) => {
    const text = raw.trim();
    if (!text || isTyping) return;

    // "Review my code" is only useful if the coach can see the code
    const withCode = /review|my code/i.test(text) && code ? `${text}\n\nMy current ${language || ''} code:\n\`\`\`\n${code}\n\`\`\`` : text;
    const userMessage = { role: 'user', parts: [{ text: withCode }], display: text };
    const history = [...messages, userMessage];

    setMessages(history);
    setDraft('');
    setIsTyping(true);

    try {
      const { data } = await axiosClient.post('/ai/chat', {
        messages: history.map(({ role, parts }) => ({ role, parts })),
        title: problem?.title,
        description: problem?.description,
        testCases: problem?.visibleTestCases,
        startCode: problem?.startCode,
      });
      setMessages((prev) => [...prev, { role: 'model', parts: [{ text: data.message }] }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'model', parts: [{ text: "I couldn't reach the coach just now. Please try again." }], error: true }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col" style={{ background: 'color-mix(in srgb, var(--color-surface) 45%, transparent)' }}>
      <div className="flex items-center gap-2 px-4 py-3 text-sm" style={{ boxShadow: 'inset 0 -1px 0 var(--color-divider)' }}>
        <Sparkles size={15} className="text-accent" />
        Coach
        <span className="flex-1" />
        <span className="text-xs text-neutral-500">Hints, not answers</span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto p-4">
        {messages.map((m, i) => {
          const mine = m.role === 'user';
          return (
            <div
              key={i}
              className={`max-w-[92%] whitespace-pre-wrap text-sm leading-[1.55] ${mine ? 'self-end rounded-[10px] bg-neutral-800 px-3 py-2' : 'self-start'}`}
              style={{ color: m.error ? 'var(--color-hard)' : 'var(--color-neutral-200)' }}
            >
              {m.display || m.parts?.[0]?.text}
            </div>
          );
        })}
        {isTyping && <div className="text-[13px] text-neutral-500">Coach is thinking…</div>}
        <div ref={endRef} />
      </div>

      <div className="flex flex-wrap gap-1.5 px-4 pb-2.5">
        {QUICK_PROMPTS.map((label) => (
          <button
            key={label}
            type="button"
            disabled={isTyping}
            onClick={() => send(label)}
            className="rounded-full border border-divider px-2.5 py-1 text-xs text-neutral-300 hover:border-accent hover:text-accent disabled:opacity-45"
          >
            {label}
          </button>
        ))}
      </div>

      <form
        className="flex gap-2 px-4 pb-4"
        onSubmit={(e) => {
          e.preventDefault();
          send(draft);
        }}
      >
        <input className="input" placeholder="Ask about this problem" value={draft} onChange={(e) => setDraft(e.target.value)} />
        <button type="submit" className="btn btn-primary btn-icon" disabled={isTyping || !draft.trim()} aria-label="Send">
          <SendHorizontal size={16} />
        </button>
      </form>
    </div>
  );
}

export default ChatAi;
