import { startRetake } from '@/lib/server-data';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    return Response.json(await startRetake());
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to start a new attempt';
    return Response.json({ error: message }, { status: 400 });
  }
}
