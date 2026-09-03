import { updateAdminQuestion } from '@/lib/server-data';
import type { Question } from '@/lib/course';

export const dynamic = 'force-dynamic';

export async function PATCH(request: Request) {
  try {
    const body = await request.json() as Question;
    return Response.json(await updateAdminQuestion(body));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to update question';
    return Response.json({ error: message }, { status: message === 'ADMIN_REQUIRED' ? 403 : 400 });
  }
}
