'use client';

import { useActionState } from 'react';
import { Save } from 'lucide-react';
import type { AdminBlogPost } from '@/lib/admin';
import type { AdminBlogFormState } from './actions';
import { createBlogPostAction, updateBlogPostAction } from './actions';

const emptyState: AdminBlogFormState = {
  ok: false,
  message: '',
  fieldErrors: {},
};

const emptyPost: AdminBlogPost = {
  id: '',
  title: '',
  slug: '',
  summary: '',
  contentMarkdown: '',
  status: 'draft',
  lang: 'zh',
  cover: '',
  seoTitle: '',
  seoDescription: '',
  tags: [],
  series: '',
  seriesSlug: '',
  seriesOrder: null,
  date: new Date().toISOString().slice(0, 10),
  publishedAt: '',
  createdAt: '',
  updatedAt: '',
};

interface BlogPostFormProps {
  post?: AdminBlogPost;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="mt-1 text-xs text-red-600 dark:text-red-300">{message}</p>;
}

export function BlogPostForm({ post = emptyPost }: BlogPostFormProps) {
  const action = post.id ? updateBlogPostAction.bind(null, post.id) : createBlogPostAction;
  const [state, formAction, pending] = useActionState(action, emptyState);

  return (
    <form action={formAction} className="space-y-5">
      {state.message ? (
        <div
          className={`rounded-md border px-3 py-2 text-sm ${
            state.ok
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-200'
              : 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-200'
          }`}
        >
          {state.message}
        </div>
      ) : null}

      <section className="grid gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:grid-cols-2">
        <label className="block text-sm font-medium">
          Title
          <input
            name="title"
            defaultValue={post.title}
            required
            maxLength={160}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          />
          <FieldError message={state.fieldErrors.title} />
        </label>

        <label className="block text-sm font-medium">
          Slug
          <input
            name="slug"
            defaultValue={post.slug}
            required
            maxLength={120}
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 font-mono text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          />
          <FieldError message={state.fieldErrors.slug} />
        </label>

        <label className="block text-sm font-medium">
          Status
          <select
            name="status"
            defaultValue={post.status}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          >
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
          <FieldError message={state.fieldErrors.status} />
        </label>

        <label className="block text-sm font-medium">
          Language
          <select
            name="lang"
            defaultValue={post.lang}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          >
            <option value="zh">zh</option>
            <option value="en">en</option>
          </select>
          <FieldError message={state.fieldErrors.lang} />
        </label>

        <label className="block text-sm font-medium md:col-span-2">
          Summary
          <textarea
            name="summary"
            defaultValue={post.summary}
            rows={3}
            maxLength={600}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          />
          <FieldError message={state.fieldErrors.summary} />
        </label>
      </section>

      <section className="grid gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:grid-cols-2">
        <label className="block text-sm font-medium">
          Date
          <input
            name="date"
            type="date"
            defaultValue={post.date}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          />
          <FieldError message={state.fieldErrors.date} />
        </label>

        <label className="block text-sm font-medium">
          Tags
          <input
            name="tags"
            defaultValue={post.tags.join(', ')}
            placeholder="Next.js, PostgreSQL, CMS"
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          />
        </label>

        <label className="block text-sm font-medium">
          Series
          <input
            name="series"
            defaultValue={post.series}
            maxLength={160}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          />
        </label>

        <label className="block text-sm font-medium">
          Series Slug
          <input
            name="seriesSlug"
            defaultValue={post.seriesSlug}
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 font-mono text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          />
          <FieldError message={state.fieldErrors.seriesSlug} />
        </label>

        <label className="block text-sm font-medium">
          Series Order
          <input
            name="seriesOrder"
            type="number"
            min={0}
            defaultValue={post.seriesOrder ?? ''}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          />
          <FieldError message={state.fieldErrors.seriesOrder} />
        </label>

        <label className="block text-sm font-medium">
          Cover
          <input
            name="cover"
            defaultValue={post.cover}
            maxLength={500}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          />
          <FieldError message={state.fieldErrors.cover} />
        </label>

        <label className="block text-sm font-medium">
          SEO Title
          <input
            name="seoTitle"
            defaultValue={post.seoTitle}
            maxLength={180}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          />
          <FieldError message={state.fieldErrors.seoTitle} />
        </label>

        <label className="block text-sm font-medium">
          SEO Description
          <input
            name="seoDescription"
            defaultValue={post.seoDescription}
            maxLength={300}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          />
          <FieldError message={state.fieldErrors.seoDescription} />
        </label>
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <label className="block text-sm font-medium">
          Markdown Content
          <textarea
            name="contentMarkdown"
            defaultValue={post.contentMarkdown}
            rows={24}
            className="mt-1 w-full resize-y rounded-md border border-zinc-300 bg-white px-3 py-2 font-mono text-sm leading-6 outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          />
          <FieldError message={state.fieldErrors.contentMarkdown} />
        </label>
      </section>

      <div className="sticky bottom-0 flex justify-end border-t border-zinc-200 bg-zinc-100/90 py-4 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-2 rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          <Save size={15} />
          {pending ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}
