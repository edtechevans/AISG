'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, CircleDashed, PencilLine, Plus, RefreshCcw } from 'lucide-react';
import CourseMark from '@/app/course-mark';
import { Button } from '@/components/ui/button';
import { COURSE_BY_ID, COURSE_CATALOG, isCourseId, type CourseId } from '@/lib/course-catalog';

const PRACTICE_STORAGE_KEY = 'my-courses-practice-v1';

type PracticeStatus = 'to-try' | 'tried' | 'adapted' | 'not-yet' | 'not-for-now';

type PracticeEntry = {
  id: string;
  course?: CourseId;
  source: 'course' | 'manual';
  focus: string;
  practice?: string;
  status: PracticeStatus;
  observation?: string;
  nextMove?: string;
  createdAt: number;
  updatedAt: number;
};

const STATUS_LABELS: Record<PracticeStatus, string> = {
  'to-try': 'To try',
  tried: 'Tried it',
  adapted: 'Adapted it',
  'not-yet': 'Not yet',
  'not-for-now': 'Not for now',
};

function readStoredPractice(): PracticeEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(PRACTICE_STORAGE_KEY) || '[]') as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry): entry is PracticeEntry => Boolean(entry && typeof entry === 'object' && 'id' in entry && 'focus' in entry));
  } catch {
    return [];
  }
}

function writeStoredPractice(entries: PracticeEntry[]) {
  try {
    localStorage.setItem(PRACTICE_STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Keep the current-session workspace usable if persistent browser storage is unavailable.
  }
}

function importedCommitments() {
  if (typeof window === 'undefined') return [] as PracticeEntry[];
  const now = Date.now();
  return COURSE_CATALOG.flatMap((course) => {
    if (!course.storageKey) return [];
    try {
      const progress = JSON.parse(localStorage.getItem(course.storageKey) || 'null') as { practice?: unknown; commitment?: unknown; completedAt?: unknown; updatedAt?: unknown } | null;
      if (!progress) return [];
      const practice = typeof progress.practice === 'string' ? progress.practice.trim() : '';
      const commitment = typeof progress.commitment === 'string' ? progress.commitment.trim() : '';
      const focus = commitment || practice;
      if (!focus) return [];
      const timestamp = typeof progress.completedAt === 'number' ? progress.completedAt : typeof progress.updatedAt === 'number' ? progress.updatedAt : now;
      return [{
        id: `course:${course.id}`,
        course: course.id,
        source: 'course' as const,
        focus,
        practice: practice || undefined,
        status: 'to-try' as const,
        createdAt: timestamp,
        updatedAt: timestamp,
      }];
    } catch {
      return [];
    }
  });
}

function mergeImported(current: PracticeEntry[]) {
  const byId = new Map(current.map((entry) => [entry.id, entry]));
  for (const imported of importedCommitments()) {
    const existing = byId.get(imported.id);
    if (!existing) {
      byId.set(imported.id, imported);
    } else if (existing.source === 'course' && existing.status === 'to-try' && !existing.observation && existing.focus !== imported.focus) {
      byId.set(imported.id, { ...existing, focus: imported.focus, practice: imported.practice, updatedAt: Date.now() });
    }
  }
  return [...byId.values()].sort((a, b) => b.updatedAt - a.updatedAt);
}

export default function MyPractice({ onOpenCourse }: { onOpenCourse: (course: CourseId) => void }) {
  const [entries, setEntries] = useState<PracticeEntry[]>([]);
  const [adding, setAdding] = useState(false);
  const [newFocus, setNewFocus] = useState('');
  const [newCourse, setNewCourse] = useState('');

  useEffect(() => {
    const merged = mergeImported(readStoredPractice());
    setEntries(merged);
    writeStoredPractice(merged);
  }, []);

  const activeEntries = useMemo(() => entries.filter((entry) => entry.status !== 'not-for-now'), [entries]);
  const triedCount = entries.filter((entry) => entry.status === 'tried' || entry.status === 'adapted').length;

  function updateEntry(id: string, patch: Partial<PracticeEntry>) {
    setEntries((current) => {
      const next = current.map((entry) => entry.id === id ? { ...entry, ...patch, updatedAt: Date.now() } : entry);
      writeStoredPractice(next);
      return next;
    });
  }

  function addEntry() {
    const focus = newFocus.trim();
    if (!focus) return;
    const course = isCourseId(newCourse) ? newCourse : undefined;
    const now = Date.now();
    const entry: PracticeEntry = {
      id: `manual:${now}`,
      course,
      source: 'manual',
      focus,
      status: 'to-try',
      createdAt: now,
      updatedAt: now,
    };
    setEntries((current) => {
      const next = [entry, ...current];
      writeStoredPractice(next);
      return next;
    });
    setNewFocus('');
    setNewCourse('');
    setAdding(false);
  }

  return <section id="practice" className="learning-system-section practice-section" aria-labelledby="practice-title">
    <div className="learning-system-heading">
      <div><p className="tiny-eyebrow">My practice</p><h2 id="practice-title">Carry learning into practice</h2><p>Your Take it into Practice commitments collect here as a private workspace. Mark what you tried, capture what you noticed and decide what is worth adapting next.</p></div>
      <div className="practice-summary"><strong>{triedCount}</strong><span>tried or adapted</span></div>
    </div>

    <div className="practice-toolbar"><span>{activeEntries.length} active {activeEntries.length === 1 ? 'focus' : 'focuses'} · Private to this browser in the public demo</span><Button variant="outline" onClick={() => setAdding((value) => !value)}><Plus aria-hidden="true" /> Add practice note</Button></div>

    {adding && <div className="practice-add-card">
      <label><span>What do you want to try, notice or strengthen?</span><textarea value={newFocus} onChange={(event) => setNewFocus(event.target.value)} rows={3} placeholder="A small professional move or question…" /></label>
      <label><span>Connect to a course (optional)</span><select value={newCourse} onChange={(event) => setNewCourse(event.target.value)}><option value="">General professional practice</option>{COURSE_CATALOG.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}</select></label>
      <div><Button variant="ghost" onClick={() => setAdding(false)}>Cancel</Button><Button className="primary-pill" disabled={!newFocus.trim()} onClick={addEntry}>Save to My Practice <ArrowRight aria-hidden="true" /></Button></div>
    </div>}

    {entries.length === 0 ? <div className="practice-empty"><CircleDashed aria-hidden="true" /><div><strong>Your practice workspace will grow from your learning.</strong><p>Complete a course and choose a Take it into Practice focus, or add a small professional question of your own.</p></div></div> : <div className="practice-grid">
      {entries.map((entry) => {
        const course = entry.course ? COURSE_BY_ID[entry.course] : null;
        const reflective = entry.status === 'tried' || entry.status === 'adapted';
        return <article key={entry.id} className={`practice-card practice-${entry.status}`}>
          <div className="practice-card-heading">
            <div className="practice-source">{entry.course ? <CourseMark course={entry.course} size="record" /> : <PencilLine aria-hidden="true" />}<div><p>{course ? course.category : 'Personal practice'}</p><strong>{course ? course.title : 'My own professional question'}</strong></div></div>
            <span>{STATUS_LABELS[entry.status]}</span>
          </div>
          <p className="practice-focus">{entry.focus}</p>
          {entry.practice && entry.practice !== entry.focus && <p className="practice-origin"><strong>Course focus:</strong> {entry.practice}</p>}
          <div className="practice-status-actions" aria-label="Update practice status">
            <button type="button" className={entry.status === 'tried' ? 'is-active' : ''} onClick={() => updateEntry(entry.id, { status: 'tried' })}><CheckCircle2 aria-hidden="true" /> Tried it</button>
            <button type="button" className={entry.status === 'adapted' ? 'is-active' : ''} onClick={() => updateEntry(entry.id, { status: 'adapted' })}><RefreshCcw aria-hidden="true" /> Adapted</button>
            <button type="button" className={entry.status === 'not-yet' ? 'is-active' : ''} onClick={() => updateEntry(entry.id, { status: 'not-yet' })}>Not yet</button>
            <button type="button" className={entry.status === 'not-for-now' ? 'is-active' : ''} onClick={() => updateEntry(entry.id, { status: 'not-for-now' })}>Not for now</button>
          </div>
          {reflective && <div className="practice-reflection">
            <label><span>What did you notice about learners?</span><textarea value={entry.observation || ''} onChange={(event) => updateEntry(entry.id, { observation: event.target.value })} rows={2} placeholder="Evidence, surprises, learner response…" /></label>
            <label><span>What would you keep, change or try next?</span><textarea value={entry.nextMove || ''} onChange={(event) => updateEntry(entry.id, { nextMove: event.target.value })} rows={2} placeholder="A small next move…" /></label>
          </div>}
          {entry.course && <Button variant="ghost" className="practice-course-link" onClick={() => onOpenCourse(entry.course!)}>Return to course <ArrowRight aria-hidden="true" /></Button>}
        </article>;
      })}
    </div>}
  </section>;
}
