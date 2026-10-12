import { NextResponse, type NextRequest } from 'next/server';
import { isAuthorised } from '@/lib/dataroom-auth';
import { entryByFile, readDataroomFile } from '@/lib/dataroom';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  if (!(await isAuthorised())) {
    const next = encodeURIComponent(`/dataroom/files/${name}`);
    return NextResponse.redirect(
      new URL(`/dataroom?next=${next}`, request.url),
      303,
    );
  }
  const entry = entryByFile(name);
  const file = entry ? await readDataroomFile(entry) : null;
  if (!entry || !file) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }
  const disposition = file.inline ? 'inline' : 'attachment';
  return new NextResponse(file.body, {
    headers: {
      'content-type': file.contentType,
      'content-disposition': `${disposition}; filename="${entry.file}"`,
      'cache-control': 'private, no-store',
      'x-robots-tag': 'noindex, nofollow',
    },
  });
}
