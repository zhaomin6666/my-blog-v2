import Link from 'next/link';
import { Contact, Database, FileCog, FileText, Layers3, LayoutDashboard, LogOut, PanelsTopLeft, UserRound } from 'lucide-react';
import { logoutAction } from './actions';

interface AdminShellProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function AdminShell({ children, title, description, action }: AdminShellProps) {
  return (
    <div className="h-screen overflow-y-auto bg-zinc-100 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 px-5 py-3 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/admin" className="flex items-center gap-2 text-sm font-semibold">
            <Database size={16} />
            Personal Dev OS Admin
          </Link>
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
            >
              <LayoutDashboard size={14} />
              Dashboard
            </Link>
            <Link
              href="/admin/blog"
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
            >
              <FileText size={14} />
              Blog
            </Link>
            <Link
              href="/admin/projects"
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
            >
              <PanelsTopLeft size={14} />
              Projects
            </Link>
            <Link
              href="/admin/pages"
              className="hidden items-center gap-1.5 rounded-md px-2.5 py-1.5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white md:flex"
            >
              <FileCog size={14} />
              Pages
            </Link>
            <Link
              href="/admin/hero"
              className="hidden items-center gap-1.5 rounded-md px-2.5 py-1.5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white md:flex"
            >
              <LayoutDashboard size={14} />
              Hero
            </Link>
            <Link
              href="/admin/profile"
              className="hidden items-center gap-1.5 rounded-md px-2.5 py-1.5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white md:flex"
            >
              <UserRound size={14} />
              Profile
            </Link>
            <Link
              href="/admin/contact"
              className="hidden items-center gap-1.5 rounded-md px-2.5 py-1.5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white lg:flex"
            >
              <Contact size={14} />
              Contact
            </Link>
            <Link
              href="/admin/stack"
              className="hidden items-center gap-1.5 rounded-md px-2.5 py-1.5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white lg:flex"
            >
              <Layers3 size={14} />
              Stack
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
              >
                <LogOut size={14} />
                Logout
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
              Database content source
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {description ? (
              <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {description}
              </p>
            ) : null}
          </div>
          {action}
        </div>

        {children}
      </main>
    </div>
  );
}
