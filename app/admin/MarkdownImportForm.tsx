'use client';

import { useActionState } from 'react';
import { Upload } from 'lucide-react';
import type { ContentImportActionState } from './markdown-import-actions';

const initialContentImportState: ContentImportActionState = {
  ok: false,
  message: '',
  report: null,
};

function actionTone(action: string): string {
  if (action.includes('create')) return 'text-emerald-700 dark:text-emerald-300';
  if (action.includes('update')) return 'text-sky-700 dark:text-sky-300';
  if (action === 'invalid' || action === 'failed') return 'text-red-700 dark:text-red-300';
  return 'text-zinc-600 dark:text-zinc-300';
}

interface MarkdownImportFormProps {
  title: string;
  description: string;
  submitLabel: string;
  importAction: (
    previousState: ContentImportActionState,
    formData: FormData,
  ) => Promise<ContentImportActionState>;
}

export function MarkdownImportForm({
  title,
  description,
  submitLabel,
  importAction,
}: MarkdownImportFormProps) {
  const [state, formAction, pending] = useActionState(importAction, initialContentImportState);

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950">
          <Upload size={17} />
        </div>
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
        </div>
      </div>

      <form action={formAction} className="grid gap-4">
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium">Import Mode</span>
          <select
            name="mode"
            defaultValue="dry-run"
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          >
            <option value="dry-run">dry-run</option>
            <option value="create_only">create_only</option>
            <option value="update_by_slug">update_by_slug</option>
            <option value="create_or_update">create_or_update</option>
          </select>
        </label>

        <label className="grid gap-1.5 text-sm">
          <span className="font-medium">Markdown Files</span>
          <input
            name="files"
            type="file"
            accept=".md,text/markdown,text/plain"
            multiple
            className="rounded-md border border-dashed border-zinc-300 bg-zinc-50 px-3 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>

        <label className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-100">
          <input name="confirmWrite" type="checkbox" className="mt-1" />
          <span>
            I understand non-dry-run import writes to PostgreSQL. It does not change CONTENT_SOURCE,
            delete Markdown files, or delete database rows.
          </span>
        </label>

        <button
          type="submit"
          disabled={pending}
          className="inline-flex w-fit items-center gap-2 rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          <Upload size={15} />
          {pending ? 'Processing...' : submitLabel}
        </button>
      </form>

      {state.message ? (
        <div
          className={`mt-5 rounded-md border p-3 text-sm ${
            state.ok
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-200'
              : 'border-red-200 bg-red-50 text-red-800 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-200'
          }`}
        >
          {state.message}
        </div>
      ) : null}

      {state.report ? (
        <div className="mt-5 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="grid gap-2 border-b border-zinc-200 bg-zinc-50 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-950 md:grid-cols-4">
            <div>Scanned: {state.report.summary.scanned}</div>
            <div>Valid: {state.report.summary.valid}</div>
            <div>Invalid: {state.report.summary.invalid}</div>
            <div>Warnings: {state.report.summary.warnings}</div>
            <div>Created: {state.report.summary.created}</div>
            <div>Updated: {state.report.summary.updated}</div>
            <div>Skipped: {state.report.summary.skipped}</div>
            <div>Failed: {state.report.summary.failed}</div>
            <div>Would create: {state.report.summary.wouldCreate}</div>
            <div>Would update: {state.report.summary.wouldUpdate}</div>
            <div>Would skip: {state.report.summary.wouldSkip}</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="border-b border-zinc-200 text-xs uppercase text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                <tr>
                  <th className="px-4 py-3">File</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Warnings</th>
                  <th className="px-4 py-3">Errors</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {state.report.files.map((file) => (
                  <tr key={file.filename}>
                    <td className="px-4 py-3 font-mono text-xs">{file.filename}</td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-500">
                      {file.slug || '-'}
                    </td>
                    <td className="max-w-[220px] px-4 py-3">{file.title || '-'}</td>
                    <td className={`px-4 py-3 font-medium ${actionTone(file.action)}`}>
                      {file.action}
                    </td>
                    <td className="max-w-[240px] px-4 py-3 text-amber-700 dark:text-amber-300">
                      {file.warnings.join(' | ') || '-'}
                    </td>
                    <td className="max-w-[240px] px-4 py-3 text-red-700 dark:text-red-300">
                      {file.errors.join(' | ') || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </section>
  );
}
