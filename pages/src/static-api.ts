import questionSource from '../../content/questions.json';
import {
  courseModules,
  COURSE_VERSION_ID,
  DEFAULT_PASS_THRESHOLD,
  type Question,
} from '../../lib/course';

type StoredResponse = {
  questionId: string;
  answer: string[];
  isCorrect: boolean;
};

type StoredState = {
  attemptNumber: number;
  status: 'IN_PROGRESS' | 'PASSED' | 'NEEDS_ANOTHER_ATTEMPT';
  score: number | null;
  percentage: number | null;
  completedAt: number | null;
  currentQuestion: number;
  responses: StoredResponse[];
};

const STORAGE_KEY = 'aisg-safeguarding-pages-test-v1';
const INSTALL_MARKER = '__aisgBrowserLearningApiInstalled';
const QUESTIONS = [...(questionSource as Question[])].sort((a, b) => a.questionNumber - b.questionNumber);
const LEARNER_QUESTIONS = QUESTIONS.map((question) => {
  const {
    correctAnswer: _correctAnswer,
    correctFeedback: _correctFeedback,
    incorrectFeedback: _incorrectFeedback,
    ...learnerQuestion
  } = question;
  return learnerQuestion;
});

const freshState = (attemptNumber = 1): StoredState => ({
  attemptNumber,
  status: 'IN_PROGRESS',
  score: null,
  percentage: null,
  completedAt: null,
  currentQuestion: 1,
  responses: [],
});

function learningStorageKey(attemptNumber: number) {
  return `${COURSE_VERSION_ID}-learning-${attemptNumber}`;
}

function learningStagesStorageKey(attemptNumber: number) {
  return `${COURSE_VERSION_ID}-learning-stages-${attemptNumber}`;
}

function readLearningProgress(attemptNumber: number) {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(learningStorageKey(attemptNumber)) || '[]');
    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === 'string')
      : [];
  } catch {
    return [];
  }
}

function readLearningStages(attemptNumber: number) {
  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(learningStagesStorageKey(attemptNumber)) || '{}',
    ) as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(parsed).filter(
        (entry): entry is [string, number] =>
          typeof entry[1] === 'number' && Number.isInteger(entry[1]) && entry[1] >= 0,
      ),
    );
  } catch {
    return {};
  }
}

function browserLearningProgress(state: StoredState) {
  const completedSections = readLearningProgress(state.attemptNumber);
  const learningStages = readLearningStages(state.attemptNumber);
  const partialLearningUnits = courseModules.reduce(
    (total, module) =>
      completedSections.includes(module.id)
        ? total
        : total + Math.min(0.99, (learningStages[module.id] ?? 0) / (module.learningSteps.length + 1)),
    0,
  );
  const completedChecks = state.responses.length;
  const percentage = Math.min(
    100,
    Math.round(
      ((completedChecks + completedSections.length + partialLearningUnits) /
        (QUESTIONS.length + courseModules.length)) *
        100,
    ),
  );
  const hasLearningActivity =
    completedSections.length > 0 || Object.values(learningStages).some((stage) => stage > 0);

  return { completedSections, hasLearningActivity, percentage };
}

function readState(): StoredState {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return freshState();
    const parsed = JSON.parse(stored) as StoredState;
    if (!Array.isArray(parsed.responses)) return freshState();
    return parsed;
  } catch {
    return freshState();
  }
}

function writeState(state: StoredState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

function bootstrap(state: StoredState) {
  const completed = state.responses.length;
  const learning = browserLearningProgress(state);
  return {
    user: {
      id: 'github-pages-demo-learner',
      name: 'Demo Learner',
      email: 'demo@example.invalid',
      role: 'LEARNER' as const,
    },
    questions: LEARNER_QUESTIONS,
    modules: courseModules,
    passThreshold: DEFAULT_PASS_THRESHOLD,
    attempt: {
      attemptNumber: state.attemptNumber,
      status: state.status,
      score: state.score,
      percentage: state.percentage,
      completedAt: state.completedAt,
    },
    responses: state.responses,
    completedSections: learning.completedSections,
    learningStage: learning.hasLearningActivity ? ('learn' as const) : undefined,
    progress: {
      currentModule: Math.min(6, Math.ceil(state.currentQuestion / 5)),
      currentQuestion: state.currentQuestion,
      completed,
      percentage: learning.percentage,
      latestActivity: Date.now(),
    },
  };
}

function sameAnswer(question: Question, selected: string[]) {
  const expected = question.correctAnswer || [];
  const normalise = (values: string[]) =>
    question.questionType === 'sequence' ? values : [...values].sort();
  return JSON.stringify(normalise(selected)) === JSON.stringify(normalise(expected));
}

async function requestBody(input: RequestInfo | URL, init?: RequestInit) {
  if (typeof init?.body === 'string') return JSON.parse(init.body) as Record<string, unknown>;
  if (input instanceof Request) return await input.clone().json() as Record<string, unknown>;
  return {};
}

export function installStaticApi() {
  const markedWindow = window as Window & { [INSTALL_MARKER]?: boolean };
  if (markedWindow[INSTALL_MARKER]) return;
  markedWindow[INSTALL_MARKER] = true;
  const networkFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const requestUrl = new URL(
      input instanceof Request ? input.url : String(input),
      window.location.href,
    );
    const marker = '/api/';
    const markerIndex = requestUrl.pathname.lastIndexOf(marker);
    if (markerIndex === -1) return networkFetch(input, init);

    const endpoint = requestUrl.pathname.slice(markerIndex + marker.length);
    const state = readState();

    if (endpoint === 'bootstrap') return json(bootstrap(state));

    if (endpoint === 'answer') {
      const body = await requestBody(input, init);
      const questionId = typeof body.questionId === 'string' ? body.questionId : '';
      const selected = Array.isArray(body.selected)
        ? body.selected.filter((value): value is string => typeof value === 'string')
        : [];
      const question = QUESTIONS.find((item) => item.id === questionId);
      if (!question || selected.length === 0) {
        return json({ error: 'Choose an answer before submitting.' }, 400);
      }

      const isCorrect = sameAnswer(question, selected);
      state.responses = [
        ...state.responses.filter((response) => response.questionId !== question.id),
        { questionId: question.id, answer: selected, isCorrect },
      ];
      state.currentQuestion = Math.max(
        state.currentQuestion,
        Math.min(30, question.questionNumber + 1),
      );
      writeState(state);
      return json({
        isCorrect,
        feedback: isCorrect ? question.correctFeedback : question.incorrectFeedback,
        correctAnswer: question.correctAnswer || [],
        criticalSafeguarding: question.criticalSafeguarding,
      });
    }

    if (endpoint === 'finalize') {
      if (state.responses.length < 30) {
        return json({ error: 'ASSESSMENT_INCOMPLETE' }, 400);
      }
      const score = state.responses.filter((response) => response.isCorrect).length;
      const percentage = Math.round((score / 30) * 100);
      const passed = percentage >= DEFAULT_PASS_THRESHOLD;
      const completedAt = Date.now();
      state.score = score;
      state.percentage = percentage;
      state.completedAt = completedAt;
      state.status = passed ? 'PASSED' : 'NEEDS_ANOTHER_ATTEMPT';
      state.currentQuestion = 30;
      writeState(state);
      const moduleScores = courseModules.map((module) => {
        const ids = QUESTIONS.filter((question) => question.module === module.id).map((question) => question.id);
        return {
          module: module.id,
          correct: state.responses.filter((response) => ids.includes(response.questionId) && response.isCorrect).length,
          total: ids.length,
        };
      });
      return json({ score, percentage, passed, threshold: DEFAULT_PASS_THRESHOLD, completedAt, moduleScores });
    }

    if (endpoint === 'retake') {
      writeState(freshState(state.attemptNumber + 1));
      return json({ ok: true });
    }

    return json({ error: 'This API is unavailable in the GitHub Pages version.' }, 404);
  };
}
