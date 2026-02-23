export type Section =
  | 'english'
  | 'math'
  | 'reading'
  | 'science';

export const SECTIONS: Section[] = [
  'english',
  'math',
  'reading',
  'science',
];

export const SECTION_LABELS: Record<Section, string> = {
  english: 'English',
  math: 'Math',
  reading: 'Reading',
  science: 'Science',
};

export const SECTION_COLORS: Record<Section, string> = {
  english: 'bg-blue-100 text-blue-800',
  math: 'bg-purple-100 text-purple-800',
  reading: 'bg-green-100 text-green-800',
  science: 'bg-orange-100 text-orange-800',
};

// Real ACT question counts per section
export const SECTION_QUESTION_COUNTS: Record<Section, number> = {
  english: 75,
  math: 60,
  reading: 40,
  science: 40,
};

// Real ACT time limits per section (seconds)
export const SECTION_TIME_LIMITS: Record<Section, number> = {
  english: 45 * 60,  // 2700s
  math: 60 * 60,     // 3600s
  reading: 35 * 60,  // 2100s
  science: 35 * 60,  // 2100s
};

// Section order in a full ACT exam
export const EXAM_SECTION_ORDER: Section[] = ['english', 'math', 'reading', 'science'];

// Total full exam time
export const FULL_EXAM_TIME_SECONDS =
  SECTION_TIME_LIMITS.english +
  SECTION_TIME_LIMITS.math +
  SECTION_TIME_LIMITS.reading +
  SECTION_TIME_LIMITS.science; // 10500s = 175 min

// Keep Topic as alias for Section for DB compatibility
export type Topic = Section;
export const TOPICS = SECTIONS;
export const TOPIC_LABELS = SECTION_LABELS;
export const TOPIC_COLORS = SECTION_COLORS;

export interface Question {
  id: number;
  source: string;
  sourceYear: number | null;
  topic: Section;
  difficulty: 'easy' | 'medium' | 'hard';
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string | null;
  passageContext: string | null;
  pageNumber: number | null;
  createdAt: string;
}

export interface StudyCard {
  id: number;
  topic: Section;
  front: string;
  back: string;
  generatedDate: string;
  source: 'claude' | 'question-derived';
  createdAt: string;
}

export interface CardReview {
  id: number;
  cardId: number;
  result: 'easy' | 'hard' | 'again';
  reviewedAt: string;
}

export interface ExamSession {
  id: number;
  sessionType: 'exam' | 'quiz';
  startedAt: string;
  completedAt: string | null;
  timeLimitSeconds: number;
  score: number | null;
  topicBreakdown: string | null;
}

export interface SessionAnswer {
  id: number;
  sessionId: number;
  questionId: number;
  selectedAnswer: 'A' | 'B' | 'C' | 'D' | null;
  isCorrect: boolean;
  answeredAt: string;
}

export interface PerformanceRecord {
  id: number;
  topic: Section;
  date: string;
  totalAttempted: number;
  totalCorrect: number;
  accuracyRate: number;
  source: 'exam' | 'quiz' | 'flashcard';
}

export interface TopicWeight {
  topic: Section;
  weight: number;
  lastUpdated: string;
}

export interface TopicBreakdown {
  [section: string]: { correct: number; total: number };
}

export interface ACTScoreBreakdown {
  english: number;
  math: number;
  reading: number;
  science: number;
  composite: number;
}
