'use client';

import { FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Clock3,
  ThumbsDown,
  ThumbsUp,
  Loader2,
  LockKeyhole,
  Send,
  ShieldCheck,
  Sparkles,
  XCircle,
} from 'lucide-react';
import { getStyleTokens } from '@/lib/stylePresets';
import { t } from '@/lib/translations';
import type { Lang, StylePreset } from '@/lib/types';
import { AGENT_DEMO_MAX_INPUT_LENGTH } from '@/features/agent-demo/agentDemoConfig';
import type { AgentDemoResponse, AgentTraceStep } from '@/features/agent-demo/agentDemoTypes';

interface AgentDemoPageProps {
  stylePreset: StylePreset;
  lang: Lang;
}

type RequestState = 'idle' | 'loading' | 'success' | 'error' | 'rate_limited';
type FeedbackState = 'idle' | 'submitting' | 'submitted' | 'error';
type FeedbackValue = 'helpful' | 'not_helpful';

const sampleQuestions: Record<Lang, string[]> = {
  zh: [
    'AI Agent Demo 是什么？',
    '这个网站是怎么实现的？',
    '作者现在的 AI Agent 学习方向是什么？',
  ],
  en: [
    'What is the AI Agent Demo?',
    'How was this website implemented?',
    'What is the current AI Agent learning direction?',
  ],
};

function getTraceIcon(step: AgentTraceStep) {
  if (step.status === 'passed') return CheckCircle2;
  if (step.status === 'blocked') return LockKeyhole;
  if (step.status === 'failed') return XCircle;
  return Clock3;
}

function getTraceClass(status: AgentTraceStep['status']) {
  switch (status) {
    case 'passed':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-950/30 dark:text-emerald-300';
    case 'blocked':
      return 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-950/30 dark:text-amber-300';
    case 'failed':
      return 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-950/30 dark:text-rose-300';
    default:
      return 'border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400';
  }
}

function formatResetTime(resetAt?: number, lang?: Lang): string | null {
  if (!resetAt) return null;

  return new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(resetAt));
}

export function AgentDemoPage({ stylePreset, lang }: AgentDemoPageProps) {
  const tokens = getStyleTokens(stylePreset);
  const isMacos = stylePreset === 'macos';
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState<AgentDemoResponse | null>(null);
  const [requestState, setRequestState] = useState<RequestState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [feedbackState, setFeedbackState] = useState<FeedbackState>('idle');
  const [feedbackError, setFeedbackError] = useState('');
  const [submittedFeedback, setSubmittedFeedback] = useState<FeedbackValue | null>(null);

  const trimmedQuestion = question.trim();
  const canSubmit = trimmedQuestion.length > 0 && requestState !== 'loading';
  const remainingChars = AGENT_DEMO_MAX_INPUT_LENGTH - question.length;
  const resetTime = useMemo(
    () => formatResetTime(response?.usage?.rateLimitResetAt, lang),
    [lang, response?.usage?.rateLimitResetAt],
  );

  async function submitQuestion(nextQuestion = trimmedQuestion) {
    const finalQuestion = nextQuestion.trim();
    if (!finalQuestion) return;

    setQuestion(finalQuestion);
    setRequestState('loading');
    setErrorMessage('');
    setFeedbackState('idle');
    setFeedbackError('');
    setSubmittedFeedback(null);

    try {
      const result = await fetch('/api/agent-demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: finalQuestion,
          locale: lang,
        }),
      });
      const data = (await result.json()) as AgentDemoResponse;
      setResponse(data);

      if (result.status === 429 || data.error === 'rate_limited') {
        setRequestState('rate_limited');
        return;
      }

      setRequestState(result.ok ? 'success' : 'error');
      if (!result.ok) {
        setErrorMessage(data.answer || t('agentDemo.errorGeneric', lang));
      }
    } catch {
      setRequestState('error');
      setErrorMessage(t('agentDemo.networkError', lang));
    }
  }

  async function submitFeedback(feedback: FeedbackValue) {
    if (!response?.requestId || feedbackState === 'submitting' || feedbackState === 'submitted') return;

    setFeedbackState('submitting');
    setFeedbackError('');

    try {
      const result = await fetch('/api/agent-demo/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId: response.requestId,
          feedback,
          category: response.category,
        }),
      });
      const data = (await result.json()) as { ok: boolean; error?: string };

      if (!result.ok || !data.ok) {
        setFeedbackState('error');
        setFeedbackError(t('agentDemo.feedbackError', lang));
        return;
      }

      setSubmittedFeedback(feedback);
      setFeedbackState('submitted');
    } catch {
      setFeedbackState('error');
      setFeedbackError(t('agentDemo.feedbackError', lang));
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (canSubmit) {
      void submitQuestion();
    }
  }

  return (
    <div className="space-y-5">
      <section className={`${tokens.cardBg} ${tokens.cardBorder} ${tokens.cardBorderRadius} ${tokens.cardShadow} overflow-hidden`}>
        <div className={`px-5 py-5 md:px-6 md:py-6 ${isMacos ? 'bg-white/35 dark:bg-white/5' : 'bg-zinc-100/60 dark:bg-zinc-900/50'}`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className={`mb-2 flex items-center gap-2 text-[11px] uppercase ${tokens.textMuted} ${isMacos ? 'tracking-wider' : 'font-mono'}`}>
                <Bot size={13} />
                agent-demo/
              </div>
              <h1 className={`${isMacos ? 'text-2xl font-semibold md:text-3xl' : 'font-mono text-xl font-bold uppercase md:text-2xl'} ${tokens.textPrimary}`}>
                {t('agentDemo.title', lang)}
              </h1>
              <p className={`mt-3 max-w-3xl ${isMacos ? 'text-sm leading-relaxed' : 'font-mono text-xs leading-relaxed'} ${tokens.textSecondary}`}>
                {t('agentDemo.subtitle', lang)}
              </p>
            </div>
            <div className={`flex w-fit items-center gap-2 px-2.5 py-1 text-[11px] ${tokens.tagBg} ${tokens.tagText} ${tokens.tagBorder} ${tokens.tagBorderRadius}`}>
              <ShieldCheck size={13} />
              <span>{t('agentDemo.scopeBadge', lang)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-0 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="space-y-4 border-b border-zinc-200/60 p-5 dark:border-zinc-800/70 lg:border-b-0 lg:border-r md:p-6">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="agent-demo-question" className={`text-xs font-medium ${tokens.textPrimary}`}>
                  {t('agentDemo.questionLabel', lang)}
                </label>
                <span className={`text-[11px] ${remainingChars < 0 ? 'text-rose-500' : tokens.textMuted}`}>
                  {question.length}/{AGENT_DEMO_MAX_INPUT_LENGTH}
                </span>
              </div>
              <textarea
                id="agent-demo-question"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder={t('agentDemo.placeholder', lang)}
                maxLength={AGENT_DEMO_MAX_INPUT_LENGTH}
                rows={7}
                className={`min-h-40 w-full resize-none rounded-md border border-zinc-200 bg-white/80 px-3 py-3 text-sm leading-6 outline-none transition-colors placeholder:text-zinc-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 dark:border-zinc-800 dark:bg-black/30 dark:placeholder:text-zinc-600 dark:focus:border-indigo-500/50 dark:focus:ring-indigo-500/10 ${tokens.textPrimary} ${isMacos ? '' : 'font-mono text-xs'}`}
              />
              <button
                type="submit"
                disabled={!canSubmit}
                className={`inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${isMacos ? 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200' : 'border border-zinc-900 bg-zinc-900 font-mono text-white hover:bg-zinc-800 dark:border-zinc-100 dark:bg-zinc-100 dark:text-black dark:hover:bg-white'}`}
              >
                {requestState === 'loading' ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                <span>{requestState === 'loading' ? t('agentDemo.loading', lang) : t('agentDemo.submit', lang)}</span>
              </button>
            </form>

            <div className="space-y-2">
              <div className={`text-[11px] uppercase ${tokens.textMuted} ${isMacos ? 'tracking-wider' : 'font-mono'}`}>
                {t('agentDemo.examples', lang)}
              </div>
              <div className="grid grid-cols-1 gap-2">
                {sampleQuestions[lang].map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => void submitQuestion(sample)}
                    disabled={requestState === 'loading'}
                    className={`min-h-9 rounded-md border border-zinc-200/70 px-3 py-2 text-left text-xs transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:hover:bg-zinc-900 ${tokens.textSecondary}`}
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>

            <div className={`${tokens.nestedCardBg} ${tokens.nestedCardBorder} ${tokens.nestedCardBorderRadius} p-3`}>
              <div className="flex items-start gap-2">
                <LockKeyhole size={14} className={`mt-0.5 shrink-0 ${isMacos ? 'text-indigo-500 dark:text-indigo-300' : tokens.textMuted}`} />
                <p className={`text-xs leading-relaxed ${tokens.textSecondary}`}>
                  {t('agentDemo.scopeNotice', lang)}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 p-5 md:p-6">
            <section className={`${tokens.nestedCardBg} ${tokens.nestedCardBorder} ${tokens.nestedCardBorderRadius} min-h-52 p-4`}>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className={`flex items-center gap-2 text-sm font-semibold ${tokens.textPrimary} ${isMacos ? '' : 'font-mono uppercase'}`}>
                  <Sparkles size={15} />
                  {t('agentDemo.answerTitle', lang)}
                </h2>
                {requestState === 'rate_limited' && (
                  <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                    429
                  </span>
                )}
              </div>

              {requestState === 'idle' && (
                <p className={`text-sm leading-7 ${tokens.textSecondary}`}>
                  {t('agentDemo.emptyAnswer', lang)}
                </p>
              )}

              {requestState === 'loading' && (
                <div className={`flex min-h-32 items-center justify-center gap-2 text-sm ${tokens.textSecondary}`}>
                  <Loader2 size={16} className="animate-spin" />
                  <span>{t('agentDemo.loadingDetail', lang)}</span>
                </div>
              )}

              {requestState !== 'idle' && requestState !== 'loading' && response && (
                <div className="space-y-3">
                  {(requestState === 'error' || requestState === 'rate_limited') && (
                    <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-500/30 dark:bg-amber-950/30 dark:text-amber-300">
                      <AlertCircle size={14} className="mt-0.5 shrink-0" />
                      <span>{errorMessage || response.answer}</span>
                    </div>
                  )}
                  <p className={`whitespace-pre-wrap text-sm leading-7 ${tokens.textPrimary}`}>
                    {response.answer}
                  </p>
                  {resetTime && (
                    <p className={`text-[11px] ${tokens.textMuted}`}>
                      {t('agentDemo.rateLimitReset', lang)} {resetTime}
                    </p>
                  )}
                  {response.requestId && requestState === 'success' && (
                    <div className={`rounded-md border border-zinc-200/70 bg-white/55 p-3 dark:border-zinc-800 dark:bg-black/20 ${isMacos ? '' : 'font-mono'}`}>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className={`text-xs font-medium ${tokens.textPrimary}`}>
                          {t('agentDemo.feedbackQuestion', lang)}
                        </p>
                        <div className="grid grid-cols-2 gap-2 sm:flex">
                          <button
                            type="button"
                            onClick={() => void submitFeedback('helpful')}
                            disabled={feedbackState === 'submitting' || feedbackState === 'submitted'}
                            className={`inline-flex min-h-9 items-center justify-center gap-2 rounded-md border px-3 py-2 text-xs transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${
                              submittedFeedback === 'helpful'
                                ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-950/30 dark:text-emerald-300'
                                : `border-zinc-200 bg-white/70 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-black/20 dark:hover:bg-zinc-900 ${tokens.textSecondary}`
                            }`}
                          >
                            <ThumbsUp size={13} />
                            <span>{t('agentDemo.feedbackHelpful', lang)}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => void submitFeedback('not_helpful')}
                            disabled={feedbackState === 'submitting' || feedbackState === 'submitted'}
                            className={`inline-flex min-h-9 items-center justify-center gap-2 rounded-md border px-3 py-2 text-xs transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${
                              submittedFeedback === 'not_helpful'
                                ? 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-950/30 dark:text-amber-300'
                                : `border-zinc-200 bg-white/70 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-black/20 dark:hover:bg-zinc-900 ${tokens.textSecondary}`
                            }`}
                          >
                            <ThumbsDown size={13} />
                            <span>{t('agentDemo.feedbackNotHelpful', lang)}</span>
                          </button>
                        </div>
                      </div>
                      {feedbackState === 'submitting' && (
                        <p className={`mt-2 flex items-center gap-2 text-[11px] ${tokens.textMuted}`}>
                          <Loader2 size={12} className="animate-spin" />
                          {t('agentDemo.feedbackSubmitting', lang)}
                        </p>
                      )}
                      {feedbackState === 'submitted' && (
                        <p className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-300">
                          {t('agentDemo.feedbackThanks', lang)}
                        </p>
                      )}
                      {feedbackState === 'error' && feedbackError && (
                        <p className="mt-2 text-[11px] text-rose-600 dark:text-rose-300">
                          {feedbackError}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </section>

            <section className={`${tokens.nestedCardBg} ${tokens.nestedCardBorder} ${tokens.nestedCardBorderRadius} p-4`}>
              <h2 className={`mb-3 text-sm font-semibold ${tokens.textPrimary} ${isMacos ? '' : 'font-mono uppercase'}`}>
                {t('agentDemo.traceTitle', lang)}
              </h2>
              <div className="grid grid-cols-1 gap-2">
                {(response?.trace ?? []).length > 0 ? (
                  response?.trace.map((step) => {
                    const Icon = getTraceIcon(step);
                    return (
                      <div key={step.step} className={`rounded-md border px-3 py-2 ${getTraceClass(step.status)}`}>
                        <div className="flex items-center gap-2">
                          <Icon size={14} className="shrink-0" />
                          <span className="min-w-0 flex-1 text-xs font-medium">{step.label}</span>
                          <span className="text-[10px] uppercase">{step.status}</span>
                        </div>
                        {step.detail && (
                          <p className="mt-1 pl-6 text-[11px] leading-relaxed opacity-80">
                            {step.detail}
                          </p>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className={`text-xs ${tokens.textSecondary}`}>
                    {t('agentDemo.emptyTrace', lang)}
                  </p>
                )}
              </div>
            </section>

            <section className={`${tokens.nestedCardBg} ${tokens.nestedCardBorder} ${tokens.nestedCardBorderRadius} p-4`}>
              <h2 className={`mb-3 text-sm font-semibold ${tokens.textPrimary} ${isMacos ? '' : 'font-mono uppercase'}`}>
                {t('agentDemo.sourcesTitle', lang)}
              </h2>
              <div className="grid grid-cols-1 gap-2">
                {response?.sources.length ? (
                  response.sources.map((source) => (
                    <div key={`${source.type}-${source.url ?? source.title}`} className="rounded-md border border-zinc-200/70 bg-white/55 px-3 py-2 dark:border-zinc-800 dark:bg-black/20">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className={`text-[10px] uppercase ${tokens.textMuted}`}>
                            {source.type}
                          </div>
                          <div className={`mt-1 text-xs font-medium ${tokens.textPrimary}`}>
                            {source.title}
                          </div>
                        </div>
                        {source.url && (
                          <Link href={source.url} className={`shrink-0 ${tokens.textMuted} hover:text-zinc-900 dark:hover:text-white`} aria-label={source.title}>
                            <ArrowUpRight size={13} />
                          </Link>
                        )}
                      </div>
                      {source.excerpt && (
                        <p className={`mt-2 max-h-16 overflow-hidden text-[11px] leading-relaxed ${tokens.textSecondary}`}>
                          {source.excerpt}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className={`text-xs ${tokens.textSecondary}`}>
                    {t('agentDemo.emptySources', lang)}
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
