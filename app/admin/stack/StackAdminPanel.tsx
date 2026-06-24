'use client';

import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import type { AdminStackGroup } from '@/lib/admin';
import { reorderStackGroupsAction, reorderStackItemsAction } from '../profile-content-actions';
import { StackGroupForm, StackItemForm } from './StackForms';

interface StackAdminPanelProps {
  groups: AdminStackGroup[];
}

function sortGroups(groups: AdminStackGroup[]): AdminStackGroup[] {
  return [...groups].sort((left, right) => left.displayOrder - right.displayOrder);
}

function sortItems(group: AdminStackGroup) {
  return [...group.items].sort((left, right) => left.displayOrder - right.displayOrder);
}

function StackListItem({
  group,
  selected,
  canMoveUp,
  canMoveDown,
  onSelect,
  onMove,
}: {
  group: AdminStackGroup;
  selected: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onSelect: () => void;
  onMove: (direction: 'up' | 'down') => void;
}) {
  return (
    <div
      className={`rounded-md border px-3 py-3 transition ${
        selected
          ? 'border-zinc-950 bg-zinc-950 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-950'
          : 'border-zinc-200 bg-white text-zinc-800 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-600'
      }`}
    >
      <div className="flex items-start gap-3">
        <button type="button" onClick={onSelect} className="flex min-w-0 flex-1 items-start text-left">
          <div className="min-w-0">
            <div className="text-sm font-medium">{group.name || 'Untitled Group'}</div>
            <div className={`truncate text-xs ${selected ? 'text-zinc-300 dark:text-zinc-700' : 'text-zinc-500 dark:text-zinc-400'}`}>
              {group.items.length} items
            </div>
          </div>
        </button>

        <div className="flex shrink-0 flex-col gap-1">
          <button
            type="button"
            onClick={() => onMove('up')}
            disabled={!canMoveUp}
            className="rounded border border-current/20 p-1 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Move group up"
          >
            <ArrowUp size={14} />
          </button>
          <button
            type="button"
            onClick={() => onMove('down')}
            disabled={!canMoveDown}
            className="rounded border border-current/20 p-1 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Move group down"
          >
            <ArrowDown size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function StackAdminPanel({ groups }: StackAdminPanelProps) {
  const sortedGroups = useMemo(() => sortGroups(groups), [groups]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(sortedGroups[0]?.id ?? '');
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const selectedGroup = sortedGroups.find((group) => group.id === selectedGroupId) ?? null;
  const sortedItems = selectedGroup ? sortItems(selectedGroup) : [];
  const selectedItem = sortedItems.find((item) => item.id === selectedItemId) ?? null;

  const handleGroupMove = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = sortedGroups.findIndex((group) => group.id === id);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= sortedGroups.length) {
      return;
    }

    const reordered = [...sortedGroups];
    const [item] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, item);

    const formData = new FormData();
    formData.set('ids', reordered.map((group) => group.id).join(','));
    await reorderStackGroupsAction(formData);
  };

  const handleItemMove = async (id: string, direction: 'up' | 'down') => {
    if (!selectedGroup) return;

    const currentIndex = sortedItems.findIndex((item) => item.id === id);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= sortedItems.length) {
      return;
    }

    const reordered = [...sortedItems];
    const [item] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, item);

    const formData = new FormData();
    formData.set('groupId', selectedGroup.id);
    formData.set('ids', reordered.map((entry) => entry.id).join(','));
    await reorderStackItemsAction(formData);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-3">
          <h2 className="text-sm font-semibold">Groups</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{sortedGroups.length} items</p>
        </div>

        <div className="space-y-2">
          {sortedGroups.length === 0 ? (
            <div className="rounded-md border border-dashed border-zinc-300 px-3 py-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
              No groups yet
            </div>
          ) : (
            sortedGroups.map((group, index) => (
              <StackListItem
                key={group.id}
                group={group}
                selected={group.id === selectedGroupId}
                canMoveUp={index > 0}
                canMoveDown={index < sortedGroups.length - 1}
                onSelect={() => {
                  setSelectedGroupId(group.id);
                  setSelectedItemId('');
                }}
                onMove={(direction) => void handleGroupMove(group.id, direction)}
              />
            ))
          )}
        </div>
      </aside>

      <div className="space-y-5 min-w-0">
        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-4">
            <h2 className="text-sm font-semibold">Add Group</h2>
          </div>
          <StackGroupForm />
        </section>

        <section className="space-y-5 min-w-0">
          {selectedGroup ? (
            <>
              <StackGroupForm key={selectedGroup.id} group={selectedGroup} />

              <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold">Items</h2>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{sortedItems.length} items</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <StackItemForm group={selectedGroup} />

                  {sortedItems.length === 0 ? (
                    <div className="rounded-md border border-dashed border-zinc-300 px-3 py-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                      No items in this group yet
                    </div>
                  ) : (
                    sortedItems.map((item, index) => (
                      <div
                        key={item.id}
                        className={`flex w-full items-center justify-between rounded-md border px-3 py-3 text-left transition ${
                          item.id === selectedItemId
                            ? 'border-zinc-950 bg-zinc-950 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-950'
                            : 'border-zinc-200 bg-white text-zinc-800 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-600'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedItemId(item.id)}
                          className="min-w-0 flex-1 text-left"
                        >
                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium">{item.name || 'Untitled Item'}</div>
                          </div>
                        </button>

                        <div className="ml-3 flex shrink-0 gap-1">
                          <button
                            type="button"
                            onClick={() => void handleItemMove(item.id, 'up')}
                            disabled={index === 0}
                            className="inline-flex rounded border border-current/20 p-1 disabled:cursor-not-allowed disabled:opacity-30"
                            aria-label="Move item up"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleItemMove(item.id, 'down')}
                            disabled={index === sortedItems.length - 1}
                            className="inline-flex rounded border border-current/20 p-1 disabled:cursor-not-allowed disabled:opacity-30"
                            aria-label="Move item down"
                          >
                            <ArrowDown size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {selectedItem ? <StackItemForm key={selectedItem.id} group={selectedGroup} item={selectedItem} /> : null}
            </>
          ) : (
            <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
              Select a group from the left to edit it.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
