import { updatePassThreshold } from '@/lib/server-data';

export const dynamic = 'force-dynamic';

export async function PATCH(request: Request) {
  try {
    const body = await request.json() as { passThreshold?: number };
    return Response.json(await updatePassThreshold(Number(body.passThreshold)));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to update settings';
    return Response.json({ error: message }, { status: message === 'ADMIN_REQUIRED' ? 403 : 400 });
  }
}
