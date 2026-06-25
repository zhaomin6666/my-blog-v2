'use client';

import { useActionState } from 'react';
import { Save } from 'lucide-react';
import type { AdminProject } from '@/lib/admin';
import type { AdminProjectFormState } from './actions';
import { createProjectAction, updateProjectAction } from './actions';

const emptyState: AdminProjectFormState = {
  ok: false,
  message: '',
  fieldErrors: {},
};

const emptyProject: AdminProject = {
  id: '',
  title: '',
  slug: '',
  subtitle: '',
  summary: '',
  contentMarkdown: '',
  status: 'building',
  type: '',
  role: [],
  timeline: '',
  published: false,
  featured: false,
  displayOrder: 0,
  techStack: [],
  features: [],
  highlights: [],
  links: {},
  relatedPosts: [],
  relatedSeriesSlug: '',
  lang: 'zh',
  seoTitle: '',
  seoDescription: '',
  createdAt: '',
  updatedAt: '',
};

interface ProjectFormProps {
  project?: AdminProject;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="mt-1 text-xs text-red-600 dark:text-red-300">{message}</p>;
}

function jsonValue(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

export function ProjectForm({ project = emptyProject }: ProjectFormProps) {
  const action = project.id ? updateProjectAction.bind(null, project.id) : createProjectAction;
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
            defaultValue={project.title}
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
            defaultValue={project.slug}
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
            defaultValue={project.status}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          >
            <option value="building">building</option>
            <option value="mvp">mvp</option>
            <option value="production">production</option>
          </select>
          <FieldError message={state.fieldErrors.status} />
        </label>

        <label className="block text-sm font-medium">
          Language
          <select
            name="lang"
            defaultValue={project.lang}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          >
            <option value="zh">zh</option>
            <option value="en">en</option>
          </select>
          <FieldError message={state.fieldErrors.lang} />
        </label>

        <label className="block text-sm font-medium">
          Type
          <input
            name="type"
            defaultValue={project.type}
            maxLength={120}
            placeholder="AI Demo / Developer Tool"
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          />
          <FieldError message={state.fieldErrors.type} />
        </label>

        <label className="block text-sm font-medium">
          Timeline
          <input
            name="timeline"
            defaultValue={project.timeline}
            maxLength={160}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          />
        </label>

        <label className="block text-sm font-medium md:col-span-2">
          Subtitle
          <input
            name="subtitle"
            defaultValue={project.subtitle}
            maxLength={240}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          />
          <FieldError message={state.fieldErrors.subtitle} />
        </label>

        <label className="block text-sm font-medium md:col-span-2">
          Summary
          <textarea
            name="summary"
            defaultValue={project.summary}
            rows={3}
            maxLength={700}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          />
          <FieldError message={state.fieldErrors.summary} />
        </label>
      </section>

      <section className="grid gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:grid-cols-3">
        <label className="flex items-center gap-2 rounded-md border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-800">
          <input name="published" type="checkbox" defaultChecked={project.published} />
          Published
        </label>

        <label className="flex items-center gap-2 rounded-md border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-800">
          <input name="featured" type="checkbox" defaultChecked={project.featured} />
          Featured
        </label>

        <label className="block text-sm font-medium">
          Display Order
          <input
            name="displayOrder"
            type="number"
            step={1}
            defaultValue={project.displayOrder}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          />
          <FieldError message={state.fieldErrors.displayOrder} />
        </label>
      </section>

      <section className="grid gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:grid-cols-2">
        <label className="block text-sm font-medium">
          Role JSON
          <textarea
            name="role"
            defaultValue={jsonValue(project.role)}
            rows={6}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 font-mono text-xs leading-5 outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          />
          <FieldError message={state.fieldErrors.role} />
        </label>

        <label className="block text-sm font-medium">
          Tech Stack JSON
          <textarea
            name="techStack"
            defaultValue={jsonValue(project.techStack)}
            rows={6}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 font-mono text-xs leading-5 outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          />
          <FieldError message={state.fieldErrors.techStack} />
        </label>

        <label className="block text-sm font-medium">
          Features JSON
          <textarea
            name="features"
            defaultValue={jsonValue(project.features)}
            rows={8}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 font-mono text-xs leading-5 outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          />
          <FieldError message={state.fieldErrors.features} />
        </label>

        <label className="block text-sm font-medium">
          Highlights JSON
          <textarea
            name="highlights"
            defaultValue={jsonValue(project.highlights)}
            rows={8}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 font-mono text-xs leading-5 outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          />
          <FieldError message={state.fieldErrors.highlights} />
        </label>

        <label className="block text-sm font-medium">
          Links JSON Object
          <textarea
            name="links"
            defaultValue={jsonValue(project.links)}
            rows={7}
            placeholder='{"live":"https://example.com","github":"https://github.com/..."}'
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 font-mono text-xs leading-5 outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          />
          <FieldError message={state.fieldErrors.links} />
        </label>

        <label className="block text-sm font-medium">
          Related Posts JSON
          <textarea
            name="relatedPosts"
            defaultValue={jsonValue(project.relatedPosts)}
            rows={7}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 font-mono text-xs leading-5 outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          />
          <FieldError message={state.fieldErrors.relatedPosts} />
        </label>

        <label className="block text-sm font-medium">
          Related Series Slug
          <input
            name="relatedSeriesSlug"
            defaultValue={project.relatedSeriesSlug}
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 font-mono text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          />
          <FieldError message={state.fieldErrors.relatedSeriesSlug} />
        </label>

        <label className="block text-sm font-medium">
          SEO Title
          <input
            name="seoTitle"
            defaultValue={project.seoTitle}
            maxLength={180}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          />
          <FieldError message={state.fieldErrors.seoTitle} />
        </label>

        <label className="block text-sm font-medium md:col-span-2">
          SEO Description
          <input
            name="seoDescription"
            defaultValue={project.seoDescription}
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
            defaultValue={project.contentMarkdown}
            rows={26}
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
