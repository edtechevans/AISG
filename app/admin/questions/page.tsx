import QuestionBankReview from '@/app/admin/questions/question-bank-review';
import { getAdminQuestions } from '@/lib/server-data';

export const dynamic = 'force-dynamic';

export default async function QuestionsPage() {
  const questions = await getAdminQuestions();
  return <QuestionBankReview initialQuestions={questions} />;
}
