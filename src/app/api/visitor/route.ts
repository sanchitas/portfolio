import { put, list } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export type VisitorData = {
  city: string | null;
  region: string | null;
  country: string | null;
  timestamp: string;
};

const BLOB_PATH = 'last-visitor.json';

export async function POST(req: NextRequest) {
  const rawCity = req.headers.get('x-vercel-ip-city');
  const region = req.headers.get('x-vercel-ip-country-region');
  const country = req.headers.get('x-vercel-ip-country');
  const city = rawCity ? decodeURIComponent(rawCity) : null;

  // Read previous visitor
  let previous: VisitorData | null = null;
  try {
    const { blobs } = await list({ prefix: BLOB_PATH });
    if (blobs.length > 0) {
      const res = await fetch(blobs[0].url, { cache: 'no-store' });
      if (res.ok) previous = await res.json();
    }
  } catch {
    // blob store not yet configured or unavailable — degrade silently
  }

  // Store current visitor only when Vercel geo headers are present (not localhost)
  if (city || country) {
    const timestamp = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
    try {
      await put(BLOB_PATH, JSON.stringify({ city, region, country, timestamp } satisfies VisitorData), {
        access: 'public',
        addRandomSuffix: false,
        contentType: 'application/json',
      });
    } catch {
      // ignore write failures
    }
  }

  return NextResponse.json({ previous });
}
