import { put, list } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

const BLOB_PATH = 'resume.pdf';

export async function GET() {
  try {
    const { blobs } = await list({ prefix: BLOB_PATH });
    if (blobs.length === 0) {
      return NextResponse.json({ error: 'No resume uploaded yet' }, { status: 404 });
    }
    return NextResponse.redirect(blobs[0].url);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch resume' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file || file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'PDF file required' }, { status: 400 });
    }
    const blob = await put(BLOB_PATH, file, {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/pdf',
    });
    return NextResponse.json({ url: blob.url });
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
