'use client';

import { useActionState } from 'react';
import { useState } from 'react';
import { Save } from 'lucide-react';
import type { AdminHomepageSection } from '@/lib/admin';
import { saveHomepageSectionAction } from '../profile-content-actions';
import type { AdminContentFormState } from '../profile-content-actions';

interface HeroSectionFormProps {
  section: AdminHomepageSection;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600 dark:text-red-300">{message}</p>;
}

const emptyAdminContentFormState: AdminContentFormState = {
  ok: false,
  message: '',
  fieldErrors: {},
};

function readBadge(data: AdminHomepageSection['data']): string {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return '';
  }

  const badge = data.badge;
  return typeof badge === 'string' ? badge : '';
}

export function HeroSectionForm({ section }: HeroSectionFormProps) {
  const [state, formAction, pending] = useActionState(
    saveHomepageSectionAction,
    emptyAdminContentFormState,
  );
  const [badge, setBadge] = useState(() => readBadge(section.data));
  const dataValue = JSON.stringify({ badge: badge.trim() });

  return (
    <form action={formAction} className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
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

      <input type="hidden" name="key" value="hero" />
      <input type="hidden" name="lang" value={section.lang} />
      <input type="hidden" name="displayOrder" value="0" />
      <input type="hidden" name="data" value={dataValue} />
      <input type="hidden" name="contentMarkdown" value="" />

      <div className="space-y-5">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input name="visible" type="checkbox" defaultChecked={section.visible} />
            Visible on public database-mode homepage
          </label>
        </div>

        <label className="block text-sm font-medium">
          Title
          <input
            name="title"
            defaultValue={section.title}
            maxLength={160}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          />
          <FieldError message={state.fieldErrors.title} />
        </label>

        <label className="block text-sm font-medium">
          Subtitle
          <input
            name="subtitle"
            defaultValue={section.subtitle}
            maxLength={240}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          />
          <FieldError message={state.fieldErrors.subtitle} />
        </label>

        <label className="block text-sm font-medium">
          Badge
          <input
            name="badge"
            value={badge}
            onChange={(event) => setBadge(event.target.value)}
            maxLength={160}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          />
        </label>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-2 rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          <Save size={15} />
          {pending ? 'Saving...' : 'Save Hero'}
        </button>
      </div>
    </form>
  );
}
