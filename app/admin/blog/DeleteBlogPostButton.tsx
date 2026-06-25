'use client';

import { Trash2 } from 'lucide-react';
import { softDeleteBlogPostAction } from './actions';

interface DeleteBlogPostButtonProps {
  postId: string;
}

const DELETE_CONFIRM_MESSAGE =
  '确定要删除这篇文章吗？该操作会将文章从后台列表和公开页面中隐藏，但不会物理删除数据库记录。';

export function DeleteBlogPostButton({ postId }: DeleteBlogPostButtonProps) {
  return (
    <form
      action={softDeleteBlogPostAction}
      onSubmit={(event) => {
        if (!window.confirm(DELETE_CONFIRM_MESSAGE)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={postId} />
      <button
        type="submit"
        className="inline-flex items-center gap-1.5 rounded-md border border-red-300 px-2.5 py-1.5 text-xs font-medium text-red-700 transition hover:border-red-400 hover:bg-red-50 dark:border-red-900/70 dark:text-red-300 dark:hover:border-red-800 dark:hover:bg-red-950/40"
      >
        <Trash2 size={13} />
        Delete
      </button>
    </form>
  );
}
