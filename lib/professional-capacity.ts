import type { CourseId } from '@/lib/course-catalog';

export type CapacityDomainId = 'design' | 'inclusive' | 'transformative' | 'evidence' | 'professional';

export type CapacityDomain = {
  id: CapacityDomainId;
  title: string;
  description: string;
  courseIds: readonly CourseId[];
};

export const CAPACITY_DOMAINS: readonly CapacityDomain[] = [
  {
    id: 'design',
    title: 'Learning Design & Assessment',
    description: 'Clarify worthwhile learning, anticipate barriers, gather valid evidence and design responsive next moves.',
    courseIds: ['engagement', 'udl', 'assessment', 'growth-domain1', 'elementary', 'secondary', 'technology'],
  },
  {
    id: 'inclusive',
    title: 'Inclusive & Responsive Practice',
    description: 'Strengthen access, belonging, multilingual participation, learner autonomy and coherent support without lowering meaningful challenge.',
    courseIds: ['multilingual', 'udl', 'mtss', 'growth-domain1', 'growth-domain2', 'elementary', 'secondary'],
  },
  {
    id: 'transformative',
    title: 'Transformative Learning',
    description: 'Deepen Agency, Authenticity, Creativity, Collaboration, cognitive demand and meaningful action through learner evidence rather than activity labels.',
    courseIds: ['engagement', 'growth-domain2', 'growth-domain3', 'technology', 'ai'],
  },
  {
    id: 'evidence',
    title: 'Evidence, Reflection & Collective Improvement',
    description: 'Use assessment, data, feedback and collaboration to notice impact, adjust practice and build stronger shared decisions over time.',
    courseIds: ['assessment', 'data', 'mtss', 'growth-domain4', 'teams'],
  },
  {
    id: 'professional',
    title: 'Professional Responsibility & Judgement',
    description: 'Apply policy, confidentiality, safeguarding, digital responsibility and professional communication with disciplined human judgement.',
    courseIds: ['safeguarding', 'teams', 'ai', 'elementary', 'secondary', 'growth-domain4'],
  },
];

export function capacityDomainsForCourse(course: CourseId) {
  return CAPACITY_DOMAINS.filter((domain) => domain.courseIds.includes(course));
}
