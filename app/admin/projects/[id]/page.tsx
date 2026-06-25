import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { requireAdminSession } from '@/lib/admin/admin-auth';
import { projectAdminService } from '@/lib/admin/project-admin-service';
import { AdminShell } from '../../AdminShell';
import { ProjectForm } from '../ProjectForm';
import { publishProjectAction, unpublishProjectAction } from '../actions';

interface EditAdminProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditAdminProjectPage({ params }: EditAdminProjectPageProps) {
  await requireAdminSession();
  const { id } = await params;
  const project = await projectAdminService.getAdminProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <AdminShell
      title="Edit Project"
      description={`Editing database project ${project.slug}. Unpublished projects are excluded from public database-mode pages and sitemap.`}
      action={
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/projects"
            className="flex items-center gap-2 rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            <ArrowLeft size={15} />
            Back
          </Link>
          {project.published ? (
            <form action={unpublishProjectAction}>
              <input type="hidden" name="id" value={project.id} />
              <button
                type="submit"
                className="flex items-center gap-2 rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                <EyeOff size={15} />
                Unpublish
              </button>
            </form>
          ) : (
            <form action={publishProjectAction}>
              <input type="hidden" name="id" value={project.id} />
              <button
                type="submit"
                className="flex items-center gap-2 rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                <Eye size={15} />
                Publish
              </button>
            </form>
          )}
        </div>
      }
    >
      <ProjectForm project={project} />
    </AdminShell>
  );
}
