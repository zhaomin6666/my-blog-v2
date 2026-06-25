import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { requireAdminSession } from '@/lib/admin/admin-auth';
import { AdminShell } from '../../AdminShell';
import { ProjectForm } from '../ProjectForm';

export default async function NewAdminProjectPage() {
  await requireAdminSession();

  return (
    <AdminShell
      title="New Project"
      description="Create a database-backed project. New projects default to unpublished unless Published is checked."
      action={
        <Link
          href="/admin/projects"
          className="flex items-center gap-2 rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          <ArrowLeft size={15} />
          Back
        </Link>
      }
    >
      <ProjectForm />
    </AdminShell>
  );
}
