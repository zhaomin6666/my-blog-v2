'use client';

import { useActionState, useMemo, useState } from 'react';
import { Save } from 'lucide-react';
import type { AdminProfilePage } from '@/lib/admin';
import { saveProfilePageAction } from '../profile-content-actions';
import type { AdminContentFormState } from '../profile-content-actions';
import {
  formatLineDelimitedList,
  formatPipeDelimitedList,
  mergeLineDelimitedListByLanguage,
  mergeLinksByLanguage,
  mergePipeDelimitedListByLanguage,
  type LocalizedText,
  type ProfileLinkInput,
} from './profile-form-utils';

interface StructuredProfileFormProps {
  profilePage: AdminProfilePage;
}

type ProfileFieldLabel = 'about.role' | 'about.direction' | 'about.status';
type ProfileField = { labelKey: ProfileFieldLabel; value: LocalizedText };

interface EditableProfileData {
  published: boolean;
  role: LocalizedText;
  status: LocalizedText;
  intro: LocalizedText;
  privacyNote: LocalizedText;
  fields: ProfileField[];
  focus: LocalizedText[];
  background: LocalizedText[];
  building: ProfileLinkInput[];
  workStyle: LocalizedText[];
}

const emptyAdminContentFormState: AdminContentFormState = {
  ok: false,
  message: '',
  fieldErrors: {},
};

const fieldLabels: Array<{ key: ProfileFieldLabel; label: string }> = [
  { key: 'about.role', label: 'Role' },
  { key: 'about.direction', label: 'Direction' },
  { key: 'about.status', label: 'Status' },
];

function emptyText(): LocalizedText {
  return { zh: '', en: '' };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toText(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function readLocalizedText(value: unknown): LocalizedText {
  if (!isRecord(value)) return emptyText();
  return {
    zh: toText(value.zh),
    en: toText(value.en),
  };
}

function readLocalizedTextArray(value: unknown): LocalizedText[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => readLocalizedText(item)).filter((item) => item.zh || item.en);
}

function readProfileFields(value: unknown): ProfileField[] {
  const fallbackFields = fieldLabels.map((field) => ({
    labelKey: field.key,
    value: emptyText(),
  }));

  if (!Array.isArray(value)) {
    return fallbackFields;
  }

  const fields = value
    .map((item) => {
      if (!isRecord(item)) return null;
      const labelKey = item.labelKey;
      if (labelKey !== 'about.role' && labelKey !== 'about.direction' && labelKey !== 'about.status') {
        return null;
      }

      return {
        labelKey,
        value: readLocalizedText(item.value),
      };
    })
    .filter((item): item is ProfileField => item !== null);

  return fieldLabels.map((field) => {
    return fields.find((item) => item.labelKey === field.key) ?? {
      labelKey: field.key,
      value: emptyText(),
    };
  });
}

function readProfileLinks(value: unknown): ProfileLinkInput[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!isRecord(item)) return null;
      return {
        href: toText(item.href),
        label: readLocalizedText(item.label),
        description: readLocalizedText(item.description),
      };
    })
    .filter((item): item is ProfileLinkInput => item !== null);
}

function buildEditableProfileData(data: unknown): EditableProfileData {
  const record = isRecord(data) ? data : {};
  return {
    published: record.published !== false,
    role: readLocalizedText(record.role),
    status: readLocalizedText(record.status),
    intro: readLocalizedText(record.intro),
    privacyNote: readLocalizedText(record.privacyNote),
    fields: readProfileFields(record.fields),
    focus: readLocalizedTextArray(record.focus),
    background: readLocalizedTextArray(record.background),
    building: readProfileLinks(record.building),
    workStyle: readLocalizedTextArray(record.workStyle),
  };
}

function stringifyData(value: unknown): string {
  return JSON.stringify(value ?? {});
}

function textareaRows(lines: number, minimum = 3): number {
  return Math.max(minimum, lines);
}

export function StructuredProfileForm({ profilePage }: StructuredProfileFormProps) {
  const [state, formAction, pending] = useActionState(
    saveProfilePageAction,
    emptyAdminContentFormState,
  );
  const initialData = useMemo(() => buildEditableProfileData(profilePage.data), [profilePage.data]);
  const [editableData, setEditableData] = useState<EditableProfileData>(initialData);
  const [focusInput, setFocusInput] = useState(() => formatPipeDelimitedList(initialData.focus, profilePage.lang));
  const [backgroundInput, setBackgroundInput] = useState(() => formatPipeDelimitedList(initialData.background, profilePage.lang));
  const [workStyleInput, setWorkStyleInput] = useState(() => formatLineDelimitedList(initialData.workStyle, profilePage.lang));
  const [buildingInput, setBuildingInput] = useState(() =>
    initialData.building
      .map((item) => [item.label[profilePage.lang], item.description[profilePage.lang], item.href].join(' | '))
      .join('\n'),
  );

  const activeLang = profilePage.lang;
  const preservedTitle = profilePage.title.slice(0, 160);
  const preservedSummary = profilePage.summary.slice(0, 800);

  const updateLocalizedField = (key: keyof Pick<EditableProfileData, 'intro' | 'privacyNote' | 'role' | 'status'>, value: string) => {
    setEditableData((current) => ({
      ...current,
      [key]: {
        ...current[key],
        [activeLang]: value,
      },
    }));
  };

  const updateProfileField = (labelKey: ProfileFieldLabel, value: string) => {
    setEditableData((current) => {
      const nextData: EditableProfileData = {
        ...current,
        fields: current.fields.map((field) =>
          field.labelKey === labelKey
            ? {
                ...field,
                value: {
                  ...field.value,
                  [activeLang]: value,
                },
              }
            : field,
        ),
      };

      if (labelKey === 'about.role') {
        nextData.role = {
          ...current.role,
          [activeLang]: value,
        };
      }

      if (labelKey === 'about.status') {
        nextData.status = {
          ...current.status,
          [activeLang]: value,
        };
      }

      return nextData;
    });
  };

  const roleField = editableData.fields.find((field) => field.labelKey === 'about.role') ?? {
    labelKey: 'about.role' as const,
    value: emptyText(),
  };
  const directionField = editableData.fields.find((field) => field.labelKey === 'about.direction') ?? {
    labelKey: 'about.direction' as const,
    value: emptyText(),
  };
  const statusField = editableData.fields.find((field) => field.labelKey === 'about.status') ?? {
    labelKey: 'about.status' as const,
    value: emptyText(),
  };

  const serializedData = stringifyData({
    ...editableData,
    focus: mergePipeDelimitedListByLanguage(editableData.focus, focusInput, activeLang),
    background: mergePipeDelimitedListByLanguage(editableData.background, backgroundInput, activeLang),
    workStyle: mergeLineDelimitedListByLanguage(editableData.workStyle, workStyleInput, activeLang),
    building: mergeLinksByLanguage(editableData.building, buildingInput, activeLang),
    published: true,
  });

  return (
    <form action={formAction} className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <input type="hidden" name="key" value="profile" />
      <input type="hidden" name="title" value={preservedTitle} />
      <input type="hidden" name="summary" value={preservedSummary} />
      <input type="hidden" name="lang" value={profilePage.lang} />
      <input type="hidden" name="contentMarkdown" value="" />
      <input type="hidden" name="data" value={serializedData} />

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

      <div className="space-y-5">
        <label className="block text-sm font-medium">
          Intro
          <textarea
            value={editableData.intro[activeLang]}
            onChange={(event) => updateLocalizedField('intro', event.target.value)}
            rows={4}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="block text-sm font-medium">
            Role
            <textarea
              value={roleField.value[activeLang]}
              onChange={(event) => updateProfileField('about.role', event.target.value)}
              rows={3}
              className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
            />
          </label>

          <label className="block text-sm font-medium">
            Direction
            <textarea
              value={directionField.value[activeLang]}
              onChange={(event) => updateProfileField('about.direction', event.target.value)}
              rows={3}
              className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
            />
          </label>

          <label className="block text-sm font-medium">
            Status
            <textarea
              value={statusField.value[activeLang]}
              onChange={(event) => updateProfileField('about.status', event.target.value)}
              rows={3}
              className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
            />
          </label>
        </div>

        <label className="block text-sm font-medium">
          Current Focus
          <textarea
            value={focusInput}
            onChange={(event) => setFocusInput(event.target.value)}
            rows={4}
            placeholder="AI Agent | TypeScript | Next.js"
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Use `|` to split multiple focus tags in one field.
          </p>
        </label>

        <label className="block text-sm font-medium">
          Background
          <textarea
            value={backgroundInput}
            onChange={(event) => setBackgroundInput(event.target.value)}
            rows={5}
            placeholder="Enterprise systems | Bidding and procurement | Delivery records"
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Use `|` to split multiple background entries in one field.
          </p>
        </label>

        <label className="block text-sm font-medium">
          Building
          <textarea
            value={buildingInput}
            onChange={(event) => setBuildingInput(event.target.value)}
            rows={textareaRows(buildingInput.split(/\r?\n/).length, 5)}
            placeholder="个人网站 | 主站入口 | https://oli6666.top/"
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            One item per line. Format each line as `Title | Description | https://...`. Homepage only shows entries that include a link.
          </p>
        </label>

        <label className="block text-sm font-medium">
          Work Style
          <textarea
            value={workStyleInput}
            onChange={(event) => setWorkStyleInput(event.target.value)}
            rows={textareaRows(workStyleInput.split(/\r?\n/).length, 4)}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          />
        </label>

        <label className="block text-sm font-medium">
          Privacy Note
          <textarea
            value={editableData.privacyNote[activeLang]}
            onChange={(event) => updateLocalizedField('privacyNote', event.target.value)}
            rows={3}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
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
          {pending ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </form>
  );
}
