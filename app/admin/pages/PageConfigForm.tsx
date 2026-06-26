'use client';

import { useActionState } from 'react';
import { Save } from 'lucide-react';
import type { AdminPageConfig } from '@/lib/admin/page-config-admin-types';
import type { AdminContentFormState } from '../profile-content-actions';
import { savePageConfigAction } from './actions';

interface PageConfigFormProps {
  config: AdminPageConfig;
}

const emptyAdminContentFormState: AdminContentFormState = {
  ok: false,
  message: '',
  fieldErrors: {},
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600 dark:text-red-300">{message}</p>;
}

function pageLabel(config: AdminPageConfig): string {
  const keyLabel = config.key === 'projects' ? 'Projects' : 'Blog';
  return `${keyLabel} / ${config.lang}`;
}

export function PageConfigForm({ config }: PageConfigFormProps) {
  const [state, formAction, pending] = useActionState(
    savePageConfigAction,
    emptyAdminContentFormState,
  );
  const dataValue = JSON.stringify(config.data ?? {});

  return (
    <form
      action={formAction}
      className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="mb-5 flex flex-col gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-semibold">{pageLabel(config)}</h2>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Page title, supporting copy, footer, and SEO metadata.
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input name="published" type="checkbox" defaultChecked={config.published} />
          Published
        </label>
      </div>

      {state.message ? (
        <div
          className={`mb-4 rounded-md border px-3 py-2 text-sm ${
            state.ok
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-200'
              : 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-200'
          }`}
        >
          {state.message}
        </div>
      ) : null}

      <input type="hidden" name="key" value={config.key} />
      <input type="hidden" name="lang" value={config.lang} />
      <input type="hidden" name="data" value={dataValue} />

      <div className="space-y-5">
        <label className="block text-sm font-medium">
          Title
          <input
            name="title"
            defaultValue={config.title}
            maxLength={160}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          />
          <FieldError message={state.fieldErrors.title} />
        </label>

        <label className="block text-sm font-medium">
          Subtitle
          <textarea
            name="subtitle"
            defaultValue={config.subtitle}
            maxLength={500}
            rows={3}
            className="mt-1 w-full resize-y rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          />
          <FieldError message={state.fieldErrors.subtitle} />
        </label>

        <label className="block text-sm font-medium">
          Footer
          <input
            name="footer"
            defaultValue={config.footer}
            maxLength={160}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          />
          <FieldError message={state.fieldErrors.footer} />
        </label>

        <label className="block text-sm font-medium">
          SEO title
          <input
            name="seoTitle"
            defaultValue={config.seoTitle}
            maxLength={160}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          />
          <FieldError message={state.fieldErrors.seoTitle} />
        </label>

        <label className="block text-sm font-medium">
          SEO description
          <textarea
            name="seoDescription"
            defaultValue={config.seoDescription}
            maxLength={300}
            rows={3}
            className="mt-1 w-full resize-y rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          />
          <FieldError message={state.fieldErrors.seoDescription} />
        </label>
      </div>

      <FieldError message={state.fieldErrors.key} />
      <FieldError message={state.fieldErrors.lang} />
      <FieldError message={state.fieldErrors.data} />

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-2 rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          <Save size={15} />
          {pending ? 'Saving...' : 'Save Config'}
        </button>
      </div>
    </form>
  );
}
