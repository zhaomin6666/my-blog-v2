import { requireAdminSession } from '@/lib/admin/admin-auth';
import { contentTransferService, zipDownloadFilename, type ExportScope } from '@/lib/admin/content-transfer';

function readScope(url: string): ExportScope {
  const scope = new URL(url).searchParams.get('scope');
  if (scope === 'published' || scope === 'draft') return scope;
  return 'all';
}

export async function GET(request: Request): Promise<Response> {
  await requireAdminSession();

  const { buffer } = await contentTransferService.exportMarkdownZip(
    'projects',
    readScope(request.url),
  );

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${zipDownloadFilename('projects')}"`,
    },
  });
}
