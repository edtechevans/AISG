import { submitAnswer } from '@/lib/server-data';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json() as { questionId?: string; selected?: string[] };
    if (!body.questionId || !Array.isArray(body.selected) || body.selected.length === 0) {
      return Response.json({ error: 'Choose an answer before submitting.' }, { status: 400 });
    }
    return Response.json(await submitAnswer(body.questionId, body.selected));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to save answer';
    return Response.json({ error: message }, { status: 400 });
  }
}
