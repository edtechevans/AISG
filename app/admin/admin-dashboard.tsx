'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpenCheck, CheckCircle2, Clock3, Download, RotateCcw, Search, ShieldCheck, UserRoundX, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Learner = { id: string; name: string; email: string; userType: string; division: string; progress: number; score: number | null; attempts: number; status: string; started: number | null; latestActivity: number | null; completed: number | null };
type AdminData = { actor: { name: string }; passThreshold: number; learners: Learner[]; metrics: { total: number; notStarted: number; inProgress: number; completed: number; passed: number; needsRetake: number; completionPercentage: number } };

const statusLabels: Record<string,string> = { NOT_STARTED: 'Not started', IN_PROGRESS: 'In progress', PASSED: 'Passed', NEEDS_ANOTHER_ATTEMPT: 'Another attempt' };
const date = (value: number | null) => value ? new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

export default function AdminDashboard({ data }: { data: AdminData }) {
  const [query, setQuery] = useState(''); const [status, setStatus] = useState('ALL'); const [division, setDivision] = useState('ALL');
  const [passThreshold, setPassThreshold] = useState(data.passThreshold);
  const divisions = [...new Set(data.learners.map((l) => l.division))];
  const filtered = useMemo(() => data.learners.filter((learner) => {
    const haystack = `${learner.name} ${learner.email} ${learner.userType} ${learner.division}`.toLowerCase();
    return haystack.includes(query.toLowerCase()) && (status === 'ALL' || learner.status === status) && (division === 'ALL' || learner.division === division);
  }), [data.learners, query, status, division]);
  function exportCsv() {
    const header = ['Name','Email','Role','Division/Department','Status','Progress','Score','Attempts','Started','Last Activity','Completed'];
    const rows = filtered.map((l) => [l.name,l.email,l.userType,l.division,statusLabels[l.status] ?? l.status,`${l.progress}%`,l.score == null ? '' : `${l.score}%`,l.attempts,date(l.started),date(l.latestActivity),date(l.completed)]);
    const csv = [header, ...rows].map((row) => row.map((value) => `"${String(value).replaceAll('"','""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); const link = document.createElement('a'); link.href = url; link.download = 'aisg-safeguarding-completion-sy2026-27.csv'; link.click(); URL.revokeObjectURL(url);
  }
  const cards = [
    ['Assigned', data.metrics.total, Users], ['Not started', data.metrics.notStarted, UserRoundX], ['In progress', data.metrics.inProgress, Clock3], ['Passed', data.metrics.passed, CheckCircle2], ['Another attempt', data.metrics.needsRetake, RotateCcw],
  ] as const;
  async function changeThreshold(value: number) { setPassThreshold(value); await fetch('/api/admin/settings', { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ passThreshold: value }) }); }
  return <main className="admin-shell"><header className="admin-header"><div><Link href="/" className="back-link"><ArrowLeft /> Learner experience</Link><p className="tiny-eyebrow mt-6">Administrator workspace</p><h1>Training overview</h1><p>SY2026–27 • Safeguarding training records only</p></div><div className="admin-actions"><div className="threshold-control"><span>Pass threshold</span><NativeSelect aria-label="Pass threshold" value={passThreshold} onChange={(e) => changeThreshold(Number(e.target.value))}>{[70,75,80,85,90,95,100].map((value) => <NativeSelectOption key={value} value={value}>{value}%</NativeSelectOption>)}</NativeSelect></div><Link href="/admin/questions"><Button variant="outline" size="lg"><BookOpenCheck /> Review question bank</Button></Link><Button onClick={exportCsv} className="primary-pill" size="lg"><Download /> Export CSV</Button></div></header>
    <section className="metric-strip"><div className="completion-metric"><div><span>Organisation completion</span><strong>{data.metrics.completionPercentage}%</strong></div><Progress value={data.metrics.completionPercentage} className="[&_[data-slot=progress-track]]:h-2 [&_[data-slot=progress-indicator]]:bg-red" /></div>{cards.map(([label,value,Icon]) => <div className="metric-tile" key={label}><Icon /><span>{label}</span><strong>{value}</strong></div>)}</section>
    <section className="admin-table-card"><div className="table-toolbar"><div><h2>Learners</h2><p>{filtered.length} of {data.learners.length} people shown</p></div><div className="filters"><div className="search-box"><Search /><Input aria-label="Search learners" placeholder="Search name, email or role" value={query} onChange={(e) => setQuery(e.target.value)} /></div><NativeSelect aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)}><NativeSelectOption value="ALL">All statuses</NativeSelectOption>{Object.entries(statusLabels).map(([value,label]) => <NativeSelectOption value={value} key={value}>{label}</NativeSelectOption>)}</NativeSelect><NativeSelect aria-label="Filter by division" value={division} onChange={(e) => setDivision(e.target.value)}><NativeSelectOption value="ALL">All divisions</NativeSelectOption>{divisions.map((item) => <NativeSelectOption value={item} key={item}>{item}</NativeSelectOption>)}</NativeSelect></div></div>
      <Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Role / division</TableHead><TableHead>Status</TableHead><TableHead>Progress</TableHead><TableHead>Score</TableHead><TableHead>Attempts</TableHead><TableHead>Last activity</TableHead></TableRow></TableHeader><TableBody>{filtered.map((learner) => <TableRow key={learner.id}><TableCell><Link href={`/admin/learners/${learner.id}`} className="learner-name">{learner.name}</Link><span className="cell-sub">{learner.email}</span></TableCell><TableCell>{learner.userType}<span className="cell-sub">{learner.division}</span></TableCell><TableCell><span className={`table-status table-${learner.status.toLowerCase()}`}>{statusLabels[learner.status] ?? learner.status}</span></TableCell><TableCell><div className="table-progress"><Progress value={learner.progress} className="[&_[data-slot=progress-indicator]]:bg-red" /><span>{learner.progress}%</span></div></TableCell><TableCell>{learner.score == null ? '—' : `${learner.score}%`}</TableCell><TableCell>{learner.attempts || '—'}</TableCell><TableCell>{date(learner.latestActivity)}</TableCell></TableRow>)}</TableBody></Table>
      {filtered.length === 0 && <div className="empty-table"><Search /><strong>No learners match these filters</strong><p>Adjust the search or choose a different status.</p></div>}
    </section><p className="admin-footnote"><ShieldCheck /> This system tracks training only. It does not store safeguarding reports or student safeguarding information.</p></main>;
}
