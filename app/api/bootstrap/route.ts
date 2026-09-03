import { getLearnerBootstrap } from '@/lib/server-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return Response.json(await getLearnerBootstrap());
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load training';
    return Response.json({ error: message }, { status: message === 'AUTH_REQUIRED' ? 401 : 500 });
  }
}
