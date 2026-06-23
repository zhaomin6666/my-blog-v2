import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { hasAdminSession } from '@/lib/admin/admin-auth';
import { loginAction } from '../actions';

export const metadata: Metadata = {
  title: 'Admin Login',
  robots: {
    index: false,
    follow: false,
  },
};

interface AdminLoginPageProps {
  searchParams: Promise<{
    error?: string;
    retryAfter?: string;
    next?: string;
  }>;
}

function getErrorMessage(error?: string, retryAfter?: string): string {
  if (error === 'not-configured') {
    return 'Admin credentials are not configured. Set ADMIN_USERNAME, ADMIN_PASSWORD_HASH, and ADMIN_SESSION_SECRET.';
  }

  if (error === 'rate-limited') {
    return `Too many login attempts. Try again in ${retryAfter || '60'} seconds.`;
  }

  if (error === 'invalid') {
    return 'Invalid username or password.';
  }

  return '';
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  if (await hasAdminSession()) {
    redirect('/admin');
  }

  const params = await searchParams;
  const errorMessage = getErrorMessage(params.error, params.retryAfter);

  return (
    <div className="flex h-screen items-center justify-center overflow-y-auto bg-zinc-100 px-4 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <main className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
          Personal Dev OS
        </p>
        <h1 className="text-xl font-semibold">Admin Login</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          Author-only access for the database-backed CMS.
        </p>

        {errorMessage ? (
          <div className="mt-5 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-200">
            {errorMessage}
          </div>
        ) : null}

        <form action={loginAction} className="mt-6 space-y-4">
          <input type="hidden" name="next" value={params.next || '/admin'} />
          <label className="block text-sm font-medium">
            Username
            <input
              name="username"
              type="text"
              autoComplete="username"
              required
              className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
            />
          </label>
          <label className="block text-sm font-medium">
            Password
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-md bg-zinc-950 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            Sign in
          </button>
        </form>
      </main>
    </div>
  );
}
