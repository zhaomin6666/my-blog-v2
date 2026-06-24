'use client';

import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import type { AdminContactChannel } from '@/lib/admin';
import {
  CONTACT_PLATFORM_META,
  CONTACT_PLATFORM_OPTIONS,
  isContactPlatform,
} from '@/lib/profile/contact-platforms';
import { reorderContactChannelsAction } from '../profile-content-actions';
import { ContactChannelForm } from './ContactChannelForm';

interface ContactAdminPanelProps {
  channels: AdminContactChannel[];
}

function ContactListItem({
  channel,
  selected,
  canMoveUp,
  canMoveDown,
  onSelect,
  onMove,
}: {
  channel: AdminContactChannel;
  selected: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onSelect: () => void;
  onMove: (direction: 'up' | 'down') => void;
}) {
  const platform = isContactPlatform(channel.platform) ? channel.platform : 'custom';
  const Icon = CONTACT_PLATFORM_META[platform].icon;
  const title = channel.platform === 'custom'
    ? channel.customLabel || 'Custom'
    : CONTACT_PLATFORM_META[platform].label;

  return (
    <div
      className={`rounded-md border px-3 py-3 transition ${
        selected
          ? 'border-zinc-950 bg-zinc-950 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-950'
          : 'border-zinc-200 bg-white text-zinc-800 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-600'
      }`}
    >
      <div className="flex items-start gap-3">
        <button type="button" onClick={onSelect} className="flex min-w-0 flex-1 items-start gap-3 text-left">
          <Icon size={18} className="mt-0.5 shrink-0" />
          <div className="min-w-0">
            <div className="text-sm font-medium">{title}</div>
            <div className={`truncate text-xs ${selected ? 'text-zinc-300 dark:text-zinc-700' : 'text-zinc-500 dark:text-zinc-400'}`}>
              {channel.value}
            </div>
          </div>
        </button>

        <div className="flex shrink-0 flex-col gap-1">
          <button
            type="button"
            onClick={() => onMove('up')}
            disabled={!canMoveUp}
            className="rounded border border-current/20 p-1 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Move up"
          >
            <ArrowUp size={14} />
          </button>
          <button
            type="button"
            onClick={() => onMove('down')}
            disabled={!canMoveDown}
            className="rounded border border-current/20 p-1 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Move down"
          >
            <ArrowDown size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ContactAdminPanel({ channels }: ContactAdminPanelProps) {
  const sortedChannels = useMemo(
    () => [...channels].sort((left, right) => left.displayOrder - right.displayOrder),
    [channels],
  );
  const [selectedId, setSelectedId] = useState<string>(sortedChannels[0]?.id ?? '');
  const selectedChannel = sortedChannels.find((channel) => channel.id === selectedId) ?? null;

  const existingPlatforms = new Set(
    sortedChannels.filter((channel) => channel.platform !== 'custom').map((channel) => channel.platform),
  );
  const addablePlatforms = CONTACT_PLATFORM_OPTIONS.filter(
    (option) => option.value === 'custom' || !existingPlatforms.has(option.value),
  ).map((option) => option.value);

  const handleMove = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = sortedChannels.findIndex((channel) => channel.id === id);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= sortedChannels.length) {
      return;
    }

    const reordered = [...sortedChannels];
    const [item] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, item);

    const formData = new FormData();
    formData.set(
      'ids',
      reordered.map((channel) => channel.id).join(','),
    );
    await reorderContactChannelsAction(formData);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold">Configured Methods</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{sortedChannels.length} items</p>
          </div>
        </div>

        <div className="space-y-2">
          {sortedChannels.length === 0 ? (
            <div className="rounded-md border border-dashed border-zinc-300 px-3 py-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
              No contact methods yet
            </div>
          ) : (
            sortedChannels.map((channel, index) => (
              <ContactListItem
                key={channel.id}
                channel={channel}
                selected={channel.id === selectedId}
                canMoveUp={index > 0}
                canMoveDown={index < sortedChannels.length - 1}
                onSelect={() => setSelectedId(channel.id)}
                onMove={(direction) => void handleMove(channel.id, direction)}
              />
            ))
          )}
        </div>
      </aside>

      <div className="space-y-5 min-w-0">
        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-4">
            <div>
              <h2 className="text-sm font-semibold">Add Contact Method</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Choose a platform in the form and save it once.</p>
            </div>
          </div>

          {addablePlatforms.length === 0 ? (
            <div className="rounded-md border border-dashed border-zinc-300 px-3 py-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
              All preset platforms are already added.
            </div>
          ) : (
            <ContactChannelForm
              platform={addablePlatforms[0]}
              availablePlatforms={addablePlatforms}
            />
          )}
        </section>

        <section className="min-w-0">
          {selectedChannel ? (
            <ContactChannelForm key={selectedChannel.id} channel={selectedChannel} />
          ) : (
            <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
              Select a contact method from the left to edit it.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
