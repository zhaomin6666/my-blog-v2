'use client';

import { useActionState } from 'react';
import { Save, Trash2 } from 'lucide-react';
import type { AdminStackGroup, AdminStackItem } from '@/lib/admin';
import {
  deleteStackGroupAction,
  deleteStackItemAction,
  saveStackGroupAction,
  saveStackItemAction,
} from '../profile-content-actions';
import type { AdminContentFormState } from '../profile-content-actions';

interface StackGroupFormProps {
  group?: AdminStackGroup;
}

interface StackItemFormProps {
  group: AdminStackGroup;
  item?: AdminStackItem;
}

const emptyGroup: AdminStackGroup = {
  id: '',
  name: '',
  displayOrder: 0,
  items: [],
  createdAt: '',
  updatedAt: '',
};

const emptyItem: AdminStackItem = {
  id: '',
  groupId: '',
  name: '',
  displayOrder: 0,
  createdAt: '',
  updatedAt: '',
};

const emptyAdminContentFormState: AdminContentFormState = {
  ok: false,
  message: '',
  fieldErrors: {},
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600 dark:text-red-300">{message}</p>;
}

export function StackGroupForm({ group = emptyGroup }: StackGroupFormProps) {
  const [state, formAction, pending] = useActionState(
    saveStackGroupAction,
    emptyAdminContentFormState,
  );
  const isEditing = Boolean(group.id);

  return (
    <form action={formAction} className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <input type="hidden" name="id" value={group.id} />
      <input type="hidden" name="displayOrder" value={String(group.displayOrder)} />

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

      <label className="block text-sm font-medium">
        Group Name
        <input
          name="name"
          defaultValue={group.name}
          required
          maxLength={120}
          className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
        />
        <FieldError message={state.fieldErrors.name} />
      </label>

      <div className="mt-4 flex items-center justify-between gap-3">
        {isEditing ? (
          <button
            type="submit"
            formAction={deleteStackGroupAction}
            formNoValidate
            className="flex items-center gap-2 rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-900/70 dark:text-red-200 dark:hover:bg-red-950/40"
          >
            <Trash2 size={15} />
            Delete Group
          </button>
        ) : (
          <span className="text-xs text-zinc-500 dark:text-zinc-400">New group</span>
        )}

        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-2 rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          <Save size={15} />
          {pending ? 'Saving...' : 'Save Group'}
        </button>
      </div>
    </form>
  );
}

export function StackItemForm({ group, item = emptyItem }: StackItemFormProps) {
  const [state, formAction, pending] = useActionState(
    saveStackItemAction,
    emptyAdminContentFormState,
  );
  const isEditing = Boolean(item.id);
  const groupId = item.groupId || group.id;
  const displayOrder = item.id ? item.displayOrder : group.items.length;

  return (
    <form action={formAction} className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <input type="hidden" name="id" value={item.id} />
      <input type="hidden" name="groupId" value={groupId} />
      <input type="hidden" name="displayOrder" value={String(displayOrder)} />

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

      <div className="mb-4 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
        Group: {group.name || 'Untitled Group'}
      </div>

      <label className="block text-sm font-medium">
        Item Name
        <input
          name="name"
          defaultValue={item.name}
          required
          maxLength={120}
          className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
        />
        <FieldError message={state.fieldErrors.name} />
      </label>

      <div className="mt-4 flex items-center justify-between gap-3">
        {isEditing ? (
          <button
            type="submit"
            formAction={deleteStackItemAction}
            formNoValidate
            className="flex items-center gap-2 rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-900/70 dark:text-red-200 dark:hover:bg-red-950/40"
          >
            <Trash2 size={15} />
            Delete Item
          </button>
        ) : (
          <span className="text-xs text-zinc-500 dark:text-zinc-400">New item</span>
        )}

        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-2 rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          <Save size={15} />
          {pending ? 'Saving...' : 'Save Item'}
        </button>
      </div>
    </form>
  );
}
