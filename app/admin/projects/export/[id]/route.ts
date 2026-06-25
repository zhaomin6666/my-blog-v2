import { requireAdminSession } from '@/lib/admin/admin-auth';
import { contentTransferService } from '@/lib/admin/content-transfer';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  await requireAdminSession();

  const { id } = await params;
  const file = await contentTransferService.exportSingleMarkdown('projects', id);

  if (!file) {
    return new Response('Not found', { status: 404 });
  }

  return new Response(file.content, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': `attachment; filename="${file.filename}"`,
    },
  });
}
