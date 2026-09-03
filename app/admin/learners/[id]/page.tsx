import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Clock3, RotateCcw, User } from 'lucide-react';
import { getLearnerDetail } from '@/lib/server-data';
import { Progress } from '@/components/ui/progress';

export const dynamic = 'force-dynamic';

export default async function LearnerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let data;
  try { data = await getLearnerDetail(id); } catch { data = null; }
  if (!data) return <main className="loading-screen"><h1 className="text-2xl font-semibold text-navy">Learner record unavailable</h1><Link href="/admin" className="admin-link">Return to training overview</Link></main>;
  const p = data.progress;
  const progress = p?.percentageProgress ?? 0;
  const date = (value: unknown) => value ? new Date(Number(value)).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : '—';
  return <main className="detail-shell"><Link href="/admin" className="back-link"><ArrowLeft /> Training overview</Link><section className="detail-hero"><div className="detail-avatar"><User /></div><div><p className="tiny-eyebrow">Learner record</p><h1>{data.learner.name}</h1><p>{data.learner.email} • {data.learner.userType} • {data.learner.division ?? 'Division not assigned'}</p></div></section>
    <section className="detail-progress"><div className="flex justify-between"><strong>Course progress</strong><span>{progress}%</span></div><Progress value={progress} className="mt-3 [&_[data-slot=progress-track]]:h-2 [&_[data-slot=progress-indicator]]:bg-red" /><div className="detail-facts"><span><b>{p?.questionsCompleted ?? 0}</b>Questions completed</span><span><b>{p?.currentModule ?? 1} of 6</b>Current module</span><span><b>{date(p?.latestActivity)}</b>Latest activity</span></div></section>
    <section className="attempt-history"><h2>Attempt history</h2>{data.attempts.length ? <div className="space-y-3">{data.attempts.map((attempt) => <article key={attempt.id}><div className={`attempt-icon ${attempt.status === 'PASSED' ? 'attempt-pass' : attempt.status === 'IN_PROGRESS' ? 'attempt-progress' : 'attempt-retake'}`}>{attempt.status === 'PASSED' ? <CheckCircle2 /> : attempt.status === 'IN_PROGRESS' ? <Clock3 /> : <RotateCcw />}</div><div><strong>Attempt {attempt.attemptNumber}</strong><p>Started {date(attempt.startedAt)}{attempt.completedAt ? ` • Completed ${date(attempt.completedAt)}` : ''}</p></div><div className="attempt-score"><span>{attempt.status.replaceAll('_',' ')}</span><strong>{attempt.percentage == null ? '—' : `${attempt.percentage}%`}</strong></div></article>)}</div> : <p className="empty-table">No attempts yet.</p>}</section><p className="admin-footnote">This record contains training activity only and no student safeguarding information.</p></main>;
}
