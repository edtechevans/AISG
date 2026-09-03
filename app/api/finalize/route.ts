import { finalizeAttempt } from '@/lib/server-data';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    return Response.json(await finalizeAttempt());
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to complete attempt';
    return Response.json({ error: message }, { status: 400 });
  }
}
